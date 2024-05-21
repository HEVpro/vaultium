import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const FormSchema = z.object({
    name: z.string().optional(),
    publisher: z.string().optional(),
    year: z.number().optional(),
    description: z.string().optional(),
});

export default function useCompetitionForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: 'onSubmit',
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            publisher: '',
            year: new Date().getFullYear(),
            description: '',
        },
    })
    return { form }
}
