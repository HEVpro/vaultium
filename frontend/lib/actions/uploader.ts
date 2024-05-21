"use server"
import lighthouse from '@lighthouse-web3/sdk'


export async function validateGame(data: any): Promise<{data: any, error: any}> {
    // TODO: sync with solidity contract -> Galadriel or lilypad
    return { data: data, error: null }
}
export async function uploadFile(file: any, apiKey: string, multiple: boolean) {
    const output = await lighthouse.upload(file, apiKey, false, undefined);
    // TODO: add the upload repsonse after validation
}