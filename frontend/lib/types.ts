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
    // Add other properties as needed
}

export type OptionType = {
    label: string
    value: any
}