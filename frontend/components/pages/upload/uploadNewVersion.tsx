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

export default function UploadNewVersion({
    game,
    setUploadGame,
}: {
    game: Abandonware
    setUploadGame: (value: boolean) => void
}) {
    // Type FILE only suported in node >20, and Fleek deploys on Node 18
    const [file, setFile] = useState<any | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [uploadedSuccessfully, setUploadedSuccessfully] =
        useState<boolean>(false)

    const { data: hash, isPending, writeContract } = useWriteContract()

    const {
        data,
        isLoading: isUpdatingChallenge,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        confirmations: 2,
        pollingInterval: 100,
    })

    console.info("updated ipfsCID on the game", data)
    console.info("loading updating challenge", isUpdatingChallenge)

    const uploadToIPFS = async (filename: string) => {
        setIsSubmitting(true)
        const formData = new FormData()
        // Extract the file extension
        const fileExtension = filename.slice(
            ((filename.lastIndexOf('.') - 1) >>> 0) + 2
        )

        // Append the file extension to the game hash
        const newFileName = `${game.gameHash}.${fileExtension}`
        const newGame = new File([file], newFileName)

        formData.append('file', newGame)
        fetch('/api/upload-game', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 201) {
                    setIsSubmitting(false)
                    setUploadedSuccessfully(true)
                    setIsSubmitting(false)
                    setUploadedSuccessfully(true)
                    const ipfsCid = data.data.pin.cid
                    writeContract({
                        abi: vaultiumContract.abi,
                        address: contractAddress,
                        functionName: 'challengeAbandonwareVersion',
                        args: [
                            game.gameHash,
                            ipfsCid,
                            'image not uploaded'
                        ],
                        chainId: sepolia.id,
                    })
                }
            })
            .catch((error) => console.error(error))
    }

    return (
        <>
        {/* TODO: WE NEED ONE STEP MORE, WHEN SIGN THE CHALLENGE UPDATED, THEN SHOW THIS MESSAGE BELOW */}
            {uploadedSuccessfully ? (
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
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className='mb-0.5 flex items-center gap-2'
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
                        Please note: Only compressed (.zip, .rar, .7z) or .iso
                        files are supported.
                    </p>
                    <div className='flex items-center justify-between gap-2'>
                        <Button
                            onClick={() => uploadToIPFS(file.name, file)}
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
            )}
        </>
    )
}
