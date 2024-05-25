// @ts-ignore
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

require('dotenv').config()

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY!;
const etherscanApiKey = "MCDPH2KUQKINYE172UM2R6DTIUCA6ETHJM"


const config: HardhatUserConfig = {
  solidity: "0.8.25",
  etherscan: {
    apiKey: etherscanApiKey
  },
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: [deployerPrivateKey]
    }
  }
};

export default config;
