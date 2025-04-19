import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Directory: src/
// File: App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import './App.css';
import EnhancedEtherion from './artifacts/contracts/EnhancedEtherion.sol/EnhancedEtherion.json';

// Replace with your contract address
const etherionAddress = "YOUR_CONTRACT_ADDRESS";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [tokenStats, setTokenStats] = useState({
    totalSupply: 0,
    totalBurned: 0,
    totalFeeCollected: 0,
    currentFee: 0
  });
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [newFee, setNewFee] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [whitelist, setWhitelist] = useState('');

  // Setup Web3Modal
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "YOUR_INFURA_ID", // Replace with your Infura ID
        }
      }
    }
  });

  useEffect(() => {
    // If user has already connected wallet before, connect automatically
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  async function connectWallet() {
    try {
      const web3Provider = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(etherionAddress, EnhancedEtherion.abi, signer);
      
      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setContract(contract);

      // Check if connected account is the owner
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
      
      // Load token data
      await refreshData();

      // Setup event listeners
      web3Provider.on("accountsChanged", (accounts) => {
        window.location.reload();
      });

      web3Provider.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }

  async function disconnectWallet() {
    await web3Modal.clearCachedProvider();
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setContract(null);
    setBalance(0);
  }

  async function refreshData() {
    if (!contract) return;

    try {
      // Get token balance
      const balance = await contract.balanceOf(account);
      setBalance(ethers.utils.formatEther(balance));

      // Get token stats
      const stats = await contract.getTokenStats();
      setTokenStats({
        totalSupply: ethers.utils.formatEther(stats._totalSupply),
        totalBurned: ethers.utils.formatEther(stats._totalBurned),
        totalFeeCollected: ethers.utils.formatEther(stats._totalFeeCollected),
        currentFee: stats._currentFee.toNumber() / 100 // Convert basis points to percentage
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  }

  async function handleTransfer(e) {
    e.preventDefault();
    if (!contract || !transferTo || !transferAmount) return;

    try {
      const tx = await contract.transfer(
        transferTo,
        ethers.utils.parseEther(transferAmount)
      );
      await tx.wait();
      alert("Transfer successful!");
      setTransferTo('');
      setTransferAmount('');
      await refreshData();
    } catch (error) {
      console.error("Error transferring tokens:", error);
      alert("Transfer failed: " + error.message);
    }
  }

  async function handleBurn(e) {
    e.preventDefault();
    if (!contract || !burnAmount) return;

    try {
      const tx = await contract.burn(
        ethers.utils.parseEther(burnAmount)
      );
      await tx.wait();
      alert("Tokens burned successfully!");
      setBurnAmount('');
      await refreshData();
    } catch (error) {
      console.error("Error burning tokens:", error);
      alert("Burn failed: " + error.message);
    }
  }

  async function handleSetFee(e) {
    e.preventDefault();
    if (!contract || !newFee || !isOwner) return;

    try {
      // Convert percentage to basis points (e.g., 0.5% -> 50)
      const feeInBasisPoints = Math.floor(parseFloat(newFee) * 100);
      const tx = await contract.setTransferFee(feeInBasisPoints);
      await tx.wait();
      alert("Transfer fee updated successfully!");
      setNewFee('');
      await refreshData();
    } catch (error) {
      console.error("Error setting fee:", error);
      alert("Fee update failed: " + error.message);
    }
  }

  async function handleAddToWhitelist(e) {
    e.preventDefault();
    if (!contract || !whitelist || !isOwner) return;

    try {
      const tx = await contract.addToWhitelist(whitelist);
      await tx.wait();
      alert("Address added to whitelist successfully!");
      setWhitelist('');
      await refreshData();
    } catch (error) {
      console.error("Error adding to whitelist:", error);
      alert("Whitelist update failed: " + error.message);
    }
  }

  async function handleRemoveFromWhitelist(e) {
    e.preventDefault();
    if (!contract || !whitelist || !isOwner) return;

    try {
      const tx = await contract.removeFromWhitelist(whitelist);
      await tx.wait();
      alert("Address removed from whitelist successfully!");
      setWhitelist('');
      await refreshData();
    } catch (error) {
      console.error("Error removing from whitelist:", error);
      alert("Whitelist update failed: " + error.message);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Etherion Token Dashboard</h1>
        {!account ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div>
            <p>Connected Account: {account}</p>
            <p>ETN Balance: {balance}</p>
            <button onClick={disconnectWallet}>Disconnect</button>
            <button onClick={refreshData}>Refresh Data</button>
            
            <div className="card">
              <h2>Token Statistics</h2>
              <p>Total Supply: {tokenStats.totalSupply} ETN</p>
              <p>Total Burned: {tokenStats.totalBurned} ETN</p>
              <p>Total Fee Collected: {tokenStats.totalFeeCollected} ETN</p>
              <p>Current Transfer Fee: {tokenStats.currentFee}%</p>
            </div>
            
            <div className="card">
              <h2>Transfer Tokens</h2>
              <form onSubmit={handleTransfer}>
                <div>
                  <label>Recipient Address:</label>
                  <input 
                    type="text" 
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="0x..."
                  />
                </div>
                <div>
                  <label>Amount (ETN):</label>
                  <input 
                    type="text" 
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <button type="submit">Transfer</button>
              </form>
            </div>
            
            <div className="card">
              <h2>Burn Tokens</h2>
              <form onSubmit={handleBurn}>
                <div>
                  <label>Amount to Burn (ETN):</label>
                  <input 
                    type="text" 
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <button type="submit">Burn</button>
              </form>
            </div>
            
            {isOwner && (
              <div>
                <div className="card">
                  <h2>Admin: Set Transfer Fee</h2>
                  <form onSubmit={handleSetFee}>
                    <div>
                      <label>New Fee (%):</label>
                      <input 
                        type="text" 
                        value={newFee}
                        onChange={(e) => setNewFee(e.target.value)}
                        placeholder="0.5"
                      />
                    </div>
                    <button type="submit">Update Fee</button>
                  </form>
                </div>
                
                <div className="card">
                  <h2>Admin: Manage Whitelist</h2>
                  <form>
                    <div>
                      <label>Address:</label>
                      <input 
                        type="text" 
                        value={whitelist}
                        onChange={(e) => setWhitelist(e.target.value)}
                        placeholder="0x..."
                      />
                    </div>
                    <button onClick={handleAddToWhitelist}>Add to Whitelist</button>
                    <button onClick={handleRemoveFromWhitelist}>Remove from Whitelist</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
