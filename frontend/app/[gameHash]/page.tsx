import GameInfo from '@/components/pages/gameHash/gameInfo'
import { Badge } from '@/components/ui/badge'
import { getGames } from '@/lib/graph'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    const games = await getGames()
    return games.map((game) => ({
        gameHash: game.gameHash,
    }))
}

const findGame = async (gameHash: string) => {
    const games = await getGames()
    return games.find((field) => field.gameHash === gameHash)
}

export default async function Page({
    params: { gameHash },
}: {
    params: { gameHash: string }
}) {
    const abandonware = await findGame(gameHash)
    // TODO: NOT WORKING, A BUG IN NEXT.JS NOT CLOSED
    if (!abandonware) {
        return notFound()
    }

    return (
        <div className='min-h-screen w-full space-y-10 px-8 py-12 text-white'>
            <div className='flex w-full '>
                <GameInfo gameHash={gameHash} />
                
                {/* TODO: WE NEED A CDN FOR THE IMAGES, FOR THE MOMENT WE WILL NOT UPLOAD IMAGES TO IPFS */}
                {/* <div className='relative  w-1/2'>
                    <Image
                        width={600}
                        height={600}
                        src={abandonware?.image as string}
                        alt='bg-image'
                        className='mx-auto h-96 w-full rounded-3xl object-cover shadow-xl shadow-blue-950'
                    />
                    <Image
                        width={400}
                        height={400}
                        src={abandonware?.image as string}
                        alt='bg-image'
                        className='absolute inset-x-20 inset-y-20 -z-20 mx-auto h-96 w-full object-cover opacity-10 shadow-inner'
                    />
                </div> */}
            </div>
            {/* A list of abandonwares */}
            {/* <div className="grid grid-cols-3 gap-6">
                {abandonwares.map((abandonware) => (
                    <GameCard item={abandonware} />
                ))}
            </div> */}
        </div>
    )
}
