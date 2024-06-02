import { AnimatedCheck } from '@/components/animatedCheck'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { contractAddress } from '@/lib/constants'
import { Abandonware, Game } from '@/lib/types'
import { cn } from '@/lib/utils'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { motion } from 'framer-motion'
import { FileBoxIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import Uploader from './uploader'

export default function UploadNewVersion({
    game,
    setUploadGame,
}: {
    game: Abandonware
    setUploadGame: (value: boolean) => void
}) {
    const [signingContract, setSigningContract] = useState<boolean>(false)
    const [uploadingGame, setUploadingGame] = useState<boolean>(false)
    const [uploadedSuccessfully, setUploadedSuccessfully] =
        useState<boolean>(false)

    return (
        <>
            {uploadedSuccessfully ? (
                <div className='flex w-full flex-col items-center justify-between gap-2 rounded-md text-white'>
                    <p className='text-2xl text-primary'>
                        Upload successful!! 🥳
                    </p>
                    <p className='max-w-[40ch] text-center text-base font-thin text-white'>
                        Thank you for your contribution! Your efforts help keep
                        abandonware alive and accessible to all.
                    </p>
                    <Link
                        scroll={true}
                        href={`/game?gameHash=${game.gameHash}`}
                        className='transition duration-500 hover:scale-105 hover:text-primary'
                    >
                        <p>View game</p>
                    </Link>
                </div>
            ) : (
                <Uploader
                    game={game}
                    setUploadingGame={setUploadingGame}
                    setUploadGame={setUploadGame}
                    setUploadedSuccessfully={setUploadedSuccessfully}
                    setSigningContract={setSigningContract}
                />
            )}

            {signingContract && !uploadedSuccessfully && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className='mt-2 max-w-[55ch] text-center text-base font-thin text-white'
                >
                    Waiting for Signature...
                </motion.p>
            )}
            {uploadingGame && !uploadedSuccessfully && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className='mt-2 max-w-[55ch] text-center text-base font-thin text-white'
                >
                    Your transaction is being processed on the blockchain. This
                    might take a few moments. 🌐🔄
                </motion.p>
            )}
        </>
    )
}
