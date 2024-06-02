'use client'
import GameCardResult from '@/components/pages/upload/uploadGameCard'
import UploadNewVersion from '@/components/pages/upload/uploadNewVersion'
import CreateAbandomware from '@/components/pages/upload/createAbandomwareForm'
import { Abandonware } from '@/lib/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { gameExample } from '@/lib/constants'

export default function Page() {

    // IF YOU WANT TO GO TO NEXT STEP OF CREATE ABANDOMWARE IMPORT gameExample FROM CONSTANTS AND SET GAME RESULT TO gameExample
    const [gameResult, setGameResult] = useState<Abandonware | null>(gameExample)
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
            </div>
        </div>
    )
}
