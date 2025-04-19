const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Etherion with the account:", deployer.address);

  // Initial token supply: 1,000,000 tokens
  const initialSupply = 1000000;

  const Etherion = await ethers.getContractFactory("Etherion");
  const etherion = await Etherion.deploy(initialSupply, deployer.address);

  await etherion.deployed();

  console.log("Etherion deployed to:", etherion.address);
  console.log("Initial supply:", initialSupply, "ETN");
  console.log("Owner:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
