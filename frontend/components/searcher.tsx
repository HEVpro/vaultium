"use client"

import { useState } from "react"
import abandonwares from "@/public/json/abandonwares.json"

const Searcher = () => {
    const [gameName, setGameName] = useState("")

    const handleChange = (e: any) => {
        setGameName(e.target.value)
    }

    const filteredList = () => {
        return abandonwares.filter((game) => {
            return (
                game
                    .name
                    .toLowerCase()
                    .includes(gameName.toLowerCase())
            );
        })
    }


    return (
        <div className="w-full mt-20 space-y-20">
            <div className="w-72 mx-auto">
                <input
                    className="w-full mx-auto rounded-full py-2 px-6"
                    name="gameName"
                    value={gameName}
                    placeholder="Search a game"
                    onChange={(e) => handleChange(e)}
                />
            </div>
            <div className="grid grid-cols-3 gap-8">
                {filteredList().map((item, idx) => (
                    <div key={idx} className=" group w-full h-full p-6 text-white mx-auto space-y-4 rounded-md transition duration-300 border border-transparent hover:border-primary">
                        <div className="w-30 h-30 mx-auto rounded-full border border-primary border-white bg-[#ee96f5]">
                            <img src="./vaultium-logo.png" />
                        </div>
                        <div className="flex flex-col gap-6">
                            <p className="text-xl group-hover:text-primary transition-colors duration-300">{item.name}</p>
                            <div className="flex flex-col">
                                <div className="flex justify-between">
                                    <p>{item.platform}</p>
                                    <p>{item.year}</p>
                                </div>
                                <p>{item.releasedIn}</p>
                                <div className="truncate">
                                    {item.theme.map((element) => <span>{element}, </span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>

    )
}

export default Searcher