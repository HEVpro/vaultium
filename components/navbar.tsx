'use client'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { toast } from './ui/use-toast'
import { LogOutIcon } from 'lucide-react'

const navbarLinks = [
    {
        name: 'Explore',
        href: '/',
    },
    {
        name: 'Upload',
        href: '/upload',
    },
]

const Navbar = () => {
    const pathname = usePathname()
    const { push } = useRouter()
    const { ready, authenticated, login, logout, user } = usePrivy()
    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated)

    return (
        <nav className='fixed top-4 flex min-h-14 w-full max-w-5xl items-center justify-between rounded-full bg-blue-950 bg-opacity-20 px-6 backdrop-blur-sm'>
            <div className='flex items-center justify-start gap-2'>
                <Image
                    width={36}
                    height={36}
                    src='/vaultium-logo.png'
                    alt='Vaultium logo'
                />
                <h1 className='text-3xl text-primary'>Vaultium</h1>
            </div>
            <div className='flex items-center justify-center'>
                {navbarLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <Button
                            className={cn('font-nunito text-lg tracking-wider')}
                            variant={'link'}
                        >
                            {link.name}
                        </Button>
                    </Link>
                ))}
            </div>
            <Button
                disabled={disableLogin}
                onClick={login}
                className='bg-gradient rounded-full px-4 py-1.5 text-foreground transition duration-500 hover:scale-105 active:scale-90'
            >
                Login
            </Button>
            <Button 
                onClick={async () => {
                    try {
                        await logout()
                        toast({
                            title: 'Logged out',
                            description: '👋 We hope see you soon!',
                            duration: 1500,
                            className: 'bg-gradient text-foreground text-xl',
                        })
                    } catch (e) {
                        console.info(e)
                    }
                }}
                className='bg-transparent rounded-full px-2 py-1.5 text-foreground transition duration-500 hover:scale-105 active:scale-90'
            >
                <LogOutIcon className='w-6 h-6 stroke-white' />
            </Button>
        </nav>
    )
}
export default Navbar
