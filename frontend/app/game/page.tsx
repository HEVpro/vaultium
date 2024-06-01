import GameInfo from '@/components/pages/gameHash/gameInfo'
import { Suspense } from 'react'

export default async function Page() {
    return (
        <div className='min-h-screen w-full space-y-10 px-8 py-12 text-white'>
            {/* TODO: ADD FALLBACK OR SKELETON IN THE BOUNDARY */}
            <Suspense>
                <GameInfo />
            </Suspense>
        </div>
    )
}
