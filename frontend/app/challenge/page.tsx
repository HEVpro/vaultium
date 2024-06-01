import GameChallenge from '@/components/pages/challenge/challenge'
import { abandonwares } from '@/lib/abandonwares'
import { graphClient } from '@/lib/graph'
import { gql } from '@apollo/client/core'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function Page() {
    const isGameChallenged = true // TODO: check if the current version is being challenged using hasActiveChallengeForGame

    return (
        <div className='min-h-screen w-full space-y-10 px-8 py-12 text-white'>
            <Suspense>
                <GameChallenge />
            </Suspense>
        </div>
    )
}
