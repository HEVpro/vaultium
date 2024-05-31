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

export default function GameInfo() {
    const searchParams = useSearchParams()
    const gameHash = searchParams.get('gameHash')

    if(!gameHash || !gameHash?.startsWith('0x')) {
        redirect('/')
    }

    const { data, isPending } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'getAbandonware',
        args: [gameHash],
    })

    const abandonware = data as Abandonware

    const parsedGenres = transformGenres(abandonware?.genres ?? [])

    return (
        <>
            {/* TODO: ADD SKELETON */}
            {abandonware && (
                <div className=''>
                    <h1 className='text-4xl font-semibold text-primary'>
                        {abandonware?.name}
                    </h1>
                    <div className='mt-4 flex items-start justify-between gap-8'>
                        <div className='w-1/2 space-y-6'>
                            <div className='grid grid-cols-3 gap-4'>
                                <div className=''>
                                    <p className='font-nunito text-primary'>
                                        Year
                                    </p>
                                    <p>{abandonware?.year}</p>
                                </div>

                                <div className=''>
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
                                {abandonware.ipfsCid ? (
                                    <>
                                        {/* TODO: DOWNLOAD */}
                                        <a
                                            href={
                                                'https://gateway.lighthouse.storage/ipfs/' +
                                                abandonware?.ipfsCid
                                            }
                                            target='_blank'
                                            className='max-w-sm rounded-lg bg-primary p-2 text-center text-foreground'
                                        >
                                            Download
                                        </a>
                                        <div className='flex items-center gap-2'>
                                            <p className='text-primary'>
                                                Is this version of the file
                                                wrong?
                                            </p>
                                            <Link
                                                href={
                                                    '/' +
                                                    gameHash +
                                                    '/challenge'
                                                }
                                                className='hover:cursor-pointer hover:text-special-magenta-200'
                                            >
                                                Challenge it now!
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    // TODO: WHEN CREATE THE UPLOAD MODAL ADD HERE THE COMPONENT
                                    <Link
                                        href={
                                            'https://gateway.lighthouse.storage/ipfs/' +
                                            abandonware?.ipfsCid
                                        }
                                        target='_blank'
                                        className='max-w-sm rounded-lg bg-primary p-2 text-center text-foreground hover:bg-special-magenta-300 transition duration-500'
                                    >
                                        Upload
                                    </Link>
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
                </div>
            )}
        </>
    )
}
