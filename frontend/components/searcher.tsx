'use client'

import { useState } from 'react'
import { abandonwares } from '@/lib/abandonwares'
import Image from 'next/image'

const Searcher = () => {
    const [gameName, setGameName] = useState('')

    const handleChange = (e: any) => {
        setGameName(e.target.value)
    }

    const filteredList = () => {
        return abandonwares.filter((game) => {
            return game.name.toLowerCase().includes(gameName.toLowerCase())
        })
    }

    return (
        <div className='mt-20 w-full space-y-20'>
            <div className='mx-auto w-72'>
                <input
                    className='mx-auto w-full rounded-full px-6 py-2'
                    name='gameName'
                    value={gameName}
                    placeholder='Search a game'
                    onChange={(e) => handleChange(e)}
                />
            </div>
            <div className='grid grid-cols-3 gap-8'>
                {filteredList().map((item, idx) => (
                    <div
                        key={idx}
                        className='group mx-auto h-full w-full space-y-4 rounded-md border border-transparent p-6 text-white transition duration-300 hover:border-primary'
                    >
                        <div>
                            <Image
                                width={120}
                                height={120}
                                src='./vaultium-logo.png'
                                alt='game_image'
                                className='mx-auto rounded-full border border-primary border-white bg-[#ee96f5]'
                            />
                        </div>
                        <div className='flex flex-col gap-6'>
                            <p className='text-xl transition-colors duration-300 group-hover:text-primary'>
                                {item.name}
                            </p>
                            <div className='flex flex-col'>
                                <div className='flex justify-between'>
                                    <p>{item.platform}</p>
                                    <p>{item.year}</p>
                                </div>
                                <p>{item.releasedIn}</p>
                                <div className='truncate'>
                                    {item.theme.map((element, idx) => (
                                        <span key={idx}>{element}, </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Searcher
