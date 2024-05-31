'use client'
import {
    MinusCircleIcon,
    PlusCircleIcon,
    TriangleAlertIcon,
} from 'lucide-react'
import { Badge } from './ui/badge'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface GameCardProps {
    item: any
}

export const GameCard = ({ item }: GameCardProps) => {
    const [vote, setVote] = useState(0)

    return (
        // TODO: REPLACE GAME IMAGE BY DEFAULT IMAGE
        <div className='bg-gradient group relative h-[400px] w-full overflow-hidden rounded-xl'>
            <div className='absolute inset-0.5 place-content-center'>
                <div className='relative z-20  h-full w-full min-w-44 rounded-xl text-white shadow-[inset_0px_110px_60px_-44px_rgba(0,0,0,0.75)] shadow-black transition duration-300 *:transition *:duration-300'>
                    <div className='absolute inset-0 -z-10 rounded-xl bg-black bg-opacity-60 transition  duration-300' />
                    <Image
                        width={350}
                        height={400}
                        src={item.image}
                        alt='game_image'
                        className='absolute -z-20 h-full w-full rounded-xl object-cover'
                    />
                    <Link href={"/" + item.gameHash} className='cursor-pointer flex h-full w-full flex-col justify-between overflow-hidden rounded-xl px-4 py-6 *:transition *:duration-500'>
                        <p className='text-3xl font-bold text-primary '>
                            {item.name}
                        </p>
                        <div className=' flex translate-y-12 flex-col justify-between gap-4  opacity-100  group-hover:translate-y-0 '>
                            <div className='flex justify-between'>
                                <p>{item.publisher}</p>
                                <p>{item.year}</p>
                            </div>
                            <div className='no-scrollbar flex max-h-20 min-h-16 flex-wrap items-end justify-start gap-1  overflow-scroll'>
                                {item.theme && item.theme.map(
                                    (element: string, idx: number) => (
                                        <Badge
                                            className='bg-gradient h-6 text-black'
                                            key={idx}
                                        >
                                            {element}
                                        </Badge>
                                    )
                                )}
                            </div>
                            <div className='flex items-end justify-between '>
                                <button>
                                    <TriangleAlertIcon className='tranisition duration-300 hover:stroke-yellow-500' />
                                </button>
                                <div className='flex items-center gap-4'>
                                    <button onClick={() => setVote(vote - 1)}>
                                        <MinusCircleIcon className='tranisition duration-300 hover:stroke-red-500' />
                                    </button>
                                    <span>{vote}</span>
                                    <button onClick={() => setVote(vote + 1)}>
                                        <PlusCircleIcon className='tranisition duration-300 hover:!stroke-green-500' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
