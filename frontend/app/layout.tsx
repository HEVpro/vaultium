import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Navbar from '@/components/navbar'
import Providers from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const nunito = Nunito({
    weight: ['200', '400', '700', '900'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
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
            <body className={cn(nunito.variable, 'bg-foreground font-nunito')}>
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
