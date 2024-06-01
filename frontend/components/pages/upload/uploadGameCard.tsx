import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Abandonware, Game } from '@/lib/types'
import { CloudUploadIcon, ImageUp, LinkIcon, SwordsIcon } from 'lucide-react'
import Link from 'next/link'

interface UploadGameCardProps {
    game: Abandonware
    setUploadGame: (value: boolean) => void
}
export default function GameCardResult({
    game,
    setUploadGame,
}: UploadGameCardProps) {
    return (
        <div
            key={game.gameHash}
            className='w-full max-w-sm rounded-md border border-primary p-3'
        >
            <div className='flex h-14 w-full  items-center justify-between'>
                <p className='text-lg text-primary'>{game.name}</p>
                <div className='flex items-center justify-center gap-2'>
                    {game?.ipfsCid && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={
                                            '/challenge?gameHash=' +
                                            game.gameHash
                                        }
                                        className='cursor-pointer transition duration-300 hover:scale-110 active:scale-90 '
                                    >
                                        <SwordsIcon className='h-5 w-5 stroke-1 text-primary transition duration-500 hover:stroke-2' />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className='max-w-[30ch] text-foreground'>
                                        Do you think that there are a better
                                        version? Create a challenge!
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setUploadGame(true)}
                                    className='cursor-pointer transition duration-300 hover:scale-110 active:scale-90 '
                                >
                                    <CloudUploadIcon className='h-5 w-5 stroke-1 text-primary transition duration-500 hover:stroke-2' />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className='text-foreground'>Upload a Game</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* TODO: TO BE DELETED */}
                    {/* <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                    // TODO: ADD FUNCTIONALITY TO UPLOAD IMAGE
                                        onClick={() => setSelectedGame(game)}
                                        className='cursor-pointer transition duration-500 hover:scale-110 active:scale-90 '
                                    >
                                        <ImageUp className='h-5 w-5 stroke-1 text-primary transition duration-500 hover:stroke-2' />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className='text-foreground'>
                                        Upload a image
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider> */}

                    <Link
                        href={`/game?gameHash=${game.gameHash}`}
                        className=' cursor-pointer transition duration-500 hover:scale-110 active:scale-90 '
                    >
                        <LinkIcon className='h-5 w-5 stroke-1 text-primary transition duration-500 hover:stroke-2' />
                    </Link>
                </div>
            </div>
            <p className='my-3 text-sm font-light text-white'>
                {game?.description}
            </p>
            <div className='flex w-full items-center justify-between'>
                <p className='font-normal text-primary'>{game.year}</p>
                <p className='font-medium text-primary'>{game.publisher}</p>
            </div>
        </div>
    )
}
