import type { Metadata } from 'next'
import { Varela_Round } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import Providers from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const varela = Varela_Round({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-varela-round',
})

export const metadata: Metadata = {
    title: 'Vaultium',
    description: 'HackFS project based on IPFS',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en' className='scroll-smooth'>
            <body className={cn(varela.variable, 'font-varela bg-foreground')}>
                <Providers>
                    <main className='mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-between pt-24'>
                        <Navbar />
                        {children}
                    </main>
                    <Toaster />
                </Providers>
            </body>
        </html>
    )
}
