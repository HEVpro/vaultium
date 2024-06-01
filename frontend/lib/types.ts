export interface Game {
    genres: number[];
    name: string;
    publisher: string;
    year: number;
    gameHash: string;
    country: string;
    description: string;
}


export interface Abandonware {
    name: string
    year: number
    genres: number[]
    publisher: string
    description: string
    ipfsCid: string
    gameHash: string
    country: string;
    // Add other properties as needed
}

export type OptionType = {
    label: string
    value: any
}

export type GameVersion = {
    gameHash: string
    ipfsCid: string
    imageCid: string
}