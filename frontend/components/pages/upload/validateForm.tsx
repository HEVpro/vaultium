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

export default function ValidateForm({
    setSearchedGames,
}: {
    setSearchedGames: (value: Game[]) => void
}) {
    const { form } = useValidateForm()

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const response = await validateGame(data)
        // TODO: IMPROVE LOGIC IF VALIDATION IS WRONG
        if (response.data) {
            setSearchedGames(response.data)
            // TODO: UNCOMMENT WHEN ARE READY THE COMPONENT
            // form.reset()
        }
    }
    type Field = {
        name: keyof z.infer<typeof FormSchema>
        label: string
        placeholder: string
        type: 'text' | 'number' | 'text-area'
        className: string
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
                        form.formState.isSubmitting || !form.formState.isDirty
                    }
                    className='col-span-full text-base text-foreground transition duration-300 hover:text-white active:scale-90'
                >
                    Validate
                </Button>
            </form>
        </Form>
    )
}
