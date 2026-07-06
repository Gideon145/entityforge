import { ethers } from "ethers";

const RPC_URL = process.env.RPC_URL || "https://rpc.xlayer.tech";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Deployed contract addresses on X Layer mainnet
const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS || "0x1007AB1B4dbcd200892a1D1b90C3a3A0e07E394f";
const VAULT_ADDRESS = process.env.VAULT_ADDRESS || "0x4712b620107DA0355406fAAF98deF39c8Ad41411";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xF6602eEF3F648bb5d436aEfe376fE91bAF2fF071";

const provider = new ethers.JsonRpcProvider(RPC_URL);

function getSigner(): ethers.Wallet | null {
  const pk = process.env.PRIVATE_KEY || PRIVATE_KEY;
  if (!pk) return null;
  return new ethers.Wallet(pk, provider);
}

// ABI fragments — expanded as contracts are deployed
const FACTORY_ABI = [
  "function formEntity(string,bytes32,address) external returns (uint256)",
  "function entityCount() external view returns (uint256)",
  "function entities(uint256) external view returns (tuple(uint256,string,address,bytes32,uint256,uint8))",
];

const VAULT_ABI = [
  "function initVault(uint256,address[],uint256[]) external",
  "function deposit(uint256) external payable",
  "function distribute(uint256) external",
];

const CONTRACT_ABI = [
  "function propose(uint256,uint256,bytes32,uint256,uint256) external returns (bytes32)",
  "function sign(bytes32,bytes) external",
  "function fulfill(bytes32,bytes32) external",
  "function verify(bytes32) external",
];

export function getProvider(): ethers.JsonRpcProvider {
  return provider;
}

export function getFactory(address?: string): ethers.Contract {
  return new ethers.Contract(address || FACTORY_ADDRESS, FACTORY_ABI, getSigner() || provider);
}

export function getVault(address?: string): ethers.Contract {
  return new ethers.Contract(address || VAULT_ADDRESS, VAULT_ABI, getSigner() || provider);
}

export function getContract(address?: string): ethers.Contract {
  return new ethers.Contract(address || CONTRACT_ADDRESS, CONTRACT_ABI, getSigner() || provider);
}
