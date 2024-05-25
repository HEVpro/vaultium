'use client'
import { AnimatedCheck } from '@/components/animatedCheck'
import UploadGameCard from '@/components/pages/upload/uploadGameCard'
import ValidateForm from '@/components/pages/upload/validateForm'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import useCustomForm, { FormSchema } from '@/components/uploadForm'
import { countries } from '@/lib/countries'
import { Game } from '@/lib/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
    CircleCheck,
    CloudUploadIcon,
    FileBoxIcon,
    LinkIcon,
    PickaxeIcon,
    Upload,
    XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'

export default function Page() {
    // Type FILE only suported in node >20, and Fleek deploys on Node 18
    const [file, setFile] = useState<any | null>(null)
    // TODO: REPLACE BY GALADRIEL VALIDATION
    // const [isValid, setIsValid] = useState<boolean>(false)
    const [searchedGames, setSearchedGames] = useState<Game[] | null>(null)
    const [selectedGame, setSelectedGame] = useState<Game | null>(null)
    const { form } = useCustomForm()

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.info(data)
        // TODO:  INTEGRATE WITH THE BLOCKCHAIN
        // toast({
        //   title: "You submitted the following values:",
        //   description: (
        //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //     </pre>
        //   ),
        // })
    }

    return (
        <div className='flex flex-col items-center justify-start px-6 pb-24'>
            <div className='flex w-full items-start justify-between gap-8 py-12 text-white'>
                <div className='w-full '>
                    <h1 className='max-w-[15ch] text-4xl text-primary'>
                        HODL Your Retro Games Forever!
                    </h1>
                    <p className='text-md mt-4 font-light leading-7 tracking-wide text-white'>
                        Preserve your favorite retro games for eternity by
                        uploading them to the Vaultium blockchain. Simply select
                        your game file below, provide some details, and become a
                        part of gaming history. With our secure, decentralized
                        storage, your classics will be safe, accessible, and
                        appreciated by gamers everywhere!
                    </p>
                </div>
                {/* VALIDATE */}
                <div className='flex w-full flex-col gap-2'>
                    <ValidateForm setSearchedGames={setSearchedGames} />
                </div>
            </div>
            <div className='w-full'>
                {!selectedGame &&
                    searchedGames &&
                    searchedGames?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className={cn('mt-6 w-full')}
                        >
                            <h2 className='text-2xl font-semibold text-primary'>
                                Maybe your a looking for one of these games?
                            </h2>
                            <div className='mt-4 grid w-full grid-cols-3 gap-4'>
                                {searchedGames?.map((game) => (
                                    <UploadGameCard
                                        key={game.gameHash}
                                        game={game}
                                        setSelectedGame={setSelectedGame}
                                        canBeUploaded={true}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                {selectedGame && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className='mt-6 w-full'
                    >
                        <h2 className='text-2xl font-semibold text-primary'>
                            Do you have a new version? This is the moment!
                        </h2>
                        <div className='relative mt-4 flex w-full items-end  justify-between gap-4'>
                            <UploadGameCard
                                game={selectedGame}
                                setSelectedGame={setSelectedGame}
                                canBeUploaded={false}
                            />
                            <div className='w-full max-w-lg space-y-2'>
                                <button
                                    onClick={() => setSelectedGame(null)}
                                    className='absolute right-0 top-0 transition duration-300 hover:scale-110 active:scale-90'
                                >
                                    <XIcon className='h-6 w-6 stroke-white' />
                                </button>
                                <div className='flex items-center gap-2'>
                                    <div
                                        className={
                                            'relative h-12  w-60 cursor-pointer'
                                        }
                                    >
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
                                            <p className='mb-1 w-full'>
                                                Click to upload
                                            </p>
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
                                            {file
                                                ? file.name
                                                : 'Select a file to upload'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    disabled={!file}
                                    className='w-full text-base text-foreground transition duration-300 hover:text-white active:scale-90'
                                >
                                    Upload new version
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
                {searchedGames && searchedGames.length === 0 && (
                    <div className='w-full py-12 text-center'>
                        <h2 className='mx-auto w-[50ch] text-xl text-primary'>
                            {
                                "Oops! Those titles are missing from our library, like they've vanished into the digital void. Try looking for them on Steam while we keep searching for new games for you. "
                            }
                        </h2>
                    </div>
                )}
            </div>

            {/* {isValid && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className='w-full px-6'
                >
                    <h2 className='text-3xl font-semibold text-primary'>
                        Complete the game info
                    </h2>
                    <div className='mt-4 w-full '>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className='grid w-full grid-cols-1 content-center gap-4 justify-self-center  sm:grid-cols-2	lg:grid-cols-3'
                            >
                                <FormField
                                    control={form.control}
                                    name='year'
                                    render={({ field }) => (
                                        <FormItem className='col-span-1'>
                                            <FormLabel className='text-primary'>
                                                Year
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='shadcn'
                                                    min={1900}
                                                    max={
                                                        new Date().getFullYear() +
                                                        1
                                                    }
                                                    step={1}
                                                    type='number'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='platform'
                                    render={({ field }) => (
                                        <FormItem className='col-span-1'>
                                            <FormLabel className='text-primary'>
                                                Platform
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='The platform of the game'
                                                    type='text'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='releasedIn'
                                    render={({ field }) => (
                                        <FormItem className='col-span-1'>
                                            <FormLabel className='text-primary'>
                                                Released in
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select a country' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {countries.map(
                                                        (country) => (
                                                            <SelectItem
                                                                key={
                                                                    country.code
                                                                }
                                                                value={
                                                                    country.name
                                                                }
                                                            >
                                                                {country.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='genre'
                                    render={({ field }) => (
                                        <FormItem className='col-span-1'>
                                            <FormLabel className='text-primary'>
                                                Genre
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='e.g. Educational'
                                                    type='text'
                                                    className='placeholder:italic'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='theme'
                                    render={({ field }) => (
                                        <FormItem className='col-span-1'>
                                            <FormLabel className='text-primary'>
                                                Theme
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='e.g. History'
                                                    type='text'
                                                    className='placeholder:italic'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='publisher'
                                    render={({ field }) => (
                                        <FormItem className='col-span-1'>
                                            <FormLabel className='text-primary'>
                                                Publisher
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='e.g. MECC'
                                                    type='text'
                                                    className='placeholder:italic'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='col-span-full mt-4 flex items-center justify-end'>
                                    <Button type='submit'>Submit</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </motion.div>
            )} */}
        </div>
    )
}
