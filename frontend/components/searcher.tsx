'use client'

import { useEffect, useState } from 'react'
import { GameCard } from './gameCard'
import { Label } from './ui/label'
import { usePrivy } from '@privy-io/react-auth'
import { Skeleton } from './ui/skeleton'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { graphUrl } from '@/lib/constants'
import { graphClient } from '@/lib/graph'
import { SearchIcon } from 'lucide-react'

const tokensQuery = gql`
  query{
    gameAddedToSystems{
        genres
        name
        publisher
        year
        gameHash
        country
    }
  }
`

const GameList = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [games, setGames] = useState([])
    const [debounceGame, setDebounceGame] = useState('')
    const { ready } = usePrivy()


    const gamesNotToInclude = ['banana', 'game', 'test', 'gaming']

    useEffect(() => {
        graphClient
            .query({
                query: tokensQuery,
            })
            .then((data) => {
                const results = data.data.gameAddedToSystems.map((item: any) => {
                    return {
                        name: item.name,
                        year: item.year,
                        publisher: item.publisher,
                        gameHash: item.gameHash,
                        genres: item.genres
                    }
                }).filter((item: any) => {
                    return !gamesNotToInclude.some(word => item.name.toLowerCase().includes(word));
                }).filter((item: any) => {
                    if (debounceGame) {
                        return item.name.toLowerCase().includes(debounceGame.toLowerCase())
                    } else {
                        return item.name.toLowerCase()

                    }
                })
                setGames(results)
            })
            .catch((err) => {
                console.error('Error fetching data: ', err)
            })

    }, [debounceGame])

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounceGame(searchTerm)
        }, 500)

        return () => {
            clearTimeout(timerId)
        }
    }, [searchTerm])

    return (
        <div className='mt-10 flex min-h-screen w-full flex-col items-end gap-8 pb-12'>
            <div className='grid w-full grid-cols-3 gap-8'>
                <div className='col-start-3 max-w-sm space-y-2'>
                    <p className='w-full pr-3 text-right uppercase text-white'>
                        <Label htmlFor='gameName'>Search by name</Label>
                    </p>
                    <div className='relative'>
                        <input
                            className='w-full rounded-full border bg-blue-950 bg-opacity-20 pl-6 pr-14 py-2 text-primary placeholder:italic placeholder:text-primary/60 focus:ring focus:ring-primary'
                            name='gameName'
                            value={searchTerm}
                            placeholder='e.g. Dune 2000'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SearchIcon className='absolute top-1/2 right-4 -translate-y-1/2 text-primary' />

                    </div>
                </div>
            </div>
            {!ready ? (
                <div className='grid w-full grid-cols-3 gap-8'>
                    {new Array(6).fill(0).map((_, index) => <Skeleton key={index} className="h-[400px] w-full rounded-xl bg-gradient" />
                    )}

                </div>
            ) : (
                <>
                    {games && games.length > 0 && (
                        <div className='grid w-full grid-cols-3 gap-8'>
                            {games.length && games.map((item, idx) => (
                                <GameCard key={idx} item={item} />
                            ))}
                        </div>
                    )}
                    {games && games.length === 0 && debounceGame.length > 0 && (
                        <div className='h-full w-full py-8'>
                            <p className='text-center text-3xl text-gray-400'>
                                {"Oh no! We couldn't find any matching games."}
                            </p>
                            <p className='mx-auto w-[38ch] text-center text-3xl text-gray-400'>
                                Looks like this game hid better than a final boss. Why
                                not try another search?
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default GameList
