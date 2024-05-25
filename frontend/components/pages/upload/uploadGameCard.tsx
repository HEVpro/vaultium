import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Game } from '@/lib/types'
import { CloudUploadIcon, LinkIcon } from 'lucide-react'
import Link from 'next/link'

interface UploadGameCardProps {
    game: Game
    setSelectedGame: (value: Game) => void
    canBeUploaded?: boolean
}
export default function UploadGameCard({ game, setSelectedGame, canBeUploaded }: UploadGameCardProps) {
    return (
        <div
            key={game.gameHash}
            className='max-w-sm rounded-md border border-primary p-3'
        >
            <div className='flex h-6 w-full  items-center justify-between'>
                <p className='text-lg text-primary'>{game.name}</p>
                <div className='flex items-center justify-center gap-2'>
                    {!game?.ipfsCid && canBeUploaded && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => setSelectedGame(game)}
                                        className='cursor-pointer transition duration-500 hover:scale-110 active:scale-90 '
                                    >
                                        <CloudUploadIcon className='h-5 w-5 stroke-1 text-primary transition duration-500 hover:stroke-2' />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className='text-foreground'>Upload a new version</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    <Link
                        href={`/${game.gameHash}`}
                        className='pointer-events-none cursor-pointer transition duration-500 hover:scale-110 active:scale-90 '
                    >
                        <LinkIcon className='h-5 w-5 stroke-1 text-primary transition duration-500 hover:stroke-2' />
                    </Link>
                </div>
            </div>
            <p className='my-3 text-sm font-light text-white'>
                {game.description}
            </p>
            <div className='flex w-full items-center justify-between'>
                <p className='font-normal text-primary'>{game.year}</p>
                <p className='font-medium text-primary'>{game.publisher}</p>
            </div>
        </div>
    )
}
