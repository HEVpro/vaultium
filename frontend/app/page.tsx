import GameList from '@/components/searcher'

export default function Home() {
    return (
        <>
            <section className='w-full space-y-2 pb-4 pt-16 text-white'>
                <h1 className='text-5xl '>Rediscover Forgotten Classics!</h1>
                <p className='text-xl'>
                    The video game basement is waiting for you. Dare to explore?
                </p>
            </section>
            <GameList />
        </>
    )
}
