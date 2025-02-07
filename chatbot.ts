import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import express from 'express';
import twilio from "twilio";

dotenv.config();

// Twilio Credentials from environment variables
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;  // Your Twilio sandbox number
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const WALLET_DATA_FILE = "wallet_data.txt";

// Validate Environment Variables
function validateEnvironment(): void {
  const missingVars: string[] = [];
  const requiredVars = ["CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY", "TWILIO_PHONE_NUMBER", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"];
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach(varName => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  if (!process.env.NETWORK_ID) {
    console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
}

// Validate the environment
validateEnvironment();

// Initialize the agent
async function initializeAgent() {
  try {
    const llm = new ChatOpenAI({
      apiKey: "gaia",
      model: "llama",
      configuration: {
        baseURL: "https://llamatool.us.gaianet.network/v1",
      },
    });

    let walletDataStr: string | null = null;
    if (fs.existsSync(WALLET_DATA_FILE)) {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
    }

    const config = {
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    const agentkit = await CdpAgentkit.configureWithWallet(config);
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();
    const memory = new MemorySaver();
    const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `You are a helpful agent that can interact on-chain using the Coinbase Developer Platform AgentKit.`,
    });

    const exportedWallet = await agentkit.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}

// Generate agent response
async function getAgentResponse(incomingMsg: string) {
  const { agent, config } = await initializeAgent();

  const stream = await agent.stream({ messages: [new HumanMessage(incomingMsg)] }, config);
  let agentResponse = "";

  for await (const chunk of stream) {
    if ("agent" in chunk) {
      agentResponse = chunk.agent.messages[0].content;
    } else if ("tools" in chunk) {
      agentResponse = chunk.tools.messages[0].content;
    }
  }

  return agentResponse;
}

// Send WhatsApp message
async function sendWhatsAppMessage(agentResponse: string, from: string) {
  await client.messages.create({
    body: agentResponse,
    from: `whatsapp:+14155238886`,  // Your Twilio WhatsApp sandbox number
    to: `${from}`,  // Ensure to prefix the incoming number with "whatsapp:"
  });

  console.log("WhatsApp message sent successfully:", agentResponse);
}

// Send SMS message
async function sendSMSMessage(agentResponse: string, from: string) {
  await client.messages.create({
    body: agentResponse,
    from: TWILIO_PHONE_NUMBER,  // Your Twilio phone number
    to: from,
  });

  console.log("SMS message sent successfully:", agentResponse);
}

// Set up the webhook to receive incoming messages
const app = express();
const port = process.env.PORT || 3000;

// Parse incoming request data
app.use(express.urlencoded({ extended: false }));

// Route to handle incoming SMS
app.post("/sms", async (req, res) => {
  const from = req.body.From;  // The sender's phone number
  const body = req.body.Body;  // The message text

  console.log(`Received SMS message from ${from}: ${body}`);

  try {
    const agentResponse = await getAgentResponse(body);
    await sendSMSMessage(agentResponse, from);
    res.status(200).send("<Response></Response>");
  } catch (error) {
    console.error("Error handling SMS:", error);
    res.status(500).send("<Response></Response>");
  }
});

// Route to handle incoming WhatsApp messages
app.post("/whatsapp", async (req, res) => {
  const from = req.body.From;  // The sender's phone number
  const body = req.body.Body;  // The message text

  console.log(`Received WhatsApp message from ${from}: ${body}`);

  try {
    const agentResponse = await getAgentResponse(body);
    await sendWhatsAppMessage(agentResponse, from);
    res.status(200).send("<Response></Response>");
  } catch (error) {
    console.error("Error handling WhatsApp:", error);
    res.status(500).send("<Response></Response>");
  }
});

app.listen(port, () => {
  console.log(`Listening for messages on port ${port}`);
});
