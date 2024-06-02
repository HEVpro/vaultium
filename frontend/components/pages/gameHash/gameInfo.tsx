'use client'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { contractAddress } from '@/lib/constants'
import { Abandonware } from '@/lib/types'
import { transformGenres } from '@/lib/utils'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useReadContract } from 'wagmi'
import Uploader from '../upload/uploader'
import { AnimatePresence, motion } from 'framer-motion'
import GameSkeleton from '@/components/skeletons/gameSkeleton'

export default function GameInfo() {
    const searchParams = useSearchParams()
    const gameHash = searchParams.get('gameHash')
    const [uploadedSuccessfully, setUploadedSuccessfully] =
        useState<boolean>(false)

    const [uploadGame, setUploadGame] = useState<boolean>(false)

    if (!gameHash || !gameHash?.startsWith('0x')) {
        redirect('/')
    }

    const { data, isPending } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'getAbandonware',
        args: [gameHash],
    })

    const { data: hasActiveChallengeForGame } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'hasActiveChallengeForGame',
        args: [gameHash],
    })

    const abandonware = data as Abandonware
    const isGameChallenged = hasActiveChallengeForGame as boolean

    const parsedGenres = transformGenres(abandonware?.genres ?? [])

    return (
        <>
            {isPending ? (
                <GameSkeleton />
            ) : (
                <AnimatePresence>
                    {abandonware && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <h1 className='text-4xl font-semibold text-primary'>
                                {abandonware?.name}
                            </h1>
                            <div className='mt-4 flex items-start justify-between gap-8'>
                                <div className='w-1/2 space-y-6'>
                                    <div className='grid grid-cols-3 gap-4'>
                                        <div>
                                            <p className='font-nunito text-primary'>
                                                Year
                                            </p>
                                            <p>{abandonware?.year}</p>
                                        </div>

                                        <div>
                                            <p className='font-nunito text-primary'>
                                                Publisher
                                            </p>
                                            <p>{abandonware?.publisher}</p>
                                        </div>
                                        <div className='col-span-full'>
                                            <p className='font-nunito text-primary'>
                                                Genres
                                            </p>
                                            {parsedGenres.map((item) => (
                                                <Badge
                                                    key={item}
                                                    className='bg-gradient mr-2 text-foreground'
                                                >
                                                    {item}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        {abandonware.ipfsCid.length > 2 ? (
                                            <>
                                                <a
                                                    href={
                                                        'https://gateway.lighthouse.storage/ipfs/' +
                                                        abandonware?.ipfsCid
                                                    }
                                                    download={abandonware?.name}
                                                    target='_blank'
                                                    className='max-w-sm rounded-lg bg-primary p-2 text-center text-foreground'
                                                >
                                                    Download
                                                </a>
                                                {!isGameChallenged && (
                                                    <div className='flex items-center gap-2'>
                                                        <p className='text-primary'>
                                                            Is this version of
                                                            the file wrong?
                                                        </p>
                                                        <Link
                                                            href={
                                                                '/challenge?gameHash=' +
                                                                gameHash
                                                            }
                                                            className='hover:cursor-pointer hover:text-special-magenta-200'
                                                        >
                                                            Challenge it now!
                                                        </Link>
                                                    </div>
                                                )}
                                                {/** TODO: make it beautiful */}
                                                {isGameChallenged && (
                                                    <div className='flex items-center gap-2'>
                                                        <p className='text-primary'>
                                                            The current version
                                                            of the game is being
                                                            challenged, please,
                                                            check game history
                                                            and contribute to
                                                            Vaultium by voting
                                                            the best version of
                                                            the game!
                                                        </p>
                                                        <Link
                                                            href={
                                                                '/challenge?gameHash=' +
                                                                gameHash
                                                            }
                                                            className='hover:cursor-pointer hover:text-special-magenta-200'
                                                        >
                                                            Vote now!
                                                        </Link>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    setUploadGame(true)
                                                }
                                                // href={
                                                //     'https://gateway.lighthouse.storage/ipfs/' +
                                                //     abandonware?.ipfsCid
                                                // }
                                                className='max-w-sm rounded-lg bg-primary p-2 text-center text-foreground transition duration-500 hover:bg-special-magenta-300'
                                            >
                                                Upload
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className='w-1/2'>
                                    <p className='mb-2 font-nunito text-primary'>
                                        Description:
                                    </p>
                                    <p className='font-light'>
                                        {abandonware?.description}
                                    </p>
                                </div>
                            </div>
                            {uploadGame && (
                                <div className='mt-12 w-full max-w-lg'>
                                    <Uploader
                                        game={abandonware}
                                        setUploadGame={setUploadGame}
                                        setUploadedSuccessfully={
                                            setUploadedSuccessfully
                                        }
                                    />
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </>
    )
}
