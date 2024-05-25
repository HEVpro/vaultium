import lighthouse from '@lighthouse-web3/sdk'
import { Button } from './ui/button'
import { useState } from 'react'

export default function UploadGame() {
    const [file, setFile] = useState<any>(null)

    const progressCallback = (progressData: any) => {
        let percentageDone =
            100 -
            Number((progressData?.total / progressData?.uploaded)?.toFixed(2))
        console.info(percentageDone)
    }

    // TODO: move to route handler if Fleek allows route handling
    const uploadFile = async (fileInput: any) => {
        // Push file to lighthouse node
        // Both file and folder are supported by upload function
        // Third parameter is for multiple files, if multiple files are to be uploaded at once make it true
        // Fourth parameter is the deal parameters, default null
        const output = await lighthouse.upload(
            fileInput,
            process.env.NNEXT_PUBLIC_LIGHTHOUSE_API_KEY!,
            false
        )
        console.info('File Status:', output)
        /*
          output:
            data: {
              Name: "filename.txt",
              Size: 88000,
              Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
            }
          Note: Hash in response is CID.
        */

        console.info(
            'Visit at https://gateway.lighthouse.storage/ipfs/' +
                output.data.Hash
        )
    }

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
