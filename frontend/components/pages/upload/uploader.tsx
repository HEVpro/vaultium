'use client'

import { AnimatedCheck } from '@/components/animatedCheck'
import { Button } from '@/components/ui/button'
import { contractAddress } from '@/lib/constants'
import { Abandonware } from '@/lib/types'
import { cn } from '@/lib/utils'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { motion } from 'framer-motion'
import { FileBoxIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import lighthouse from '@lighthouse-web3/sdk'

export default function Uploader({
    game,
    setUploadGame,
    setUploadingGame,
    setUploadedSuccessfully,
    setSigningContract
}: {
    game: Abandonware
    setUploadGame: (value: boolean) => void
    setUploadingGame: (value: boolean) => void
    setUploadedSuccessfully: (value: boolean) => void
    setSigningContract: (value: boolean) => void
}) {
    const [file, setFile] = useState<any | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const { data: hash, isPending, writeContract } = useWriteContract()

    // TODO: IMPROVE THE WORKFLOW AFTER THE TRANSACTION IS CONFIRMED AFTER INSERT THE IPFSCID
    const {
        data,
        isLoading: isUpdatingChallenge,
        isSuccess: gameIsConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 2,
        pollingInterval: 100,
    })

    const uploadToLighhouse = async (fileName: string, file: any) => {
        setIsSubmitting(true)
        const formData = new FormData()
        // Extract the file extension
        const fileExtension = fileName.slice(
            ((fileName.lastIndexOf('.') - 1) >>> 0) + 2
        )

        // Append the file extension to the game hash
        const newFileName = `${game.gameHash}.${fileExtension}`
        const newGame = new File([file], newFileName)

        formData.append('file', newGame)

        fetch('https://node.lighthouse.storage/api/v0/add', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY}`,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.Hash) {
                    const ipfsCid = data.Hash
                    writeContract({
                        abi: vaultiumContract.abi,
                        address: contractAddress,
                        functionName: 'challengeAbandonwareVersion',
                        args: [game.gameHash, ipfsCid, 'image not uploaded'],
                        chainId: sepolia.id,
                    })
                                        setSigningContract(true)
                }
            })
            .catch((error) => console.error('Error:', error))

    }

    useEffect(() => {
        if(hash){
            setSigningContract(false)
            setUploadingGame(true)

        }
    }, [hash])

    useEffect(() => {
        if(gameIsConfirmed){
            setUploadingGame(false)
            setUploadedSuccessfully(true)
        }
    }, [gameIsConfirmed])


    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='mb-0.5 flex items-center gap-2 mb-4'
            >
                <div className={'relative h-12  w-60 cursor-pointer'}>
                    <input
                        accept='zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed'
                        type={'file'}
                        className={
                            'absolute left-0 top-0 z-10 h-12 w-full cursor-pointer opacity-0'
                        }
                        name={'file'}
                        onChange={(e) => {
                            if (e.target.files) {
                                setFile(e.target.files[0])
                            }
                        }}
                    />
                    <div className='absolute left-0 top-0 flex h-12 w-full cursor-pointer items-center justify-start gap-2 rounded-lg bg-primary pl-2 pt-2 text-sm font-light text-white'>
                        <FileBoxIcon className=' mb-2.5 h-7 w-7 stroke-foreground  stroke-1' />
                        <p className='mb-1 w-full'>Click to upload</p>
                    </div>
                </div>

                <div className=' flex h-12 w-full items-center justify-start gap-2 text-wrap rounded-lg border-2 pl-2 text-sm'>
                    {file && (
                        <AnimatedCheck classname='h-5 w-5 stroke-primary' />
                    )}
                    <p
                        className={cn(
                            'font-light tracking-wide text-white',
                            file && 'italic text-primary',
                            !file && 'pl-6'
                        )}
                    >
                        {file ? file.name : 'Select a file to upload'}
                    </p>
                </div>
            </motion.div>
            <p className='mb-3 text-xs italic text-primary/50'>
                Please note: Only compressed (.zip, .rar, .7z) or .iso files are
                supported.
            </p>
            <div className='flex items-center justify-between gap-2'>
                <Button
                    onClick={() => uploadToLighhouse(file.name, file)}
                    disabled={!file || isSubmitting}
                    className='w-full text-base text-foreground transition duration-300 hover:text-white active:scale-90'
                >
                    {isSubmitting ? 'Uploading...' : 'Upload'}
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={() => setUploadGame(false)}
                    className=' w-28 text-base text-foreground transition duration-300 hover:bg-primary/30 hover:text-white active:scale-90'
                >
                    Cancel
                </Button>
            </div>

        </>
    )
}
