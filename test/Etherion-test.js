const { expect } = require("chai");

describe("Etherion", function () {
  let Etherion;
  let etherion;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    Etherion = await ethers.getContractFactory("Etherion");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy with 1 million initial supply
    etherion = await Etherion.deploy(1000000, owner.address);
    await etherion.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await etherion.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await etherion.balanceOf(owner.address);
      expect(await etherion.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the default fee to 0.5%", async function () {
      expect(await etherion.feePercentage()).to.equal(50);
    });
  });

  describe("Fee Management", function () {
    it("Should allow owner to change fee percentage", async function () {
      await etherion.setFeePercentage(100); // Set to 1%
      expect(await etherion.feePercentage()).to.equal(100);
    });

    it("Should not allow fee to exceed 10%", async function () {
      await expect(etherion.setFeePercentage(1001)).to.be.revertedWith(
        "Fee cannot exceed 10%"
      );
    });

    it("Should allow owner to change fee collector", async function () {
      await etherion.setFeeCollector(addr1.address);
      expect(await etherion.feeCollector()).to.equal(addr1.address);
    });
  });

  describe("Transfers with Fees", function () {
    it("Should transfer tokens with correct fee deduction", async function () {
      const initialOwnerBalance = await etherion.balanceOf(owner.address);
      const transferAmount = 1000;

      // Transfer tokens from owner to addr1
      await etherion.transfer(addr1.address, transferAmount);

      // Calculate expected fee (0.5% of 1000 = 5)
      const expectedFee = Math.floor((transferAmount * 50) / 10000);
      const expectedReceivedAmount = transferAmount - expectedFee;

      // Check balances
      expect(await etherion.balanceOf(addr1.address)).to.equal(
        expectedReceivedAmount
      );
      expect(await etherion.balanceOf(owner.address)).to.equal(
        initialOwnerBalance - transferAmount + expectedFee
      );
    });
  });

  describe("Pausable Functionality", function () {
    it("Should allow owner to pause and unpause transfers", async function () {
      await etherion.pause();
      await expect(etherion.transfer(addr1.address, 1000)).to.be.revertedWith(
        "Pausable: paused"
      );

      await etherion.unpause();
      await expect(etherion.transfer(addr1.address, 1000)).not.to.be.reverted;
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const initialSupply = await etherion.totalSupply();
      const mintAmount = 50000;

      await etherion.mint(addr1.address, mintAmount);

      expect(await etherion.totalSupply()).to.equal(
        initialSupply.add(mintAmount)
      );
      expect(await etherion.balanceOf(addr1.address)).to.equal(mintAmount);
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their tokens", async function () {
      // First transfer some tokens to addr1
      await etherion.transfer(addr1.address, 1000);

      const initialSupply = await etherion.totalSupply();
      const burnAmount = 500;

      // Burn tokens from addr1
      await etherion.connect(addr1).burn(burnAmount);

      expect(await etherion.totalSupply()).to.equal(
        initialSupply.sub(burnAmount)
      );
      expect(await etherion.balanceOf(addr1.address)).to.be.lessThan(500); // Less than 500 due to fee on transfer
    });
  });
});
