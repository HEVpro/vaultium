'use client'
import { Badge } from '@/components/ui/badge'
import { contractAddress } from '@/lib/constants'
import { Abandonware } from '@/lib/types'
import { transformGenres } from '@/lib/utils'
import { wagmiConfig } from '@/lib/wagmi/config'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { readContract } from '@wagmi/core'
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
    
    const { data: gameHistory } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'getGameVersionHistory',
        args: [gameHash],
    })

    const abandonware = game as Abandonware

    const parsedGenres = transformGenres(abandonware?.genres ?? [])

    const isGameChallenged = true // TODO: check if the current version is being challenged using hasActiveChallengeForGame

    // TODO: print gameversion history --> getGameVersionHistory
    // TODO: enable users to challenge a version

    // challengeAbandonwareVersion --> call contract to challenge a version of the abandonware, imageCid pass an empty string (or anything, it is not being used)
    // voting: _voteNewVersion true -> new version, false -> current version // token count put 1

    console.info(abandonware)
    console.info(gameHistory)

    return (
        <>
            <div className='min-h-screen w-full space-y-10 px-8 py-12 text-white'>
                <div className='flex w-full '>
                    <div className='w-1/2 space-y-6 px-10'>
                        <h1 className='text-3xl'>{abandonware?.name}</h1>
                        {/* <div className='space-y-2'>
                        <div className='grid grid-cols-2'>
                            <div className=''>
                                <p className='font-nunito font-bold'>
                                    platform
                                </p>
                                <p>{abandonware?.platform}</p>
                            </div>
                            <div className=''>
                                <p className='font-nunito font-bold'>year</p>
                                <p>{abandonware?.year}</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-2'>
                            <div className=''>
                                <p className='font-nunito font-bold'>genre</p>
                                <p>{abandonware?.genre}</p>
                            </div>
                            <div className=''>
                                <p className='font-nunito font-bold'>
                                    publisher
                                </p>
                                <p>{abandonware?.publisher}</p>
                            </div>
                        </div>
                        <div className=''>
                            <p className='font-nunito font-bold'>released in</p>
                            <p>{abandonware?.releasedIn}</p>
                        </div>
                    </div> */}
                        <div className=''>
                            <p className='font-nunito font-bold'>
                                version history
                            </p>
                            <table className='table-auto'>
                                <thead>
                                    <th>IPFS CID</th>
                                    <th>Link</th>
                                    <th>Uploaded at</th>
                                </thead>
                                <tbody>
                                    <tr>
                                        {' '}
                                        {/** TODO: Convert to a mapping of the objects retrieved by thegraph or contract read */}
                                        <td>
                                            QmXTAXgvisCDzh1cqeJN54kdYkohKMV9VaSzsN3fGQ3Y4Q
                                        </td>
                                        <td>
                                            <a href='https://gateway.pinata.cloud/ipfs/QmXTAXgvisCDzh1cqeJN54kdYkohKMV9VaSzsN3fGQ3Y4Q'>
                                                Link
                                            </a>
                                        </td>
                                        <td>2021-09-30</td>
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
