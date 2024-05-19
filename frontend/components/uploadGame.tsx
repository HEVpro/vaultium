import lighthouse from '@lighthouse-web3/sdk'
import { useState } from 'react'
import { Button } from './ui/button'


export default function uploadGame() { 
    const [file, setFile] = useState<any>(null)

    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
        console.log(percentageDone)
    }

    // TODO: move to route handler if Fleek allows route handling
    const uploadFile = async () => {
        // Push file to lighthouse node
        // Both file and folder are supported by upload function
        // Third parameter is for multiple files, if multiple files are to be uploaded at once make it true
        // Fourth parameter is the deal parameters, default null
        const output = await lighthouse.upload(
            file,
            process.env.NNEXT_PUBLIC_LIGHTHOUSE_API_KEY!,
            false
        )
        console.log('File Status:', output)
        /*
          output:
            data: {
              Name: "filename.txt",
              Size: 88000,
              Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
            }
          Note: Hash in response is CID.
        */

        console.log(
            'Visit at https://gateway.lighthouse.storage/ipfs/' +
                output.data.Hash
        )
    }

    console.log(file)

    return (
        <form>
            <input
                onChange={(e) => setFile(e.target.files)}
                type='file'
                name='file'
            />
            <Button
                onClick={(e) => {
                    e.preventDefault()
                    uploadFile(file)
                }}
            >
                Upload
            </Button>
        </form>
    )
}
