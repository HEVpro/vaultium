import { Badge } from "@/components/ui/badge"
import { abandonwares } from "@/lib/abandonwares"
import Image from "next/image"

export async function generateStaticParams() {
    // TODO: FETCH WITH GRAPH API AND MAP THE GAMEHASH IDS
    return abandonwares.map((abandonware: any) => ({
        gameHash: abandonware.gameHash,
    }))
}

async function getGame(gameHash: string) {
    return abandonwares.find((abandonware) => abandonware.gameHash === gameHash)
}


export default async function Page({ params: { gameHash } }: { params: { gameHash: string } }) {
    const abandonware = await getGame(gameHash)
    return (
        <div className="w-full min-h-screen text-white py-12 px-8 space-y-10">
            current challenges
        </div>
    )
}

