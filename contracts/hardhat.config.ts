import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY || "61b0c2e6fcdd9e30837884909b5639272529a8fa47ba24934e6b7eca4ddf3862";
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
