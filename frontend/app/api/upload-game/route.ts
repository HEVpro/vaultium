import lighthouse from '@lighthouse-web3/sdk'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {

    const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY

    if (!LIGHTHOUSE_API_KEY) {
        return NextResponse.json({ message: 'Missing Lighthouse API Key' }, { status: 400 })
    }

    try {
        const formData = await request.formData()

        const file = formData.get('file')
    
        const uploadResponse = await lighthouse.upload(file, LIGHTHOUSE_API_KEY)
    
        return NextResponse.json({ message: 'Hello World' })


    } catch (error) {
        return NextResponse.json({ message: "Error uploading file" }, { status: 500 })
    }
}