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
import { useState } from 'react'
import { motion } from 'framer-motion'

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
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
        opacity: 0,
    });

    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated)


    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!e?.currentTarget) return;
        const { width } = e.currentTarget.getBoundingClientRect();
        setPosition({
            left: e.currentTarget.offsetLeft,
            width,
            opacity: 1,
        });
    }

    return (
        <nav className='fixed top-4 z-50 flex flex-row-reverse min-h-14 w-full max-w-5xl items-center justify-between rounded-full bg-blue-950 bg-opacity-20 px-6 backdrop-blur-sm transition-all duration-500'>
            <div className='relative flex flex-row-reverse w-full h-full items-center justify-between'>
                {authenticated && (
                    <div className='w-1/3 text-end'>
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
                    </div>
                )}

                {!authenticated && (
                    <div className={'w-1/3 text-end'}>
                        <Button
                            onClick={login}
                            className=' bg-gradient truncate rounded-full px-4 py-1.5 text-foreground transition duration-500 hover:scale-105 active:scale-90 disabled:opacity-100'
                        >
                            Login
                        </Button>
                    </div>
                )}

                {authenticated && (
                    <div className={'peer'}>

                        <p className='absolute right-14 top-1/2 -translate-y-1/2 z-50 bg-gradient cursor-default rounded-full px-3 py-1.5 text-foreground transition-all duration-500 text-sm max-w-full w-52 hover:w-[380px] truncate'>
                            {user?.wallet?.address}
                        </p>
                    </div>

                )}

                <div
                    onMouseLeave={() => {
                        setPosition((pv) => ({
                            ...pv,
                            opacity: 0,
                        }));
                    }}
                    className='w-1/3 flex items-center justify-center transition-opacity duration-300 peer-has-[:hover]:opacity-0'>
                    {navbarLinks.map((link) => (
                        <Link
                            onMouseEnter={(e) => handleMouseEnter(e)}
                            key={link.href}
                            href={link.href}
                            className='hover:text-white'>
                            <Button
                                className={cn('z-10 relative flex flex-col font-nunito text-lg tracking-wider font-semibold  transition-all duration-300  hover:text-white hover:no-underline',
                                    (link.href !== "/" ? link.href === pathname.slice(0, -1) : link.href === pathname) ? "bg-gradient bg-clip-text text-transparent" : "text-white")}
                                variant={'link'}
                            >
                                {link.name}
                            </Button>
                        </Link>
                    ))}
                    <motion.div
                        animate={{
                            ...position,
                        }}
                        className="absolute z-0 h-8 rounded-full bg-gradient animate-background"
                    />
                </div>
                <div className=' w-1/3 flex items-center justify-start gap-2 transition-all duration-500'>
                    <Image
                        width={36}
                        height={36}
                        src='/vaultium-logo.png'
                        alt='Vaultium logo'
                    />
                    <h1 className='text-3xl font-bold
                     bg-gradient inline-block bg-clip-text text-transparent animate-text'>Vaultium</h1>
                </div>
            </div>
        </nav>
    )
}
export default Navbar
