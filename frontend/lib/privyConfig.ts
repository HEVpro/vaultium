import type { PrivyClientConfig } from '@privy-io/react-auth'

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
    embeddedWallets: {
        createOnLogin: 'users-without-wallets',
        requireUserPasswordOnCreate: true,
        noPromptOnSignature: false,
    },
    loginMethods: ['wallet', 'email', 'sms'],
    appearance: {
        showWalletLoginFirst: true,
        theme: 'dark',
        accentColor: '#F384E4',
        logo: 'https://unktrccybuqsazntkwmm.supabase.co/storage/v1/object/public/images/vaultium-logo.png',
    },
}
