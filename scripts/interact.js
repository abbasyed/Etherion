const hre = require("hardhat");

async function main() {
  // Get the contract factory and deployed contract
  const Etherion = await ethers.getContractFactory("Etherion");

  // Replace with your actual deployed contract address from the deployment step
  const etherionAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update this!
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
  console.log(
    `Total Supply: ${ethers.utils.formatEther(totalSupply)} ${symbol}`
  );

  // Get owner balance
  const ownerBalance = await etherion.balanceOf(owner.address);
  console.log(
    `Owner Balance: ${ethers.utils.formatEther(ownerBalance)} ${symbol}`
  );

  // Transfer some tokens to addr1
  const transferAmount = ethers.utils.parseEther("1000");
  console.log(
    `Transferring ${ethers.utils.formatEther(transferAmount)} ${symbol} to ${
      addr1.address
    }`
  );
  await etherion.transfer(addr1.address, transferAmount);

  // Get updated balances
  const updatedOwnerBalance = await etherion.balanceOf(owner.address);
  const addr1Balance = await etherion.balanceOf(addr1.address);
  console.log(
    `Updated Owner Balance: ${ethers.utils.formatEther(
      updatedOwnerBalance
    )} ${symbol}`
  );
  console.log(
    `Recipient Balance: ${ethers.utils.formatEther(addr1Balance)} ${symbol}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
