import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const FormSchema = z.object({
    year: z.coerce.number({
        required_error: 'Please enter a year',
    }),
    platform: z.string({
        required_error: 'Please enter a platform',
    }),
    releasedIn: z.string({
        required_error: 'Please enter a release location',
    }),
    genre: z.string({
        required_error: 'Please enter a genre',
    }),
    theme: z.string({
        required_error: 'Please enter a theme',
    }),
    publisher: z.string({
        required_error: 'Please enter a publisher',
    }),
    game: z.instanceof(File).nullable(),
})

export default function useCustomForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: 'onSubmit',
        resolver: zodResolver(FormSchema),
        defaultValues: {
            year: new Date().getFullYear(),
            platform: '',
            releasedIn: '',
            genre: '',
            theme: '',
            publisher: '',
            game: null,
        },
    })

    return { form }
}