import { AnimatedCheck } from "@/components/animatedCheck"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Game } from "@/lib/types"
import { cn } from "@/lib/utils"
import { FileBoxIcon, XIcon } from "lucide-react"
import { useState } from "react"

export default function UploadNewVersion({ setSelectedGame}: { setSelectedGame: (value: Game | null) => void}) {
     // Type FILE only suported in node >20, and Fleek deploys on Node 18
     const [file, setFile] = useState<any | null>(null)
    return (
        <>
            <button
                onClick={() => setSelectedGame(null)}
                className='absolute right-0 top-0 transition duration-300 hover:scale-110 active:scale-90'
            >
                <XIcon className='h-6 w-6 stroke-white' />
            </button>
            <div className='flex items-center gap-2'>
                <div className={'relative h-12  w-60 cursor-pointer'}>
                    <Input
                        type={'file'}
                        className={
                            'absolute left-0 top-0 z-10 h-12 w-full cursor-pointer opacity-0'
                        }
                        name={'file'}
                        onChange={(e) => {
                            if (e.target.files) {
                                setFile(e.target.files[0])
                            }
                        }}
                    />
                    <div className='absolute left-0 top-0.5 flex h-12 w-full cursor-pointer items-center justify-start gap-2 rounded-lg bg-primary pl-2 pt-2 text-sm font-light text-white'>
                        <FileBoxIcon className=' mb-2.5 h-7 w-7 stroke-foreground  stroke-1' />
                        <p className='mb-1 w-full'>Click to upload</p>
                    </div>
                </div>

                <div className='mt-1 flex h-12 w-full items-center justify-start gap-2 text-wrap rounded-lg border-2 pl-2 text-sm'>
                    {file && (
                        <AnimatedCheck classname='h-5 w-5 stroke-primary' />
                    )}
                    <p
                        className={cn(
                            'font-light tracking-wide text-white',
                            file && 'italic text-primary',
                            !file && 'pl-6'
                        )}
                    >
                        {file ? file.name : 'Select a file to upload'}
                    </p>
                </div>
            </div>
            {/* TODO: WRITE ON IPFS WITH CONTRACT */}
            <Button
                disabled={!file}
                className='w-full text-base text-foreground transition duration-300 hover:text-white active:scale-90'
            >
                Upload new version
            </Button>
        </>
    )
}
