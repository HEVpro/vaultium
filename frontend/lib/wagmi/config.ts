import { createConfig } from '@privy-io/wagmi'
import { mainnet, sepolia } from 'viem/chains'
import { http } from 'wagmi'

export const wagmiConfig = createConfig({
    chains: [mainnet, sepolia],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/ct3OyhYZArhQMZ7eSVvoEgUP_VaGPJ-O'),
    },
})