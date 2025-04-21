const hre = require("hardhat");

async function main() {
  // Get the contract factory and deployed contract
  const Etherion = await ethers.getContractFactory("Etherion");

  // Replace with your actual deployed contract address from the deployment step
  const etherionAddress = "YOUR_ADDRESS"; // Update this!
  const etherion = await Etherion.attach(etherionAddress);

  // Get the accounts
  const [owner, addr1] = await ethers.getSigners();

  // Get token name and symbol
  const name = await etherion.name();
  const symbol = await etherion.symbol();
  console.log(`Token Name: ${name}`);
  console.log(`Token Symbol: ${symbol}`);

  // Get token total supply
  const totalSupply = await etherion.totalSupply();
  console.log(`Total Supply: ${ethers.formatEther(totalSupply)} ${symbol}`);

  // Get token balance of owner
  const ownerBalance = await etherion.balanceOf(owner.address);
  console.log(`Owner Balance: ${ethers.formatEther(ownerBalance)} ${symbol}`);

  // Transfer tokens from owner to addr1
  console.log(`Transferring 1000 ${symbol} tokens to ${addr1.address}...`);
  const transferAmount = ethers.parseEther("1000");
  const tx = await etherion.transfer(addr1.address, transferAmount);
  await tx.wait();
  console.log("Transfer complete!");

  // Check updated balances
  const ownerBalanceAfter = await etherion.balanceOf(owner.address);
  const addr1Balance = await etherion.balanceOf(addr1.address);
  console.log(
    `Owner Balance After: ${ethers.formatEther(ownerBalanceAfter)} ${symbol}`
  );
  console.log(
    `Recipient Balance: ${ethers.formatEther(addr1Balance)} ${symbol}`
  );

  // Get the fee percentage
  const feePercentage = await etherion.feePercentage();
  // Convert the BigInt to a string or number before division
  console.log(`Fee Percentage: ${Number(feePercentage) / 100}%`);

  // Check if token is paused
  const isPaused = await etherion.paused();
  console.log(`Token is Paused: ${isPaused}`);

  // If you're the owner, you can pause/unpause the token
  if ((await etherion.owner()) === owner.address) {
    console.log("You are the contract owner. You can pause/unpause the token.");

    if (!isPaused) {
      console.log("Pausing token transfers...");
      const pauseTx = await etherion.pause();
      await pauseTx.wait();
      console.log("Token paused successfully!");
    } else {
      console.log("Unpausing token transfers...");
      const unpauseTx = await etherion.unpause();
      await unpauseTx.wait();
      console.log("Token unpaused successfully!");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
