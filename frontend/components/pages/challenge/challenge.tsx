'use client'
import { Badge } from '@/components/ui/badge'
import { contractAddress } from '@/lib/constants'
import { Abandonware } from '@/lib/types'
import { transformGenres } from '@/lib/utils'
import { wagmiConfig } from '@/lib/wagmi/config'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { readContract } from '@wagmi/core'
import Link from 'next/link'
import { useState } from 'react'
import { useReadContract } from 'wagmi'

export default function GameChallenge({ gameHash }: { gameHash: string }) {
    const { data, isPending } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'getGameVersionHistory',
        args: [gameHash],
    })

    const challenge = data as Abandonware

    const parsedGenres = transformGenres(challenge?.genres ?? [])

    const isGameChallenged = true // TODO: check if the current version is being challenged using hasActiveChallengeForGame


    // TODO: print gameversion history --> getGameVersionHistory
    // TODO: enable users to challenge a version

    // challengeAbandonwareVersion --> call contract to challenge a version of the abandonware, imageCid pass an empty string (or anything, it is not being used)
    // voting: _voteNewVersion true -> new version, false -> current version // token count put 1



    return (
        <>
            {/* TODO: ADD SKELETON */}
            {challenge && (
                <div className=''>
                    <h1 className='text-4xl font-semibold text-primary'>
                        {challenge?.name}
                    </h1>
                    <div className='mt-4 flex items-start justify-between gap-8'>
                        <div className='w-1/2 space-y-6'>
                            <div className='grid grid-cols-3 gap-4'>
                                <div className=''>
                                    <p className='font-nunito text-primary'>
                                        Year
                                    </p>
                                    <p>{challenge?.year}</p>
                                </div>

                                <div className=''>
                                    <p className='font-nunito text-primary'>
                                        Publisher
                                    </p>
                                    <p>{challenge?.publisher}</p>
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
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
