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
    useReadContract,
    useTransactionReceipt,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi'
import { type UseReadContractParameters } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { mockVaultiumContract } from '@/lib/wagmi/mockVaultiumContract'
import { useEffect, useState } from 'react'
import { useTransaction } from 'wagmi'
import { getTransaction } from '@wagmi/core'
import { wagmiConfig } from '@/lib/wagmi/config'
import { fromHex } from 'viem'
import { parseTransaction } from 'viem'
import { decodeFunctionResult } from 'viem'
import { mock } from 'node:test'
import Web3 from 'web3'
import { decodeFunctionData } from 'viem'

export default function ValidateForm({
    setSearchedGames,
}: {
    setSearchedGames: (value: Game[]) => void
}) {
    const { form } = useValidateForm()
    const { authenticated } = usePrivy()

    const { data: hash, isPending, writeContract } = useWriteContract()

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (authenticated) {
            writeContract({
                abi: mockVaultiumContract.abi,
                address: '0xE8B07e948168108C8f0BE3bfD448D4a9A9B56596',
                functionName: 'searchAbandonware',
                args: [
                    data.name,
                    data.description,
                    data.publisher,
                    0,
                    data.year,
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
    const {
        data,
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
    })

    // 1. isSuccess get the transaction result
    // 2. decodeFunctionData inside the useEffect
    // 3. setSearchedGames

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

    // const result = useTransaction({
    //     hash: '0xaedd62ead5dc194edcc03d6b31b9d49b1f2e1cbe56e4ae04a57ca79b64b8e257',
    //   }) 
      
      const result = useTransaction({
        hash: '0x9776dc0a342ef93fe5cec3ee31c81fe70e9795e25b91d83299ec649a53d059ad',
      })

      useEffect(() => {
        if(result){
            console.log('result', result)
            const { args } = decodeFunctionData({
                abi: mockVaultiumContract.abi,
                data: result?.data?.input
        })
        console.log('args', args)

    }
      }, [result])

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
                        form.formState.isSubmitting || !form.formState.isDirty
                    }
                    className='col-span-full text-base text-foreground transition duration-300 hover:text-white active:scale-90'
                >
                    {isPending ? 'Validating...' : 'Validate'}
                </Button>
            </form>
        </Form>
    )
}
