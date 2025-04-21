import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import "./App.css";

// Import your contract ABI here
// import EtherionABI from './artifacts/contracts/Etherion.sol/Etherion.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);

  // Replace with your actual deployed contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";// Use your actual deployed address;

  async function connectWallet() {
    try {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "YOUR_INFURA_ID", // Replace with your Infura ID
          },
        },
      };

      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);

      // Connect to the contract (uncomment when you have your ABI)
      // const etherionContract = new ethers.Contract(contractAddress, EtherionABI.abi, signer);
      // setContract(etherionContract);
      // const bal = await etherionContract.balanceOf(address);
      // setBalance(ethers.formatEther(bal));

      return provider;
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }

  useEffect(() => {
    // Auto-connect if previously connected
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Etherion DApp</h1>
        {!account ? (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        ) : (
          <div className="account-info">
            <p>
              Connected Account: {account.substring(0, 6)}...
              {account.substring(account.length - 4)}
            </p>
            <p>Balance: {balance} ETH</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
