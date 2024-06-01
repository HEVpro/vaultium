import * as React from 'react'

import { Check, X, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { OptionType } from '@/lib/types'

interface MultiSelectProps {
    options: OptionType[]
    selected: OptionType[]
    onChange: React.Dispatch<React.SetStateAction<OptionType[]>>
    className?: string
}

function MultiSelect({
    options,
    selected,
    onChange,
    className,
    ...props
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i.value !== item))
    }


    return (
        <Popover open={open} onOpenChange={setOpen} {...props}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    size={selected.length > 1 ? 'sm' : 'default'}
                    aria-expanded={open}
                    className={`w-full justify-between bg-transparent ${
                        selected.length > 1 ? 'h-full' : 'h-10'
                    }`}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex gap-1 flex-wrap">
                        {selected.map((item) => (
                            <Badge
                                variant="secondary"
                                key={item.value}
                                className="mr-1 bg-gradient text-foreground"
                                onClick={() => handleUnselect(item.value)}
                            >
                                {item.label}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUnselect(item.value)
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={() => handleUnselect(item.value)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 stroke-primary" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="PopoverContent p-0">
                <Command className={className}>
                    <CommandInput placeholder="Buscar ..." className='' />
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto w-full no-scrollbar">
                        <CommandList>
                            {options &&
                                options.length > 0 &&
                                options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            onChange(
                                                selected.some(
                                                    (item) =>
                                                        item.value ===
                                                        option.value
                                                )
                                                    ? selected.filter(
                                                          (item) =>
                                                              item.value !==
                                                              option.value
                                                      )
                                                    : [...selected, option]
                                            )
                                            setOpen(true)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selected.some(
                                                    (item) =>
                                                        item.value ===
                                                        option.value
                                                )
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export { MultiSelect }
