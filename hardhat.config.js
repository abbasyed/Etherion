require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("solidity-coverage");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
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
  // Add this paths section for explicit import resolution
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // Optional: Add explicit remappings if needed
  // This tells Hardhat where to look for @openzeppelin imports
  solidity: {
    // Keep your existing compilers config
    compilers: [{ version: "0.8.20" }, { version: "0.8.28" }],
    // Add settings with remappings if needed
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
