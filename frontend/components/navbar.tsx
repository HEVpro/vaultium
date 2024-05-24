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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

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
        <nav className='z-50 fixed top-4 flex min-h-14 w-full max-w-5xl items-center justify-between rounded-full bg-blue-950 bg-opacity-20 px-6 backdrop-blur-sm'>
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
            <div className={'flex items-center gap-4'}>
                {!authenticated ? (
                    <Button
                        onClick={login}
                        className='bg-gradient truncate  rounded-full px-4 py-1.5 text-foreground transition duration-500 hover:scale-105 active:scale-90 disabled:opacity-100'
                    >
                        Login
                    </Button>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className='bg-gradient cursor-default  rounded-full px-4 py-1.5 text-foreground transition duration-500'>
                                {user?.wallet?.address.slice(0, 10)}...
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{user?.wallet?.address}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                {authenticated && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    onClick={async () => {
                                        try {
                                            await logout()
                                            toast({
                                                title: 'Logged out',
                                                description:
                                                    '👋 We hope see you soon!',
                                                duration: 1500,
                                                className:
                                                    'bg-gradient text-foreground text-xl',
                                            })
                                        } catch (e) {
                                            console.info(e)
                                        }
                                    }}
                                    className='rounded-full bg-transparent px-2 py-1.5 text-foreground transition duration-500 hover:bg-transparent active:scale-90'
                                >
                                    <LogOutIcon className='h-6 w-6 stroke-white hover:scale-105 hover:stroke-primary ' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Logout</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </nav>
    )
}
export default Navbar
