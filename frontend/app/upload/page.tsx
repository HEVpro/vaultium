'use client'
import { AnimatedCheck } from '@/components/animatedCheck'
import GameCardResult from '@/components/pages/upload/uploadGameCard'
import UploadNewVersion from '@/components/pages/upload/uploadNewVersion'
import CreateAbandomware from '@/components/pages/upload/validateForm'
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
import { Abandonware, Game } from '@/lib/types'
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
import crypto from 'crypto';

function generateRandomSHA256() {
    const randomData = crypto.randomBytes(32);
    const hash = crypto.createHash('sha256');
    hash.update(randomData);
    return hash.digest('hex');
}

export default function Page() {
    const gameData: Abandonware = {
        gameHash: generateRandomSHA256(),
        name: 'Super Mario Bros. 3',
        genres: [1],
        publisher: 'Nintendo',
        year: 1990,
        country: 'USA',
        description: '',
        ipfsCid: '',
    }
    // TODO: SET TO NULL OR GAMEDATA, IT'S ONLY FOR TESTING AND STYLING
    const [gameResult, setGameResult] = useState<Abandonware | null>(null)
    const [uploadGame, setUploadGame] = useState<boolean>(false)

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
                {/* CREATE */}
                <div className='flex w-full flex-col gap-2'>
                    <CreateAbandomware setResultGame={setGameResult} />
                </div>
            </div>
            <div className='w-full'>
                {/* GAME RESULT */}
                {gameResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className={cn('mt-6 w-full')}
                    >
                        <h2 className='text-2xl font-semibold text-primary'>
                            Maybe your a looking this game?
                        </h2>
                        <div className='relative mt-4 flex w-full items-end  justify-between gap-4'>
                            <GameCardResult
                                game={gameResult}
                                setUploadGame={setUploadGame}
                            />
                            {uploadGame && (
                                <div className='w-full max-w-lg'>
                                    <UploadNewVersion
                                        game={gameResult}
                                        setUploadGame={setUploadGame}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
                {/* NOT EXISTING GAME */}
                {/* TODO: FIX LOGIC WHEN LANDING ON PAGE */}
                {/* {!gameResult && (
                    <div className='w-full py-12 text-center'>
                        <h2 className='mx-auto w-[50ch] text-xl text-primary'>
                            {
                                "Oops! Those titles are missing from our library, like they've vanished into the digital void. Try looking for them on Steam while we keep searching for new games for you. "
                            }
                        </h2>
                    </div>
                )} */}
            </div>
        </div>
    )
}
