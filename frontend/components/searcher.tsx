'use client'

import { useEffect, useState } from 'react'
import { abandonwares } from '@/lib/abandonwares'
import { GameCard } from './gameCard'
import { Label } from './ui/label'

const Searcher = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [games, setGames] = useState(abandonwares);
    const [debounceGame, setDebounceGame] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounceGame(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (debounceGame) {
            const filteredGames = abandonwares.filter(({ name }) => {
                return name.toLowerCase().includes(debounceGame.toLowerCase())
            })
            setGames(filteredGames)
        } else {
            setGames(abandonwares)
        }
    }, [debounceGame, abandonwares]);


    return (
        <div className='mt-10 w-full min-h-screen flex flex-col items-end gap-8 pb-12'>
            <div className='w-full grid grid-cols-3 gap-8'>
                <div className='col-start-3 max-w-sm space-y-2'>
                    <p className='w-full pr-3 text-right text-white uppercase'>
                        <Label htmlFor='gameName'>Search by name</Label>
                    </p>
                    <input
                        className='w-full rounded-full px-6 py-2 bg-blue-950 bg-opacity-20 text-primary border focus:ring focus:ring-primary placeholder:text-primary/60 placeholder:italic'
                        name='gameName'
                        value={searchTerm}
                        placeholder='e.g. Dune 2000'
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {games.length > 0 ? (
                <div className='w-full grid grid-cols-3 gap-8'>

                    {games.map((item, idx) => (
                        <GameCard key={idx} item={item} />
                    ))}
                </div>
            ) : (
                <div className='w-full h-full py-8'>
                    <p className='text-3xl text-gray-400 text-center'>{"Oh no! We couldn't find any matching games."}</p>
                    <p className='w-[38ch] mx-auto text-3xl text-gray-400 text-center'>Looks like this game hid better than a final boss. Why not try another search?</p>
                </div>
            )
            }
        </div>
    )
}

export default Searcher
