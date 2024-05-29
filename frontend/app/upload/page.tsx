'use client'
import { AnimatedCheck } from '@/components/animatedCheck'
import GameCardResult from '@/components/pages/upload/uploadGameCard'
import UploadNewVersion from '@/components/pages/upload/uploadNewVersion'
import ValidateForm from '@/components/pages/upload/validateForm'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import useCustomForm, { FormSchema } from '@/components/uploadForm'
import { countries } from '@/lib/countries'
import { fleekSdk } from '@/lib/fleek'
import { Game } from '@/lib/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
    CircleCheck,
    CloudUploadIcon,
    FileBoxIcon,
    LinkIcon,
    PickaxeIcon,
    Upload,
    XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'

export default function Page() {
    const [gameResult, setGamerResult] = useState<Game | null>(null)
    const [selectedGame, setSelectedGame] = useState<Game | null>(null)
    const [file, setFile] = useState<any | null>(null)
    const { form } = useCustomForm()

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.info(data)
        // TODO:  INTEGRATE WITH THE BLOCKCHAIN
        // toast({
        //   title: "You submitted the following values:",
        //   description: (
        //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //     </pre>
        //   ),
        // })
    }

    const uploadToIPFS = async (filename: string, content: Buffer) => {
        const formData = new FormData()
        formData.append('file', file)

        fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => console.info("uploaded successfully", data))
            .catch((error) => console.error(error))
    }

    return (
        <div className='flex flex-col items-center justify-start px-6 pb-24'>
            <div className='flex w-full items-start justify-between gap-8 py-12 text-white'>
                <div className='w-full '>
                    <h1 className='max-w-[15ch] text-4xl text-primary'>
                        HODL Your Retro Games Forever!
                    </h1>
                    <p className='text-md mt-4 font-light leading-7 tracking-wide text-white'>
                        Preserve your favorite retro games for eternity by
                        uploading them to the Vaultium blockchain. Simply select
                        your game file below, provide some details, and become a
                        part of gaming history. With our secure, decentralized
                        storage, your classics will be safe, accessible, and
                        appreciated by gamers everywhere!
                    </p>
                </div>
                {/* VALIDATE */}
                <div className='flex w-full flex-col gap-2'>
                    <ValidateForm setSearchedGames={setGamerResult} />
                </div>
            </div>
            <Input
                type='file'
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            <Button onClick={() => uploadToIPFS(file.name, file)}>
                <CloudUploadIcon size={24} />
                Upload
            </Button>
            
            <div className='w-full'>
                {/* THE LIST OF GAME RESULTS */}
                {!selectedGame && gameResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className={cn('mt-6 w-full')}
                    >
                        <h2 className='text-2xl font-semibold text-primary'>
                            Maybe your a looking this game?
                        </h2>
                        <div className='mt-4 grid w-full grid-cols-3 gap-4'>
                            <GameCardResult
                                key={gameResult.gameHash}
                                game={gameResult}
                                setSelectedGame={setSelectedGame}
                            />
                        </div>
                    </motion.div>
                )}
                {/* YOU HAVE SELECTED A GAME AND YOU WANT TO UPLOAD A NEW VERSION, WITHOUT CHALLENGE */}
                {selectedGame && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className='mt-6 w-full'
                    >
                        <h2 className='text-2xl font-semibold text-primary'>
                            Do you have a new version? This is the moment!
                        </h2>
                        <div className='relative mt-4 flex w-full items-end  justify-between gap-4'>
                            <GameCardResult
                                game={selectedGame}
                                setSelectedGame={setSelectedGame}
                            />
                            <div className='w-full max-w-lg space-y-2'>
                                <UploadNewVersion
                                    setSelectedGame={setSelectedGame}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
                {/* NOT EXISTING GAME */}
                {!gameResult && (
                    <div className='w-full py-12 text-center'>
                        <h2 className='mx-auto w-[50ch] text-xl text-primary'>
                            {
                                "Oops! Those titles are missing from our library, like they've vanished into the digital void. Try looking for them on Steam while we keep searching for new games for you. "
                            }
                        </h2>
                    </div>
                )}
            </div>
        </div>
    )
}
