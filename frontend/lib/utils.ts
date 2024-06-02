import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod';
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const transformGenres = (genres: number[]): string[] => {
    const genreMap: Record<number, string> = {
        0: 'Action',
        1: 'Adventure',
        2: 'Fighting',
        3: 'Platform',
        4: 'Puzzle',
        5: 'Racing',
        6: 'RolePlaying',
        7: 'Shooter',
        8: 'Simulation',
        9: 'Sports',
        10: 'Strategy'
    };

    return genres.map(genre => genreMap[genre] || 'Other');
}

export const optionSchemaNumber = z.object({
    label: z.string(),
    value: z.number(),
})

export function generateRandomSHA256() {
    const randomData = crypto.randomBytes(32);
    const hash = crypto.createHash('sha256');
    hash.update(randomData);
    return hash.digest('hex');
}