'use client'
import { Badge } from '@/components/ui/badge'
import { contractAddress } from '@/lib/constants'
import { Abandonware } from '@/lib/types'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { readContract } from '@wagmi/core'
import { DownloadIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useReadContract } from 'wagmi'

export default function GameChallenge() {
    const searchParams = useSearchParams()
    const gameHash = searchParams.get('gameHash')

    if (!gameHash || !gameHash?.startsWith('0x')) {
        redirect('/')
    }

    const { data: game } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'getAbandonware',
        args: [gameHash],
    })

    const { data: gameHistory, isPending } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'getGameVersionHistory',
        args: [gameHash],
    })

    const abandonware = game as Abandonware

    const isGameChallenged = true // TODO: check if the current version is being challenged using hasActiveChallengeForGame

    // TODO: print gameversion history --> getGameVersionHistory
    // TODO: enable users to challenge a version

    // challengeAbandonwareVersion --> call contract to challenge a version of the abandonware, imageCid pass an empty string (or anything, it is not being used)
    // voting: _voteNewVersion true -> new version, false -> current version // token count put 1

    console.info('game', abandonware)
    console.info('history', gameHistory)
    console.info('isPewnding', isPending)

    const tableHeaders = ['ifpsCID', 'download', 'Upload date']
    const fakeBody = [
        [
            '0xa8dd9f3badb02a73b27b31b48b5d6f1ff300baf486794f5e5799f869ff40e10c',
            'QmSCQCr8pwjSrmiNNw1HTtkTfjDTk2Les2qLDUax7gzEZ2',
            'image not uploaded',
        ],
    ]

    return (
        <>
            <div className='min-h-screen w-full space-y-10 px-8 py-12 text-white'>
                <div className='flex w-full '>
                    <div className='w-full space-y-6 px-10'>
                        <h1 className='text-3xl text-primary flex items-center justify-start gap-4'>
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
                                                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 capitalize'
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200 '>
                                    <tr className='round-t-md bg-slate-900 text-white'>
                                        <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6'>
                                            {fakeBody[0][1]}
                                        </td>
                                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                            <a
                                                href={`https://gateway.lighthouse.storage/ipfs/${fakeBody[0][1]}`}
                                                download={fakeBody[0][1]}
                                                target='_blank'
                                                className='max-w-sm text-primary hover:underline pl-6 flex items-center gap-1'
                                            >
                                                Link
                                                <DownloadIcon className='h-4 w-4 stroke-primary mb-1' />
                                            </a>
                                        </td>
                                        <td className='whitespace-nowrap px-3 py-4 pl-6 text-sm text-white'>
                                            {/* TODO: ADD TO CONTRACT */}
                                            20/05/2024
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {!isGameChallenged && (
                            <div className='flex flex-col space-y-2'>
                                <p className='font-nunito font-bold'>
                                    challenge
                                </p>
                                <span className='bg-gradient rounded-lg p-2 text-black'>
                                    Challenge game version{' '}
                                    {/** TODO: show modal or redirect to page to contract interaction */}
                                </span>
                                <i>
                                    If you believe that the current version of
                                    the game is incorrect (malware, does not
                                    work properly, etc.) you can proceed to
                                    challenge the current version by uploading a
                                    new one, and all Vaultium users will be able
                                    to vote which is the correct version,
                                    current or new.
                                </i>
                            </div>
                        )}
                        {/* {isGameChallenged && (
                        <div className='flex flex-col space-y-2'>
                            <p className='font-nunito font-bold'>
                                challenge status
                            </p>
                            <span className='bg-gradient rounded-lg p-2 text-black'>
                                Challenged
                            </span>
                            <i>
                                The current version of the game is being
                                challenged. You can vote for the current version
                                or the new one that is being proposed by the
                                challenger.
                            </i>
                            <div className='flex justify-around'>
                                <span className='bg-gradient rounded-lg p-2 text-black'>
                                    Vote for current version
                                </span>
                                <span className='bg-gradient rounded-lg p-2 text-black'>
                                    Vote for new version
                                </span>
                            </div>
                        </div>
                    )} */}
                    </div>
                </div>
            </div>
        </>
    )
}
