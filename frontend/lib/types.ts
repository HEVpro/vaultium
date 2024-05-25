// TODO: IS FOR UPLOAD COMPONENT, MAYBE WE CAN CREATE A GENERIC GAME AN ANOTHER FOR UPLOAD
export interface Game {
    name: string;
    year: number;
    publisher: string;
    ipfsCid: string | null;
    isAbandonware: boolean;
    description: string;
    gameHash: string;
}