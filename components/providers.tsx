'use client'

import { PrivyProvider } from '@privy-io/react-auth'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_ID!}
            config={{
                // Customize Privy's appearance in your app|
                appearance: {
                    theme: 'dark',
                    accentColor: '#F384E4',
                    logo: 'https://unktrccybuqsazntkwmm.supabase.co/storage/v1/object/public/images/vaultium-logo.png',
                },
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </PrivyProvider>
    )
}
