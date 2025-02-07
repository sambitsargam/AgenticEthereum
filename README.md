# AgentLink: Bridging Blockchain with SMS and WhatsApp Messaging

## Overview

AgentLink is an innovative SMS and WhatsApp messaging agent built on Base Chain. It empowers users to perform on-chain transactions, send funds, deploy and mint NFTs, and even create and manage smart contracts—all through simple text-based communication. This approach bridges the gap between advanced blockchain functionalities and mainstream communication platforms.

## Why AgentLink?

Most AI-powered bots are built on platforms like Telegram, leaving out a significant global user base that relies on WhatsApp or SMS for primary communication. In many regions, people are unaware of Telegram but actively use WhatsApp and SMS. Additionally, SMS works efficiently in areas with low internet connectivity, making blockchain accessible to underconnected regions.

## Reason Behind Building AgentLink

The inspiration for AgentLink came from a profound realization: **blockchain technology should be universally accessible, regardless of internet quality or platform familiarity.**

- **Global Accessibility**: People in remote areas often rely on SMS and WhatsApp due to limited internet connectivity and a lack of exposure to platforms like Telegram.
- **Digital Inclusion**: By integrating blockchain with common messaging services, AgentLink levels the playing field, bringing decentralized finance (DeFi) to underserved populations.
- **Seamless Adoption**: Using familiar tools ensures minimal learning curves, accelerating blockchain adoption.
- **Resilience**: Even in areas with unstable internet, SMS ensures uninterrupted communication, making on-chain transactions more reliable.

## Key Features

- **Seamless Transactions**: Execute on-chain transactions such as sending funds, minting NFTs, and deploying smart contracts.
- **Cross-Platform Communication**: Use WhatsApp and SMS for secure blockchain interactions.
- **Autonomous Agents**: Use AI-driven logic to automate transactions and manage wallets.
- **Gaia Node Integration**: Leverages a Gaia node running an LLM optimized for tool calling, or connects to the public Gaia node.
- **AVS Eigen Layer Integration**: Ensures enhanced security and validation of transactions through decentralized trust mechanisms.

## How It Works

1. **User Interaction**: Users send instructions via SMS or WhatsApp.
2. **Agent Processing**: AgentLink interprets the message using the Coinbase AgentKit integrated with a Gaia node LLM.
3. **On-Chain Execution**: The AgentKit processes the request and executes transactions on Base Chain.
4. **AVS Validation**: The transaction is validated through AVS Eigen Layer, ensuring trust and security.
5. **Feedback Loop**: Users receive real-time transaction updates.

## AVS Eigen Layer Usage

AgentLink utilizes AVS (Active Validation Services) through the Eigen Layer to enhance security and validation of transactions. The AVS framework provides:
- **Decentralized Trust**: By leveraging AVS, AgentLink ensures that transactions are independently validated by a decentralized network, reducing reliance on a single entity.
- **Scalability & Efficiency**: AVS optimizes transaction validation, ensuring quick and secure execution on Base Chain.
- **Enhanced Security**: Transactions processed through AgentLink gain an additional layer of security by being validated via Eigen Layer's restaking mechanism, preventing fraudulent activities.

## Integration Details

- **Platform Used**: Coinbase AgentKit
- **Blockchain**: Base Chain
- **Communication Channels**: WhatsApp, SMS
- **LLM Provider**: Gaia Node (public endpoint)
- **Validation**: AVS Eigen Layer for transaction security

**API Endpoint**: [https://llamatool.us.gaianet.network/v1](https://llamatool.us.gaianet.network/v1)  
**Model Name**: llama  
**API Key**: gaia  

## Conclusion

AgentLink reshapes blockchain accessibility by merging familiar communication tools with powerful on-chain capabilities. With the integration of Coinbase AgentKit, Base Chain, and AVS Eigen Layer, it ensures a secure, scalable, and innovative solution fit for broad adoption and impactful blockchain engagement.
