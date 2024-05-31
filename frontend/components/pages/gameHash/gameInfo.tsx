'use client'
import { Badge } from '@/components/ui/badge'
import { contractAddress } from '@/lib/constants'
import { transformGenres } from '@/lib/utils'
import { wagmiConfig } from '@/lib/wagmi/config'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { readContract } from '@wagmi/core'
import { useState } from 'react'
import { useReadContract } from 'wagmi'

interface Abandonware {
    name: string
    year: number
    genres: number[]
    publisher: string
    description: string
    ipfsCid: string
    // Add other properties as needed
}

export default function GameInfo({ gameHash }: { gameHash: string }) {
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
            {abandonware && (
                <div className='w-1/2 space-y-6 px-10'>
                    <h1 className='text-3xl font-semibold text-primary'>
                        {abandonware?.name}
                    </h1>
                    <div className='grid grid-cols-3 gap-4 '>
                        <div className=''>
                            <p className='font-nunito text-primary'>Year</p>
                            <p>{abandonware?.year}</p>
                        </div>

                        <div className=''>
                            <p className='font-nunito text-primary'>
                                Publisher
                            </p>
                            <p>{abandonware?.publisher}</p>
                        </div>
                        <div className='col-span-full'>
                            <p className='font-nunito text-primary'>Genres</p>
                            {parsedGenres.map(
                                (item) => (
                                    <Badge
                                        key={item}
                                        className='bg-gradient mr-2 text-foreground'
                                    >
                                        {item}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>
                    <div>
                        <p className='font-nunito font-bold'>Description:</p>
                        <p className=''>{abandonware?.description}</p>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <p className='font-nunito font-bold'>Download</p>
                        <a
                            href={
                                'https://gateway.lighthouse.storage/ipfs/' +
                                abandonware?.ipfsCid
                            }
                            target='_blank'
                            className='rounded-lg bg-primary p-2 text-center text-black'
                        >
                            Download
                        </a>
                        <i>Is this version of the file wrong?</i>
                        <a
                            href={'/' + gameHash + '/challenge'}
                            className='text-blue-500'
                        >
                            Challenge it now!
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}
