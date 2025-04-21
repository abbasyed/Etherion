# Etherion Token Project - Complete Setup Guide

This guide will walk you through setting up and deploying your enhanced Etherion token and web application.

## Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)
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
npm install --save-dev hardhat @nomicfoundation/hardhat-ethers @nomicfoundation/hardhat-chai-matchers ethers chai @openzeppelin/contracts
```

### 2. Initialize Hardhat

```bash
npx hardhat
```

Choose "Create a JavaScript project" when prompted.

### 3. Create the Etherion token contract

Replace the default contract in the contracts folder with your Etherion.sol file.

### 4. Configure Hardhat

Update the

hardhat.config.js

file:

```javascript
const path = require("path");

require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("solidity-coverage");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
      {
        version: "0.8.28",
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
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
```

### 5. Deploy the contract

Create a deployment script in the scripts folder:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Interact with the contract

You can interact with your deployed contract using the interact.js script:

```bash
npx hardhat run scripts/interact.js --network localhost
```

## Part 2: Frontend Development

### 1. Set up the React application

```bash
# Install frontend dependencies
npm install web3modal @web3-react/core @web3-react/injected-connector @walletconnect/web3-provider ethers react react-dom react-scripts react-app-rewired
```

### 2. Configure React App

Create a

config-overrides.js

file to handle Web3 dependencies:

```javascript
const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    buffer: require.resolve("buffer"),
    process: require.resolve("process/browser"),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
```

### 3. Update

package.json

scripts

```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
}
```

### 4. Create contract configuration

Create a contractConfig.js file in your src directory:

```javascript
import { abi } from "../artifacts/contracts/Etherion.sol/Etherion.json";

export const EtherionABI = abi;
export const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 5. Run the application

```bash
npm start
```

## Part 3: Testing

### 1. Connect with MetaMask

- Add the local network to MetaMask (http://localhost:8545, Chain ID: 31337)
- Import a private key from your Hardhat node
- Connect to the application

### 2. Test functionality

- Check token balance
- Transfer tokens to another address
- Test fee deduction
- Test owner functions (if applicable)

## Part 4: Deployment

For deploying to public networks:

1. Update

hardhat.config.js

with your network details 2. Deploy using:

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

3. Update the contract address in your frontend

## Project Structure

```
etherion-project/
├── contracts/           # Solidity contracts
├── scripts/             # Deployment and interaction scripts
├── test/                # Contract tests
├── artifacts/           # Compiled contract data
├── src/                 # React frontend
│   ├── App.js           # Main application
│   └── contractConfig.js # Contract configuration
├── config-overrides.js  # Webpack configuration
├── hardhat.config.js    # Hardhat configuration
└── package.json         # Project dependencies
```

## License

This project is licensed under the MIT License.

## Contributors

- [Abbas](https://github.com/abbasyed)

---

Note: This project is for educational purposes only. Always perform proper security audits before deploying to mainnet.
