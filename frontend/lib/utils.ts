import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const transformGenres = (genres: number[]) => {
    return genres.map((genre) => {
        switch (genre) {
            case 0:
                return 'Action'
            case 1:
                return 'Adventure'
            case 2:
                return 'Fighting'
            case 3:
                return 'Platform'
            case 4:
                return 'Puzzle'
            case 5:
                return 'Racing'
            case 6:
                return 'RolePlaying'
            case 7:
                return 'Shooter'
            case 8:
                return 'Simulation'
            case 9:
                return 'Sports'
            case 10:
                return 'Strategy'
            default:
                return 'Other'
 
        }
    })
}