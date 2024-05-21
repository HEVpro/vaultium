"use client"
import { MinusCircleIcon, PlusCircleIcon, TriangleAlertIcon } from "lucide-react"
import { Badge } from "./ui/badge"
import { useState } from "react"
import Image from "next/image"

interface GameCardProps {
    item: any
}

export const GameCard = ({ item }: GameCardProps) => {
    const [vote, setVote] = useState(0)
    return (
        <div
            className='group relative h-[400px] w-full min-w-44 rounded-xl text-white shadow-black shadow-[inset_0px_110px_60px_-44px_rgba(0,0,0,0.75)] transition duration-300 *:transition *:duration-300 border border-blue-950'
        >
            <div className='-z-10 absolute inset-0 bg-black bg-opacity-60 transition duration-300  rounded-t-xl' />
            <Image
            width={300}
            height={500}
                src='./game_bg.jpg'
                alt='game_image'
                className='-z-20 absolute w-full h-full object-cover rounded-xl'
            />
            <div className='z-20 w-full h-full flex flex-col justify-between px-4 py-6 rounded-xl *:transition *:duration-500 overflow-hidden'>
                <p className='text-3xl font-bold text-primary '>
                    {item.name}
                </p>
                <div className="flex flex-col justify-between gap-6 translate-y-14  group-hover:translate-y-0  opacity-100 ">
                    <div className='flex flex-col gap-8'>
                        <div>
                            <div className='flex justify-between'>
                                <p>{item.platform}</p>
                                <p>{item.year}</p>
                            </div>
                            <p>{item.releasedIn}</p>
                            <p>{item.publisher}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {item.theme.map((element: string, idx: number) => (
                                <Badge className="h-6 bg-gradient text-black" key={idx}>{element}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                        {/* <p className="text-center">vote</p> */}
                        <div className="w-full flex justify-between ">
                            <button>
                                <TriangleAlertIcon className="hover:stroke-yellow-500 tranisition duration-300" />
                            </button>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setVote(vote - 1)}>
                                    <MinusCircleIcon className="hover:stroke-red-500 tranisition duration-300" />
                                </button>
                                <span>{vote}</span>
                                <button onClick={() => setVote(vote + 1)}>
                                    <PlusCircleIcon className="hover:stroke-green-500 tranisition duration-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}