'use client'
import {
    HeartIcon,
    MinusCircleIcon,
    PlusCircleIcon,
    TriangleAlertIcon,
} from 'lucide-react'
import { Badge } from './ui/badge'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface GameCardProps {
    item: any
}

export const GameCard = ({ item }: GameCardProps) => {
    const [like, setLike] = useState(false)
    const [totalLikes, setTotalLikes] = useState(0)

    return (
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
                                <p>{item.platform}</p>
                                <p>{item.year}</p>
                            </div>
                            <div className='no-scrollbar flex max-h-20 min-h-16 flex-wrap items-end justify-start gap-1  overflow-scroll'>
                                {item.theme.map(
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
                            <div className='z-30 flex items-end gap-4 ml-auto'>
                                <span>{totalLikes}</span>
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    setLike(!like)
                                    setTotalLikes(totalLikes + 1)
                                }}>
                                    <HeartIcon className={cn('tranisition duration-300 hover:!stroke-red-500',
                                        like ? "fill-red-500" : "fill-none")} />
                                </button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
