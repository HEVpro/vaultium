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
    const [uploadedSuccessfully, setUploadedSuccessfully] =
        useState<boolean>(false)
    const [uploadingGame, setUploadingGame] = useState<boolean>(false)
    const [signingContract, setSigningContract] = useState<boolean>(false)


    console.log("uploadedSuccessfully", uploadedSuccessfully)
    console.log("uploadingGame", uploadingGame)
    console.log("signingContract", signingContract)

    return (
        <>
            {/* TODO: WE NEED ONE STEP MORE, WHEN SIGN THE CHALLENGE UPDATED, THEN SHOW THIS MESSAGE BELOW */}
            {signingContract && (
                <div className='flex w-full flex-col items-center justify-between gap-2 rounded-md text-white'>
                    <p className='text-2xl text-primary'>
                        Waiting for Signature...
                    </p>
                    <p className='max-w-[40ch] text-center text-base font-thin text-white'>
                        To associate the IPFS CID of the game you just uploaded, please, sign the transaction that you have been prompted with.
                    </p>
                </div>
            )}
            {uploadingGame && (
                <div className='flex w-full flex-col items-center justify-between gap-2 rounded-md text-white'>
                    <p className='text-2xl text-primary'>
                        Please Wait...
                    </p>
                    <p className='max-w-[55ch] text-center text-base font-thin text-white'>
                        Your transaction is being processed on the blockchain. This might take a few moments. 🌐🔄
                    </p>
                    <p className='max-w-[55ch] text-center text-base font-thin text-white'>
                        While you're waiting, know that you're helping to preserve the legacy of classic abandonware games by storing them securely on IPFS. Your contribution is ensuring these timeless treasures remain accessible for future generations. Thank you for your patience and support!                    </p>
                </div>
            )}
            {uploadedSuccessfully && (
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

            )}
            {!uploadedSuccessfully && !uploadingGame && !signingContract && (
                <Uploader
                    game={game}
                    setUploadingGame={setUploadingGame}
                    setUploadGame={setUploadGame}
                    setUploadedSuccessfully={setUploadedSuccessfully}
                    setSigningContract={setSigningContract} />
            )}
        </>
    )
}
