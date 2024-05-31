export interface Game {
    genres: number[];
    name: string;
    publisher: string;
    year: number;
    gameHash: string;
    country: string;
}


export interface Abandonware {
    name: string
    year: number
    genres: number[]
    publisher: string
    description: string
    ipfsCid: string
    gameHash: string
    // Add other properties as needed
}