import { ethers } from "hardhat";

async function main() {
  console.log("Deploying BaseDropAirdrop contract...");

  const BaseDropAirdrop = await ethers.getContractFactory("BaseDropAirdrop");
  const baseDropAirdrop = await BaseDropAirdrop.deploy();

  await baseDropAirdrop.deployed();

  console.log(`BaseDropAirdrop deployed to ${baseDropAirdrop.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 