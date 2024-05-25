'use server'
import lighthouse from '@lighthouse-web3/sdk'

// If exists you can upload the game
// If exists and have a file, upload the game for a new version —> challenge
// If array is empty, you are inventing the game

const fakeResponses = [
    [
        {
            name: 'The Legend of Zelda',
            year: 1986,
            publisher: 'Nintendo',
            ipfsCid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG', // This is a sample IPFS CID, replace with a real one
            isAbandonware: true,
            description:
                'The Legend of Zelda is an action-adventure game developed and published by Nintendo.',
            gameHash: '0x3f4eabcd5CZsnA625s3Xf2nemtYgPpH', // This is a sample hash, replace with a real one
        },
        {
            name: 'Metroid',
            year: 1986,
            publisher: 'Nintendo',
            ipfsCid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG', // This is a sample IPFS CID, replace with a real one
            isAbandonware: true,
            description:
                'Metroid is an action-adventure game developed and published by Nintendo.',
            gameHash: '0x3f4eabcd5CZsnA625s3Xf2nemtYgPpH', // This is a sample hash, replace with a real one
        },
        {
            name: 'Donkey Kong',
            year: 1981,
            publisher: 'Nintendo',
            ipfsCid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG', // This is a sample IPFS CID, replace with a real one
            isAbandonware: true,
            description:
                'Donkey Kong is an arcade game developed and published by Nintendo.',
            gameHash: '0x3f4eabcd5CZsnA625s3Xf2nemtYgPpH', // This is a sample hash, replace with a real one
        },
    ],
    [
        {
            name: 'Peach Adventure',
            year: 2000,
            publisher: 'Nintendo',
            ipfsCid: null,
            isAbandonware: true,
            description:
                'Peach Adventure is a platform game developed and published by Nintendo.',
            gameHash: '0x3f4eabcd5CZsnA625s3Xf2nemtYgPpH', // This is a sample hash, replace with a real one
        },
        {
            name: 'Luigi Mansion',
            year: 2001,
            publisher: 'Nintendo',
            ipfsCid: null,
            isAbandonware: true,
            description:
                'Luigi Mansion is an action-adventure game developed and published by Nintendo.',
            gameHash: '0x3f4eabcd5CZsnA625s3Xf2nemtYgPpH', // This is a sample hash, replace with a real one
        },
        {
            name: 'Yoshi Island',
            year: 1995,
            publisher: 'Nintendo',
            ipfsCid: null,
            isAbandonware: true,
            description:
                'Yoshi Island is a platform game developed and published by Nintendo.',
            gameHash: '0x3f4eabcd5CZsnA625s3Xf2nemtYgPpH', // This is a sample hash, replace with a real one
        },
    ],
    // [],
]

export async function validateGame(
    data: any
): Promise<{ data: any; error: any }> {
    // TODO: sync with solidity contract -> Galadriel or lilypad

    // TODO: REPLACE BY THE CORRECT ANSWER FROM THE BLOCKCHAIN
    const randomIndex = Math.floor(Math.random() * fakeResponses.length)
    const randomResponse = fakeResponses[randomIndex]

    return { data: randomResponse, error: null }
}
export async function uploadFile(file: any, apiKey: string, multiple: boolean) {
    const output = await lighthouse.upload(file, apiKey, false, undefined)
    // TODO: add the upload repsonse after validation
}
