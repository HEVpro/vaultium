"use client"
import { contractAddress } from '@/lib/constants'
import { transformGenres } from '@/lib/utils'
import { wagmiConfig } from '@/lib/wagmi/config'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { readContract } from '@wagmi/core'
import { useState } from "react"
import { useReadContract } from 'wagmi'

export default function GameInfo({gameHash}: {gameHash: string}){
    const { data: abandonware, isPending } = useReadContract({
        abi: vaultiumContract.abi,
        address: contractAddress,
        functionName: 'getAbandonware',
        args: [gameHash],
    })

    console.log('data', abandonware)
    
    return (
        <div className='w-1/2 space-y-6 px-10'>
        <h1 className='text-3xl'>{abandonware?.name}</h1>
        <div className='space-y-2'>
            <div className='grid grid-cols-2'>
                <div className=''>
                    <p className='font-nunito font-bold'>year</p>
                    <p>{abandonware?.year}</p>
                </div>
            </div>
            <div className='grid grid-cols-2'>
                <div className=''>
                    <p className='font-nunito font-bold'>genre</p>
                    <p>{transformGenres(abandonware?.genres)}</p>
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
                {/* <p>{abandonware?.releasedIn}</p> */}
            </div>
        </div>
        <div>
            <p className='font-nunito font-bold'>description:</p>
            <p className=''>
                {abandonware?.description}
            </p>
        </div>
        <div className='flex flex-col space-y-2'>
            <p className='font-nunito font-bold'>download</p>
            <a
                href={
                    'https://gateway.lighthouse.storage/ipfs/' +
                    abandonware?.ipfsCid
                }
                target='_blank'
                className='bg-gradient rounded-lg p-2 text-black'
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
    )
}