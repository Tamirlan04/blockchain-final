# Decentralized Crowdfunding Application

Final Examination Project for Blockchain 1 Course.
This repository contains the source code for a decentralized application (DApp) that enables users to create fundraising campaigns, contribute ETH, and automatically receive reward tokens.

---

## 1. Smart Contract Architecture

The core logic of the application is built upon Solidity smart contracts designed to handle campaign management and fund transfers securely.

### Core Implementation (Donation.sol)
The `Donation` contract serves as the main entry point for the application. It manages the state of all crowdfunding campaigns and handles incoming donations.

**Key Technical Decisions:**
* **Data Structure:** A `struct Campaign` is used to store essential data (creator, title, goal, raised amount, and active status) efficiently on-chain.
* **Event-Driven Architecture:** The contract emits `CampaignCreated` and `DonationReceived` events. This allows the frontend to react to blockchain state changes in real-time without constant polling.
* **Security Checks:** The `donate` function implements `require` statements to validate inputs (e.g., ensuring the campaign exists and the donation amount is positive) before processing transactions.

### Workflow
1.  **Initialization:** Upon deployment, the Donation contract deploys the RewardToken contract, ensuring ownership and minting rights are correctly established.
2.  **Campaign Creation:** Users call `createCampaign`, which initializes a new campaign struct and stores it in the blockchain state.
3.  **Donation Logic:** When `donate` is called:
    * The contract verifies the campaign status.
    * ETH is added to the campaign's `raised` balance.
    * The contract calculates the reward amount and calls the `RewardToken` contract to mint tokens for the donor.

---

## 2. Tokenization System

This section details the design and implementation of the custom ERC-20 token system, fulfilling all tokenization requirements for the project.

### Core Implementation (RewardToken.sol)
A custom ERC-20 Reward Token (DRWD) was developed to demonstrate the bridge between traditional crowdfunding and blockchain-based incentive systems.

**Key Features:**
* **Automated Minting Engine:** A "Mint-on-Participation" logic was implemented. The token is not pre-mined; instead, it is generated automatically by the smart contract exactly at the moment a user contributes to a campaign.
* **Proportional Reward Logic:** The system calculates rewards algorithmically. For every contribution, the contract issues tokens at a fixed ratio (100 DRWD per 1 ETH), demonstrating the concept of digital asset issuance.
* **Controlled Supply:** A strict access control mechanism was integrated where only the authorized Crowdfunding contract has the MINTER_ROLE. This ensures the integrity of the token supply.

### Requirements Compliance

| Requirement | Implementation Detail |
| :--- | :--- |
| Automatic Minting | Integrated `_mint()` calls directly into the participation transaction flow. |
| No Real Monetary Value | Deployed on local Hardhat network and Sepolia testnet for zero-cost testing. |
| Educational Purpose | Designed as a "Reward-only" utility token to show how participation can be digitized. |
| Tokenization Concepts | Demonstrates minting, balance tracking, and contract-to-contract interaction. |

---

## 3. Frontend Implementation

The client-side application provides a user-friendly interface for interacting with the blockchain, built using vanilla JavaScript and the Ethers.js library.

### Key Features
* **MetaMask Integration:** The application detects the `window.ethereum` provider to request account access and sign transactions securely.
* **Network Validation:** It ensures the user is connected to the correct network (Hardhat Localhost or Sepolia) to prevent loss of funds.
* **Real-Time Data Reading:** The frontend utilizes `ethers.Contract` to fetch the current state of campaigns (goals, raised amounts) directly from the blockchain without a backend database.
* **Transaction Handling:**
    * **Write Operations:** Functions like `createCampaign` and `donate` initiate MetaMask pop-ups for user confirmation.
    * **Feedback Loop:** The interface awaits transaction confirmation blocks before updating the UI, ensuring data consistency.

### Technical Stack
* **Language:** JavaScript (ES6+)
* **Library:** Ethers.js (v6) for blockchain interaction.
* **Styling:** CSS3 for responsive layout.

---

## 4. Installation and Execution

Follow these steps to deploy and run the project locally.

### Prerequisites
* Node.js installed.
* MetaMask browser extension.

### Step 1: Install Dependencies
```shell
npm install
