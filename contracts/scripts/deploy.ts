import { ethers } from "hardhat";

async function main() {
  const network = process.env.HARDHAT_NETWORK || "xLayer";
  console.log(`Deploying EntityForge protocol to X Layer (${network})...\n`);

  // 1. Deploy Factory
  const Factory = await ethers.getContractFactory("EntityForgeFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  console.log("EntityForgeFactory:", await factory.getAddress());

  // 2. Deploy Vault
  const Vault = await ethers.getContractFactory("EntityForgeVault");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  console.log("EntityForgeVault:", await vault.getAddress());

  // 3. Deploy Contract
  const Contract = await ethers.getContractFactory("EntityForgeContract");
  const agmt = await Contract.deploy();
  await agmt.waitForDeployment();
  console.log("EntityForgeContract:", await agmt.getAddress());

  console.log("\n✅ All contracts deployed");
  console.log("Add these addresses to agent/.env and frontend/.env.local");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
