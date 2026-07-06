import { ethers } from "ethers";
import "dotenv/config";

const RPC_URL = process.env.RPC_URL || "https://testrpc.xlayer.tech";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;

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

export function getSigner(): ethers.Wallet | null {
  return signer;
}

export function getFactory(address: string): ethers.Contract {
  return new ethers.Contract(address, FACTORY_ABI, signer || provider);
}

export function getVault(address: string): ethers.Contract {
  return new ethers.Contract(address, VAULT_ABI, signer || provider);
}

export function getContract(address: string): ethers.Contract {
  return new ethers.Contract(address, CONTRACT_ABI, signer || provider);
}
