'use client'

import { useEffect, useState } from 'react'
import { abandonwares } from '@/lib/abandonwares'
import { GameCard } from './gameCard'
import { Label } from './ui/label'

const Searcher = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [games, setGames] = useState(abandonwares)
    const [debounceGame, setDebounceGame] = useState('')

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounceGame(searchTerm)
        }, 500)

        return () => {
            clearTimeout(timerId)
        }
    }, [searchTerm])

    useEffect(() => {
        if (debounceGame) {
            const filteredGames = abandonwares.filter(({ name }) => {
                return name.toLowerCase().includes(debounceGame.toLowerCase())
            })
            setGames(filteredGames)
        } else {
            setGames(abandonwares)
        }
    }, [debounceGame, abandonwares])

    return (
        <div className='mt-10 flex min-h-screen w-full flex-col items-end gap-8 pb-12'>
            <div className='grid w-full grid-cols-3 gap-8'>
                <div className='col-start-3 max-w-sm space-y-2'>
                    <p className='w-full pr-3 text-right uppercase text-white'>
                        <Label htmlFor='gameName'>Search by name</Label>
                    </p>
                    <input
                        className='w-full rounded-full border bg-blue-950 bg-opacity-20 px-6 py-2 text-primary placeholder:italic placeholder:text-primary/60 focus:ring focus:ring-primary'
                        name='gameName'
                        value={searchTerm}
                        placeholder='e.g. Dune 2000'
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {games.length > 0 ? (
                <div className='grid w-full grid-cols-3 gap-8'>
                    {games.map((item, idx) => (
                        <GameCard key={idx} item={item} />
                    ))}
                </div>
            ) : (
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
        </div>
    )
}

export default Searcher
