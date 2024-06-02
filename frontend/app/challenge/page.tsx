import GameChallenge from '@/components/pages/challenge/challenge'
import { Suspense } from 'react'
import Loading from './loading'

export default async function Page() {
    return (
        <div className='min-h-screen w-full space-y-10 px-8 py-12 text-white'>
            <Suspense fallback={<Loading />}>
                <GameChallenge />
            </Suspense>
        </div>
    )
}
