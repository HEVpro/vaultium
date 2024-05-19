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
            <div className="grid grid-cols-4 gap-8">
                {filteredList().map((item) => (
                    <div className="text-white mx-auto space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-full border border-primary border-white bg-primary"></div>
                        <div className="flex flex-col gap-2">
                            <p>{item.name}</p>
                            <p>{item.year}</p>
                        </div>
                    </div>
                ))}

            </div>
        </div>

    )
}

export default Searcher