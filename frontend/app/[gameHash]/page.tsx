import { Badge } from '@/components/ui/badge'
import { abandonwares } from '@/lib/abandonwares'
import { graphClient } from '@/lib/graph'
import { gql } from '@apollo/client'
import Image from 'next/image'

export async function generateStaticParams() {
    // let results: {gameHash: string}[] = []
    const tokensQuery = gql`
        query {
            gameAddedToSystems {
                gameHash
            }
        }
    `
    const gameHashes = await graphClient
        .query({
            query: tokensQuery,
        })
        .then((data) => {
            return data.data.gameAddedToSystems.map((item: any) => ({
                gameHash: item.gameHash,
            }))
        })
        .catch((err) => {
            console.error('Error fetching data: ', err)
        })
    return gameHashes
}

async function getGame(gameHash: string) {
    return abandonwares.find((abandonware) => abandonware.gameHash === gameHash)
}

export default async function Page({
    params: { gameHash },
}: {
    params: { gameHash: string }
}) {
    const abandonware = await getGame(gameHash)
    return (
        <div className='min-h-screen w-full space-y-10 px-8 py-12 text-white'>
            <div className='flex w-full '>
                <div className='w-1/2 space-y-6 px-10'>
                    <h1 className='text-3xl'>{abandonware?.name}</h1>
                    <div className='space-y-2'>
                        <div className='grid grid-cols-2'>
                            <div className=''>
                                <p className='font-nunito font-bold'>
                                    platform
                                </p>
                                <p>{abandonware?.platform}</p>
                            </div>
                            <div className=''>
                                <p className='font-nunito font-bold'>year</p>
                                <p>{abandonware?.year}</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-2'>
                            <div className=''>
                                <p className='font-nunito font-bold'>genre</p>
                                <p>{abandonware?.genre}</p>
                            </div>
                            <div className=''>
                                <p className='font-nunito font-bold'>
                                    publisher
                                </p>
                                <p>{abandonware?.publisher}</p>
                            </div>
                        </div>
                        <div className=''>
                            <p className='font-nunito font-bold'>released in</p>
                            <p>{abandonware?.releasedIn}</p>
                        </div>
                    </div>
                    <div>
                        <p className='font-nunito font-bold'>description:</p>
                        <p className='no-scrollbar max-h-32 overflow-scroll'>
                            {abandonware?.description}
                        </p>
                    </div>
                    <div className='space-y-2'>
                        <p className='font-nunito font-bold'>themes:</p>
                        <div className='no-scrollbar flex max-h-20 min-h-16 flex-wrap items-start justify-start gap-1  overflow-scroll'>
                            {abandonware?.theme.map(
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
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <p className='font-nunito font-bold'>download</p>
                        <a
                            href={
                                'https://gateway.lighthouse.storage/ipfs/' +
                                abandonware?.ipfsCid
                            }
                            target='_blank'
                            className='bg-gradient rounded-lg p-2 text-black'
                        >
                            Download
                        </a>
                        <i>Is this version of the file wrong?</i>
                        <a
                            href={'/' + gameHash + '/challenge'}
                            className='text-blue-500'
                        >
                            Challenge it now!
                        </a>
                    </div>
                </div>
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
