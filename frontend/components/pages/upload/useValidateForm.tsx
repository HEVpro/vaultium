import { optionSchemaNumber } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const thisYear = new Date().getFullYear()
export const FormSchema = z.object({
    name: z.string(),
    description: z.string(),
    publisher: z.string(),
    year: z.coerce
        .number()
        .min(1950, { message: 'The year should be greater than 1950' })
        .max(thisYear, { message: `The year should be less than ${thisYear}` }),
    country: z.string(),
    genres: z.array(optionSchemaNumber),
})

export default function useCompetitionForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: 'onSubmit',
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            publisher: '',
            year: new Date().getFullYear(),
            description: '',
            country: '',
            genres: [],
        },
    })
    return { form }
}
