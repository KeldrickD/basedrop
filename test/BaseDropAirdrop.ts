import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("BaseDropAirdrop", function () {
  let baseDropAirdrop: Contract;
  let mockERC20: Contract;
  let mockERC721: Contract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let addrs: Signer[];

  beforeEach(async function () {
    // Deploy the airdrop contract
    const BaseDropAirdrop = await ethers.getContractFactory("BaseDropAirdrop");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    baseDropAirdrop = await BaseDropAirdrop.deploy();
    await baseDropAirdrop.deployed();

    // Deploy a mock ERC20 token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("MockToken", "MTK");
    await mockERC20.deployed();

    // Deploy a mock ERC721 token
    const MockERC721 = await ethers.getContractFactory("MockERC721");
    mockERC721 = await MockERC721.deploy("MockNFT", "MNFT");
    await mockERC721.deployed();

    // Mint some tokens to owner
    await mockERC20.mint(await owner.getAddress(), ethers.utils.parseEther("1000"));
    
    // Mint some NFTs to owner
    await mockERC721.mint(await owner.getAddress(), 1);
    await mockERC721.mint(await owner.getAddress(), 2);
  });

  describe("ERC20 Airdrop", function () {
    it("Should airdrop ERC20 tokens to multiple recipients", async function () {
      const recipients = [
        await addr1.getAddress(),
        await addr2.getAddress()
      ];
      const amount = ethers.utils.parseEther("10");
      const messageURI = "ipfs://QmXjKU4Cy9pHxFGcH7RFcLzxXr6bDJiKrxPLiPiaSL6TZf";

      // Approve the airdrop contract to spend tokens
      await mockERC20.approve(baseDropAirdrop.address, amount.mul(recipients.length));

      // Execute the airdrop
      const tx = await baseDropAirdrop.airdropERC20(
        mockERC20.address,
        recipients,
        amount,
        messageURI
      );

      // Check balances
      expect(await mockERC20.balanceOf(recipients[0])).to.equal(amount);
      expect(await mockERC20.balanceOf(recipients[1])).to.equal(amount);

      // Check events
      await expect(tx)
        .to.emit(baseDropAirdrop, "ERC20Airdrop")
        .withArgs(await owner.getAddress(), mockERC20.address, amount, recipients.length, messageURI);
    });
  });

  describe("ERC721 Airdrop", function () {
    it("Should airdrop ERC721 tokens to multiple recipients", async function () {
      const recipients = [
        await addr1.getAddress(),
        await addr2.getAddress()
      ];
      const tokenIds = [1, 2];
      const messageURI = "ipfs://QmXjKU4Cy9pHxFGcH7RFcLzxXr6bDJiKrxPLiPiaSL6TZf";

      // Approve the airdrop contract to transfer NFTs
      await mockERC721.setApprovalForAll(baseDropAirdrop.address, true);

      // Execute the airdrop
      const tx = await baseDropAirdrop.airdropERC721(
        mockERC721.address,
        recipients,
        tokenIds,
        messageURI
      );

      // Check ownership
      expect(await mockERC721.ownerOf(tokenIds[0])).to.equal(recipients[0]);
      expect(await mockERC721.ownerOf(tokenIds[1])).to.equal(recipients[1]);

      // Check events
      await expect(tx)
        .to.emit(baseDropAirdrop, "ERC721Airdrop")
        .withArgs(await owner.getAddress(), mockERC721.address, recipients.length, messageURI);
    });
  });
}); 