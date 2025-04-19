const { expect } = require("chai");

describe("EnhancedEtherion", function () {
  let EnhancedEtherion;
  let etherion;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    EnhancedEtherion = await ethers.getContractFactory("EnhancedEtherion");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy with 1 million initial supply and 0.5% fee
    etherion = await EnhancedEtherion.deploy(1000000, 50);
    await etherion.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await etherion.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await etherion.balanceOf(owner.address);
      expect(await etherion.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the correct initial fee", async function () {
      expect(await etherion.transferFeePercentage()).to.equal(50);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens with fee", async function () {
      // Transfer 100 tokens from owner to addr1
      await etherion.transfer(addr1.address, 100);

      // Fee should be 0.5% = 0.5 tokens, so addr1 receives 99.5 tokens
      expect(await etherion.balanceOf(addr1.address)).to.equal(99);

      // Fee collector (owner) should receive the fee
      expect(await etherion.totalFeeCollected()).to.equal(1);
    });

    it("Should allow whitelist addresses to transfer without fees", async function () {
      // Add addr1 to whitelist
      await etherion.addToWhitelist(addr1.address);

      // Transfer 100 tokens from owner to addr1
      await etherion.transfer(addr1.address, 100);

      // Transfer 50 tokens from addr1 to addr2 (should be no fee)
      await etherion.connect(addr1).transfer(addr2.address, 50);

      // Check balances are correct
      expect(await etherion.balanceOf(addr1.address)).to.equal(50);
      expect(await etherion.balanceOf(addr2.address)).to.equal(50);
      expect(await etherion.totalFeeCollected()).to.equal(0);
    });
  });

  describe("Burning", function () {
    it("Should burn tokens correctly", async function () {
      const initialSupply = await etherion.totalSupply();

      // Burn 1000 tokens
      await etherion.burn(1000);

      // Check new supply
      expect(await etherion.totalSupply()).to.equal(initialSupply.sub(1000));
      expect(await etherion.totalBurned()).to.equal(1000);
    });
  });

  describe("Fee management", function () {
    it("Should allow owner to change the fee", async function () {
      // Change fee to 1%
      await etherion.setTransferFee(100);
      expect(await etherion.transferFeePercentage()).to.equal(100);

      // Transfer with new fee
      await etherion.transfer(addr1.address, 100);

      // Fee should be 1% = 1 token
      expect(await etherion.balanceOf(addr1.address)).to.equal(99);
      expect(await etherion.totalFeeCollected()).to.equal(1);
    });

    it("Should not allow setting fee higher than maximum", async function () {
      // Try to set fee to 10% (1000 basis points)
      await expect(etherion.setTransferFee(1000)).to.be.revertedWith(
        "Fee too high"
      );
    });
  });
});
