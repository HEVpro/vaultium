import { useRouter } from "next/router"


const GamePage = ({ params }: { params: { gameHash: string } }) => {
    const router = useRouter()
    return (
        <div>
            <h1>game page</h1>
            <h2>game hash: {params.gameHash}</h2>
        </div>
    )
}


export default GamePage;