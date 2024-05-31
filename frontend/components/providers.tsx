'use client'

import { privyConfig } from '@/lib/privyConfig'
import { wagmiConfig } from '@/lib/wagmi/config'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider, createConfig } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_ID!}
            config={privyConfig}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    )
}
