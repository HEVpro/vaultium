import { abandonwares } from '@/lib/abandonwares'
import { graphClient } from '@/lib/graph'
import { gql } from '@apollo/client/core'
import Image from 'next/image'
import { redirect } from 'next/navigation'

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
    const isGameChallenged = true // TODO: check if the current version is being challenged by contract read

    // TODO: print gameversion history --> Either call contract or use thegraph to get the history of the new versions
    // TODO: enable users to challenge a version

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
                    <div className=''>
                        <p className='font-nunito font-bold'>version history</p>
                        <table className='table-auto'>
                            <thead>
                                <th>IPFS CID</th>
                                <th>Link</th>
                                <th>Uploaded at</th>
                            </thead>
                            <tbody>
                                <tr>
                                    {' '}
                                    {/** TODO: Convert to a mapping of the objects retrieved by thegraph or contract read */}
                                    <td>
                                        QmXTAXgvisCDzh1cqeJN54kdYkohKMV9VaSzsN3fGQ3Y4Q
                                    </td>
                                    <td>
                                        <a href='https://gateway.pinata.cloud/ipfs/QmXTAXgvisCDzh1cqeJN54kdYkohKMV9VaSzsN3fGQ3Y4Q'>
                                            Link
                                        </a>
                                    </td>
                                    <td>2021-09-30</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {!isGameChallenged && (
                        <div className='flex flex-col space-y-2'>
                            <p className='font-nunito font-bold'>challenge</p>
                            <span className='bg-gradient rounded-lg p-2 text-black'>
                                Challenge game version{' '}
                                {/** TODO: show modal or redirect to page to contract interaction */}
                            </span>
                            <i>
                                If you believe that the current version of the
                                game is incorrect (malware, does not work
                                properly, etc.) you can proceed to challenge the
                                current version by uploading a new one, and all
                                Vaultium users will be able to vote which is the
                                correct version, current or new.
                            </i>
                        </div>
                    )}
                    {isGameChallenged && (
                        <div className='flex flex-col space-y-2'>
                            <p className='font-nunito font-bold'>
                                challenge status
                            </p>
                            <span className='bg-gradient rounded-lg p-2 text-black'>
                                Challenged
                            </span>
                            <i>
                                The current version of the game is being
                                challenged. You can vote for the current version
                                or the new one that is being proposed by the
                                challenger.
                            </i>
                            <div className='flex justify-around'>
                                <span className='bg-gradient rounded-lg p-2 text-black'>
                                    Vote for current version
                                </span>
                                <span className='bg-gradient rounded-lg p-2 text-black'>
                                    Vote for new version
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className='relative  w-1/2'>
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
                </div>
            </div>
        </div>
    )
}
