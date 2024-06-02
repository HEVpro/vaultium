import { Skeleton } from '../ui/skeleton'

export default function GameSkeleton() {
    return (
        <div className='flex w-full flex-col justify-between gap-8'>
            <Skeleton className='bg-gradient h-10 w-1/2 rounded-xl' />
            <div className='flex w-full justify-between gap-10'>
                <div className='w-1/2 space-y-4'>
                    <div className='grid w-full grid-cols-3 gap-4'>
                        <div className='flex w-full flex-col gap-1'>
                            <Skeleton className='bg-gradient h-6 w-1/2 rounded-xl' />
                            <Skeleton className='bg-gradient h-6 w-1/2 rounded-xl' />
                        </div>
                        <div className='flex w-full flex-col gap-1'>
                            <Skeleton className='bg-gradient h-6 w-1/2 rounded-xl' />
                            <Skeleton className='bg-gradient h-6 w-1/2 rounded-xl' />
                        </div>
                        <div className='col-span-3 row-start-2 flex w-full flex-col gap-1'>
                            <Skeleton className='bg-gradient h-6 w-1/6 rounded-xl' />
                            <div className='flex w-full gap-2'>
                                <Skeleton className='bg-gradient h-6 w-1/6 rounded-xl' />
                                <Skeleton className='bg-gradient h-6 w-1/6 rounded-xl' />
                                <Skeleton className='bg-gradient h-6 w-1/6 rounded-xl' />
                                <Skeleton className='bg-gradient h-6 w-1/6 rounded-xl' />
                            </div>
                        </div>
                    </div>
                    <div className='w-full space-y-1'>
                        <Skeleton className='bg-gradient h-8 w-full rounded-xl' />
                        <Skeleton className='bg-gradient h-6 w-full rounded-xl' />
                    </div>
                </div>
                <div className='w-1/2'>
                    <Skeleton className='bg-gradient h-64 w-full rounded-xl' />
                </div>
            </div>
        </div>
    )
}
