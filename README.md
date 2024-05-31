# Vaultium

This is Vaultium, a project developed during the [HackFS 2024](https://ethglobal.com/events/hackfs2024).

Vaultium intends to be a way so store abandonware games to preserve them for the future using [Filecoin](https://filecoin.io/) and [IPFS](https://ipfs.tech/) technologies (via [Lighthouse](https://www.lighthouse.storage/)) 

The website itself is deployed in Fleek, and accessible via .eth.limo here! (link pending ATM...)

## Technologies & tools

We used the following technologies & tools:

  - [Next.js](https://nextjs.org/) 14
  - [Fleek](https://fleek.xyz/)
  - [Filecoin](https://filecoin.io/)
  - [IPFS](https://ipfs.tech/)
  - [The Graph](https://thegraph.com/)
  - [Hardhat](https://hardhat.org/)
  - [Privy](https://www.privy.io/)

## Project structure

There are 3 folders within the Vaultium project:

  - frontend: a [Next.js](https://nextjs.org/ 14 + [Tailwind](https://tailwindcss.com/) project, deployable on [Fleek](https://fleek.xyz/)
  - contracts: a [Hardhat](https://hardhat.org/) project, including the [MockVaultium](https://sepolia.etherscan.io/address/0xe8b07e948168108c8f0be3bfd448d4a9a9b56596) contract (used during the development process to enable working on the same time on the frontend and the contracts) and the [Vaultium](https://sepolia.etherscan.io/address/0xB62A6639D89C91b8B04B58c1ecdb4aC6E4399746) contract, the one deployed in "production" (currently only testnet)
  - graph: a [The Graph](https://thegraph.com/) project to index contract events to make it easier to handle them on the frontend
