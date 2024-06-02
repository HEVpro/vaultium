'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { contractAddress } from '@/lib/constants'
import { Abandonware, GameVersion } from '@/lib/types'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { DownloadIcon, HeartIcon, ShieldX } from 'lucide-react'
import { redirect, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useWriteContract, useReadContract } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import UploadNewVersion from '../upload/uploadNewVersion'

export default function GameChallenge() {
    const searchParams = useSearchParams()
    const gameHash = searchParams.get('gameHash')

    if (!gameHash || !gameHash?.startsWith('0x')) {
        redirect('/')
    }

    const [challenging, setChallenging] = useState<boolean>(false)

    let gameHistoryArray: GameVersion[] = []

    const { data: game } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'getAbandonware',
        args: [gameHash],
    })

    const { data: gameHistory } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'getGameVersionHistory',
        args: [gameHash],
    })

    const { data: hasActiveChallengeForGame } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'hasActiveChallengeForGame',
        args: [gameHash],
    })

    const { data: hashNewVersion, isPending: isPendingVoteNewVersion, writeContract: voteNewVersion } = useWriteContract()
    const { data: hashCurrentVersion, isPending: isPendingVoteCurrentVersion, writeContract: voteCurrentVersion } = useWriteContract()

    async function onVoteNewVersion() {
        voteNewVersion({
            abi: vaultiumContract.abi,
            address: contractAddress,
            functionName: 'voteChallenge',
            args: [
                gameHash,
                true,
                1
            ],
            chainId: sepolia.id,
        })
    }

    async function onVoteCurrentVersion() {
        voteCurrentVersion({
            abi: vaultiumContract.abi,
            address: contractAddress,
            functionName: 'voteChallenge',
            args: [
                gameHash,
                false,
                1
            ],
            chainId: sepolia.id,
        })
    }

    const abandonware = game as Abandonware
    const isGameChallenged = hasActiveChallengeForGame as boolean
    gameHistoryArray = gameHistory as GameVersion[]

    // TODO: enable users to challenge a version

    // challengeAbandonwareVersion --> call contract to challenge a version of the abandonware, imageCid pass an empty string (or anything, it is not being used)

    const tableHeaders = ['ifpsCID', 'download', 'Upload date']

    return (
        <>
            <div className='w-full space-y-10 px-8 py-12 text-white'>
                <div className='flex w-full '>
                    <div className='w-full space-y-6 px-10'>
                        <h1 className='flex items-center justify-start gap-4 text-3xl text-primary'>
                            Challenge game version of:
                            <p className='font-semibold text-white'>
                                {abandonware?.name}
                            </p>
                        </h1>
                        <div className='w-full'>
                            <p className='mb-2 font-nunito font-thin text-primary'>
                                Version history
                            </p>
                            <table className='ronded-md min-w-full divide-y divide-gray-300 overflow-hidden rounded-md'>
                                <thead className='bg-gray-50'>
                                    <tr className='bg-primary/40 text-foreground'>
                                        {tableHeaders.map((header) => (
                                            <th
                                                key={header}
                                                scope='col'
                                                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold capitalize text-gray-900 sm:pl-6'
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200 '>
                                    {gameHistoryArray &&
                                        gameHistoryArray.map((version) => (
                                            <tr
                                                key={version.ipfsCid}
                                                className='round-t-md bg-slate-900 text-white'
                                            >
                                                <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6'>
                                                    {version.ipfsCid}
                                                </td>
                                                <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                                    <a
                                                        href={`https://gateway.lighthouse.storage/ipfs/${version.ipfsCid}`}
                                                        download={
                                                            version.ipfsCid
                                                        }
                                                        target='_blank'
                                                        className='flex max-w-sm items-center gap-1 pl-6 text-primary hover:underline'
                                                    >
                                                        Link
                                                        <DownloadIcon className='mb-1 h-4 w-4 stroke-primary' />
                                                    </a>
                                                </td>
                                                <td className='whitespace-nowrap px-3 py-4 pl-6 text-sm text-white'>
                                                    {/* TODO: ADD TO CONTRACT */}
                                                    20/05/2024
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='flex flex-col space-y-6'>
                            <div className='flex items-end justify-between gap-2'>
                                <div className='flex flex-col items-start justify-between gap-2'>
                                    <p className=' font-nunito font-thin text-primary'>
                                        Status:
                                    </p>
                                    <Badge className='rounded-md text-base text-foreground truncate'>
                                        {isGameChallenged
                                            ? 'Challenged'
                                            : 'Not Challenged'}
                                    </Badge>
                                </div>
                                <i className='mt-0.5 max-w-2xl'>
                                    {isGameChallenged
                                        ? 'If you believe that the current version ofthe game is incorrect (malware, does not work properly, etc.) you can proceed to challenge the current version by uploading a new one, and all Vaultium users will be able to vote which is the correct version, current or new.'
                                        : 'The current version of the game is being challenged. You can vote for the current version or the new one that is being proposed by the challenger.'}
                                </i>
                            </div>
                            {isGameChallenged && (
                                <div className='mx-auto mt-8 flex w-fit items-center justify-center gap-8'>
                                    <Button onClick={onVoteCurrentVersion} className='hover:bg-gradient flex min-w-44 items-center justify-center gap-2 rounded-lg bg-primary p-2 text-foreground transition duration-500'>
                                        <HeartIcon className='h-6 w-6 stroke-white' />
                                        Current Version
                                    </Button>
                                    <Button onClick={onVoteNewVersion} className='hover:bg-gradient flex min-w-44 items-center justify-center gap-2 rounded-lg bg-primary p-2 text-foreground transition duration-500'>
                                        <HeartIcon className='h-6 w-6 stroke-white' />
                                        New version
                                    </Button>
                                </div>
                            )}
                            {!isGameChallenged && (
                                <div className='mx-auto mt-8 flex w-fit items-center justify-center gap-8'>
                                    <Button onClick={() => setChallenging(true)} className='hover:bg-gradient  hover:animate-background flex min-w-44 items-center justify-center gap-2 rounded-lg bg-primary p-2 text-foreground transition duration-500'>
                                        <ShieldX className='h-6 w-6 stroke-white' />
                                        Challenge current version
                                    </Button>
                                </div>
                            )}
                            {challenging && (<UploadNewVersion game={abandonware} setUploadGame={setChallenging} />)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
