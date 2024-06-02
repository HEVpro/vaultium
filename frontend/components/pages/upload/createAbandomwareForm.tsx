import { toast } from '@/components/ui/use-toast'
import { z } from 'zod'
import useValidateForm, { FormSchema } from './useValidateForm'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Abandonware, Game, OptionType } from '@/lib/types'
import { usePrivy } from '@privy-io/react-auth'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useEffect } from 'react'
import Web3 from 'web3'
import { contractAddress, gameCasterArray, genres } from '@/lib/constants'
import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { MultiSelect } from '@/components/multiselect'

export default function CreateAbandomware({
    setResultGame,
}: {
    setResultGame: (value: Abandonware) => void
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
        confirmations: 2,
        pollingInterval: 100,
    })
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (authenticated) {
            writeContract({
                abi: vaultiumContract.abi,
                address: contractAddress,
                functionName: 'createAbandonware',
                args: [
                    data.name,
                    data.description,
                    data.publisher,
                    data.year,
                    data.country,
                    data. genres.map((a) => a.value),
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

            // ALERT: if cannot be decoded, check gameCasterArray
            const decodedParameters = web3.eth.abi.decodeParameters(
                gameCasterArray,
                hashData
            )
            const gameData: Abandonware = {
                gameHash: String(decodedParameters.gameHash),
                name: decodedParameters.name as unknown as string,
                genres: decodedParameters.genres as number[],
                publisher: decodedParameters.publisher as unknown as string,
                year: Number(decodedParameters.year),
                country: decodedParameters.country as unknown as string,
                // TODO: IF EXISTS IT WILL RETURN THAT THE IPFSCID??
                description: '',
                ipfsCid: '',
            }

            setResultGame(gameData)
            form.reset()
        }
    }, [data])

    type Field = {
        name: keyof z.infer<typeof FormSchema>
        label: string
        placeholder: string
        type: 'text' | 'number' | 'textarea' | 'select'
        className: string
        options?: { label: string; value: number }[]
    }
    const fields: Field[] = [
        {
            name: 'name',
            label: 'Name',
            placeholder: 'Enter name',
            type: 'text',
            className: 'col-span-2',
        },
        {
            name: 'description',
            label: 'Description',
            placeholder: 'Enter description',
            type: 'textarea',
            className: 'col-span-2',
        },
        {
            name: 'publisher',
            label: 'Publisher',
            placeholder: 'Enter publisher',
            type: 'text',
            className: 'col-span-2',
        },
        {
            name: 'year',
            label: 'Year',
            placeholder: 'Enter year',
            type: 'number',
            className: 'col-span-1',
        },
        {
            name: 'country',
            label: 'Country',
            placeholder: 'Enter a country',
            type: 'text',
            className: 'col-span-1',
        },
        {
            name: 'genres',
            label: 'Genres',
            placeholder: 'Select a genre',
            type: 'select',
            className: 'col-span-2',
            options: genres?.map((genre, index) => ({
                label: genre,
                value: index,
            })),
        },
    ]

    const inputSelector = (
        type: string,
        placeholder: string,
        field: any,
        options: OptionType[]
    ) => {
        switch (type) {
            case 'number':
                return (
                    <Input
                        placeholder={field.placeholder}
                        value={field.value}
                        type={type}
                        className='bg-transparent text-primary'
                        onChange={(e) => {
                            field.onChange(e.target.valueAsNumber)
                        }}
                        step={1}
                    />
                )
            case 'text':
                return (
                    <Input
                        placeholder={field.placeholder}
                        value={field.value}
                        type={type}
                        className='bg-transparent text-primary'
                        onChange={(e) => {
                            field.onChange(e.target.value)
                        }}
                    />
                )
            case 'select':
                if (!options) return null
                return (
                    <MultiSelect
                        selected={
                            field.value
                                ? // @ts-ignore
                                  field.value.map((item) => ({
                                      label: item.label,
                                      value: item.value,
                                  }))
                                : []
                        }
                        options={options as OptionType[]}
                        className='w-full bg-transparent text-primary'
                        {...field}
                    />
                )
            case 'textarea':
                return (
                    <Textarea
                        placeholder={placeholder}
                        className='bg-transparent text-primary'
                        rows={6}
                        {...field}
                    />
                )
        }
    }

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
                                    {inputSelector(
                                        inputField.type,
                                        inputField.placeholder,
                                        field,
                                        inputField.options as OptionType[]
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                {/* TODO: CREATE THE BUTTON MESSAGE DEPENDING STATE: CREATE + PENDING SIGNATURE + VALIDATING */}
                <Button
                    disabled={isConfirming}
                    className='col-span-full mt-8 text-base text-foreground transition duration-300 hover:text-white active:scale-90'
                >
                    {isPending || isConfirming ? 'Validating...' : 'Create'}
                </Button>
            </form>
        </Form>
    )
}
