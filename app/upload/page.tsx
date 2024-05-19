'use client'
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
import useCustomForm, { FormSchema } from '@/components/uploadForm'
import { countries } from '@/lib/countries'
import { motion } from 'framer-motion'
import { CircleCheck, FileBoxIcon, Upload } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

export default function Page() {
    // Type FILE only suported in node >20, and Fleek deploys on Node 18
    const [file, setFile] = useState<any | null>(null)
    // TODO: REPLACE BY GALADRIEL VALIDATION
    const [isValid, setIsValid] = useState<boolean>(false)
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
        <div className='flex flex-col items-center justify-start gap-10'>
            <div className='flex w-full items-end justify-between gap-8  px-6 pb-16 pt-12 text-white'>
                <div className='max-w-lg '>
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
                <div className='w flex w-full flex-col gap-2'>
                    <div className='flex w-full items-center gap-2 '>
                        <div
                            className={'relative mb-5 h-10 w-60 cursor-pointer'}
                        >
                            <Input
                                type={'file'}
                                className={
                                    'absolute left-0 top-1 z-10 h-14 w-full cursor-pointer opacity-0'
                                }
                                name={'file'}
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setFile(e.target.files[0])
                                    }
                                }}
                            />
                            <div className='absolute left-0 top-0.5 flex h-14 w-full cursor-pointer items-center justify-start gap-2 rounded-lg bg-primary pl-2 pt-2 text-sm font-light text-white'>
                                <FileBoxIcon className=' mb-2.5 h-7 w-7 stroke-foreground  stroke-1' />
                                <p className='mb-1 w-full'>Click to upload</p>
                            </div>
                        </div>

                        <div className='flex h-14 w-full items-center justify-start gap-2 text-wrap rounded-lg border-2 pl-2 pt-2 text-sm'>
                            {file ? (
                                <CircleCheck className='ml-2 h-7 w-7 stroke-green-400 stroke-1' />
                            ) : (
                                <Upload className='ml-2 h-7 w-7 stroke-primary stroke-1' />
                            )}
                            <p className=''>
                                {file ? file.name : 'Select a file to upload'}
                            </p>
                        </div>
                    </div>
                    <Button
                        disabled={!file}
                        onClick={() => {
                            // TODO: REPLACE BY GALADRIEL VALIDATION
                            setIsValid(true)
                            form.setValue('game', file)
                        }}
                        className='text-base text-foreground transition duration-300 hover:text-white active:scale-90'
                    >
                        Validate
                    </Button>
                </div>
            </div>
            {isValid && (
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
            )}
        </div>
    )
}
