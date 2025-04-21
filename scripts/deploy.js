async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Etherion with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await ethers.provider.getBalance(deployer.address)).toString()
  );

  const Etherion = await ethers.getContractFactory("Etherion");
  // Deploy with 1,000,000 tokens initial supply
  const etherion = await Etherion.deploy(1000000, deployer.address);

  // Wait for contract to be deployed
  await etherion.waitForDeployment();

  console.log("Etherion Token address:", await etherion.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
