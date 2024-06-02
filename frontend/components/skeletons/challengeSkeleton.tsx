import { Skeleton } from '../ui/skeleton'

export default function ChallengeSkeleton() {
    return (
        <div className='flex w-full flex-col justify-between gap-8 px-20'>
            <Skeleton className='bg-gradient h-10 w-1/2 rounded-xl' />
            <div className='w-full space-y-2'>
                <Skeleton className='bg-gradient h-10 w-full rounded-xl' />
                <Skeleton className='bg-gradient h-8 w-full rounded-xl' />
                <Skeleton className='bg-gradient h-8 w-full rounded-xl' />
                <Skeleton className='bg-gradient h-8 w-full rounded-xl' />
            </div>
            <div className='w-full flex gap-2'>
                <Skeleton className='bg-gradient h-10 w-1/6rounded-xl' />
                <Skeleton className='bg-gradient h-10 w-5/6 rounded-xl' />

            </div>
            <Skeleton className='bg-gradient mx-auto h-10 w-1/3 rounded-xl' />

        </div>
    )
}
