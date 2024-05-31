import GameInfo from '@/components/pages/gameHash/gameInfo'
import { Badge } from '@/components/ui/badge'
import { getGames } from '@/lib/graph'
import { notFound } from 'next/navigation'

export default async function Page() {
    return (
        <div className='min-h-screen w-full space-y-10 px-8 py-12 text-white'>
            <GameInfo />
        </div>
    )
}
