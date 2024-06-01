// @ts-ignore
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

require('dotenv').config()

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY!;
const etherscanApiKey = "MCDPH2KUQKINYE172UM2R6DTIUCA6ETHJM"


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: etherscanApiKey
  },
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: [deployerPrivateKey]
    },
    filecoinCalibration: {
      url: "https://rpc.ankr.com/filecoin_testnet",
      accounts: [deployerPrivateKey]
    },
  },
};

export default config;
