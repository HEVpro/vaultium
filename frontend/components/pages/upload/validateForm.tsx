import { toast } from '@/components/ui/use-toast'
import { z } from 'zod'
import useValidateForm, { FormSchema } from './useValidateForm'
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
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Game } from '@/lib/types'
import { validateGame } from '@/lib/api'
import { usePrivy } from '@privy-io/react-auth'
import {
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { mockVaultiumContract } from '@/lib/wagmi/mockVaultiumContract'
import { useEffect, useState } from 'react'
import { useTransaction } from 'wagmi'
import { wagmiConfig } from '@/lib/wagmi/config'
import { fromHex } from 'viem'
import { parseTransaction } from 'viem'
import { decodeFunctionResult } from 'viem'
import { mock } from 'node:test'
import Web3 from 'web3'
import { decodeFunctionData } from 'viem'
import { decodeAbiParameters, parseAbiParameters } from 'viem'
import { gameCasterArray } from '@/lib/constants'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'


export default function ValidateForm({
    setSearchedGames,
}: {
    setSearchedGames: (value: Game) => void
}) {
    const { form } = useValidateForm()
    const { authenticated } = usePrivy()
    const web3 = new Web3()

    const { data: hash, isPending, writeContract } = useWriteContract()

    const {
        data,
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (authenticated) {
            writeContract({
                abi: vaultiumContract.abi,
                address: '0x7abf514378ef5f808d70f5dc6b5b8219f156ad48',
                functionName: 'createAbandonware',
                args: [
                    data.name,
                    data.description,
                    data.publisher,
                    data.year,
                    data.country,
                    data.genres
                ],
                chainId: sepolia.id,
            })
        } else {
            toast({
                title: 'Authentication required',
                description: 'Please login to validate a game',
                duration: 2500,
            })
        }
    }

    useEffect(() => {
        if (data && !isConfirming && isConfirmed) {
            const hashData = data.logs[0].data

            console.log('hashData', hashData)

            const decodedParameters = web3.eth.abi.decodeParameters(gameCasterArray, hashData);
            const gameData: Game = 
                {
                    gameHash: String(decodedParameters.gameHash).substring(2).toUpperCase(),
                    name: decodedParameters.name as unknown as string,
                    genre: Number(decodedParameters.genre),
                    publisher: decodedParameters.publisher as unknown as string,
                    year: Number(decodedParameters.year),
                }
            
            setSearchedGames(gameData)
            form.reset()
            console.log('gameData', gameData)

        }
    }, [data])


    type Field = {
        name: keyof z.infer<typeof FormSchema>
        label: string
        placeholder: string
        type: 'text' | 'number' | 'text-area'
        className: string
    }
    // TODO: ADD SELECT TO GENRE
    const fields: Field[] = [
        {
            name: 'name',
            label: 'Name',
            placeholder: 'Enter name',
            type: 'text',
            className: 'col-span-2',
        },
        {
            name: 'publisher',
            label: 'Publisher',
            placeholder: 'Enter publisher',
            type: 'text',
            className: 'col-span-1',
        },
        {
            name: 'year',
            label: 'Year',
            placeholder: 'Enter year',
            type: 'number',
            className: 'col-span-1',
        },
        {
            name: 'description',
            label: 'Description',
            placeholder: 'Enter description',
            type: 'text-area',
            className: 'col-span-2',
        },
    ]


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='grid w-full grid-cols-2 gap-2'
            >
                {fields.map((inputField) => (
                    <FormField
                        key={inputField.name}
                        control={form.control}
                        name={inputField.name}
                        render={({ field }) => (
                            <FormItem className={cn(inputField.className)}>
                                <FormLabel>{inputField.label}</FormLabel>
                                <FormControl>
                                    {inputField.type === 'text-area' ? (
                                        <>
                                            <Textarea
                                                {...field}
                                                placeholder='Type your message here.'
                                                className='bg-transparent text-primary'
                                            />
                                            <FormDescription>
                                                {
                                                    "If you don't remember the name, you can write a description!"
                                                }
                                            </FormDescription>
                                        </>
                                    ) : (
                                        <Input
                                            placeholder={inputField.placeholder}
                                            type={inputField.type}
                                            className='bg-transparent text-primary'
                                            {...field}
                                        />
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <Button
                    disabled={
                        isConfirming
                    }
                    className='col-span-full text-base text-foreground transition duration-300 hover:text-white active:scale-90'
                >
                    {isConfirming ? 'Validating...' : 'Validate'}
                </Button>
            </form>
        </Form>
    )
}
