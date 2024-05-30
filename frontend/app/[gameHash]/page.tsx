import { Badge } from "@/components/ui/badge"
import { abandonwares } from "@/lib/abandonwares"
import Image from "next/image"

export async function generateStaticParams() {
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
            <div className="w-full flex ">

                <div className="w-1/2 px-10 space-y-6">
                    <h1 className="text-3xl">{abandonware?.name}</h1>
                    <div className="space-y-2">
                        <div className="grid grid-cols-2">

                            <div className="">
                                <p className="font-bold font-nunito">platform</p>
                                <p>{abandonware?.platform}</p>
                            </div>
                            <div className="">
                                <p className="font-bold font-nunito">year</p>
                                <p>{abandonware?.year}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">

                            <div className="">
                                <p className="font-bold font-nunito">genre</p>
                                <p>{abandonware?.genre}</p>
                            </div>
                            <div className="">
                                <p className="font-bold font-nunito">publisher</p>
                                <p>{abandonware?.publisher}</p>
                            </div>
                        </div>
                        <div className="">
                            <p className="font-bold font-nunito">released in</p>
                            <p>{abandonware?.releasedIn}</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold font-nunito">description:</p>
                        <p className="max-h-32 overflow-scroll no-scrollbar">{abandonware?.description}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-bold font-nunito">themes:</p>
                        <div className='no-scrollbar flex max-h-20 min-h-16 flex-wrap items-start justify-start gap-1  overflow-scroll'>
                            {abandonware?.theme.map(
                                (element: string, idx: number) => (
                                    <Badge
                                        className='bg-gradient h-6 text-black'
                                        key={idx}
                                    >
                                        {element}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <p className="font-bold font-nunito">download</p>
                        <a href={"https://gateway.lighthouse.storage/ipfs/" + abandonware?.ipfsCid} target="_blank" className="bg-gradient text-black p-2 rounded-lg">Download</a>
                        <i>Is this version of the file wrong?</i>
                        <a href={"/challenge/" + gameHash} className="text-blue-500">Challenge it now!</a>
                    </div>
                </div>

                <div className="w-1/2  relative">
                    <Image
                        width={600}
                        height={600}
                        src={abandonware?.image as string}
                        alt="bg-image"
                        className="w-full h-96 mx-auto object-cover rounded-3xl shadow-xl shadow-blue-950"
                    />
                    <Image
                        width={400}
                        height={400}
                        src={abandonware?.image as string}
                        alt="bg-image"
                        className="-z-20 absolute inset-x-20 inset-y-20 opacity-10 w-full h-96 mx-auto object-cover shadow-inner"
                    />
                </div>
            </div>
            {/* A list of abandonwares */}
            {/* <div className="grid grid-cols-3 gap-6">
                {abandonwares.map((abandonware) => (
                    <GameCard item={abandonware} />
                ))}
            </div> */}
        </div>
    )
}

