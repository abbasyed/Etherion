# Etherion Token Project - Complete Setup Guide

This guide will walk you through setting up and deploying your enhanced Etherion token and web application.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Git

## Part 1: Smart Contract Development

### 1. Set up the Hardhat project

```bash
# Create a new directory for your project
mkdir etherion-project
cd etherion-project

# Initialize npm
npm init -y

# Install Hardhat and dependencies
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts
```

### 2. Initialize Hardhat

```bash
npx hardhat
```

Choose "Create a JavaScript project" when prompted.

### 3. Replace the default contracts

Delete the sample Lock.sol contract in the contracts folder and create a new file called `EnhancedEtherion.sol` with the content from the EnhancedEtherion.sol artifact.

### 4. Update the deployment script

Replace the content of `scripts/deploy.js` with the content from the deploy-enhanced.js artifact.

### 5. Create a test file

Create a new file in the test directory called `EnhancedEtherion-test.js` with the content from the EnhancedEtherion-test.js artifact.

### 6. Update hardhat.config.js

Make sure your hardhat.config.js file includes the proper compiler version:

```javascript
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
  },
  networks: {
    hardhat: {
      // Local development network
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
};
```

### 7. Compile and test the contract

```bash
# Compile the contract
npx hardhat compile

# Run tests
npx hardhat test
```

### 8. Deploy the contract locally

First, start a local Hardhat node:

```bash
npx hardhat node
```

In a new terminal window, deploy the contract to the local node:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Make sure to save the contract address that is output after deployment. You'll need it for the web application.

## Part 2: Web Application Development

### 1. Create a new React application

```bash
# From your project root
mkdir etherion-dapp
cd etherion-dapp

# Initialize a new React app
npx create-react-app .

# Install required dependencies
npm install ethers web3modal @walletconnect/web3-provider
```

### 2. Set up contract artifacts

Create a new directory in the src folder for your contract artifacts:

```bash
mkdir -p src/artifacts/contracts/EnhancedEtherion.sol
```

Copy the compiled contract artifact from your Hardhat project:

```bash
cp ../artifacts/contracts/EnhancedEtherion.sol/EnhancedEtherion.json src/artifacts/contracts/EnhancedEtherion.sol/
```

### 3. Create the React components

Replace the content of the following files with the content from the etherion-dapp artifact:

- src/App.js
- src/App.css
- public/index.html

### 4. Update the contract address

In src/App.js, replace "YOUR_CONTRACT_ADDRESS" with the address of your deployed contract.

Also replace "YOUR_INFURA_ID" with your Infura project ID, or you can use a different provider.

### 5. Start the web application

```bash
npm start
```

Your application should now be running on http://localhost:3000.

## Features Overview

### Enhanced Smart Contract Features

1. **Token Burning**: Users can burn their tokens, permanently removing them from circulation.
2. **Transfer Fees**: A small fee is applied to each transfer, which is sent to a designated fee collector.
3. **Whitelist**: Certain addresses can be exempt from transfer fees.
4. **Ownership Control**: Only the contract owner can perform administrative functions like minting new tokens or changing fees.
5. **Statistics Tracking**: The contract tracks metrics like total burned tokens and total fees collected.

### Web Application Features

1. **Wallet Connection**: Users can connect with MetaMask or other Ethereum wallets.
2. **Token Information**: View token statistics like total supply, burned tokens, etc.
3. **Transfer Tokens**: Send tokens to other addresses.
4. **Burn Tokens**: Burn your own tokens to reduce supply.
5. **Admin Panel**: For the contract owner, additional controls for setting fees and managing the whitelist.

## Deployment to a Public Testnet

To deploy to a public testnet like Goerli or Sepolia:

1. Get some testnet ETH from a faucet.
2. Update your `hardhat.config.js` to include the testnet configuration:

```javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// Create a .env file with your private key and Infura API key
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20"
      }
    ]
  },
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${
```
