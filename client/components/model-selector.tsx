"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { AI_MODELS } from "@/lib/ai-models"

type ModelSelectorProps = {
  value?: string
  onModelChange: (model: string) => void
}

export function ModelSelector({ value = "gpt-4o", onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)

  // Update internal state when prop changes
  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  // Group models by publisher
  const groupedModels = AI_MODELS.reduce(
    (acc, model) => {
      if (!acc[model.publisher]) {
        acc[model.publisher] = []
      }
      acc[model.publisher].push(model)
      return acc
    },
    {} as Record<string, typeof AI_MODELS>,
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedValue ? AI_MODELS.find((model) => model.name === selectedValue)?.friendly_name : "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            {Object.entries(groupedModels).map(([publisher, models]) => (
              <CommandGroup key={publisher} heading={publisher}>
                {models.map((model) => (
                  <CommandItem
                    key={model.name}
                    value={model.name}
                    onSelect={(currentValue) => {
                      setSelectedValue(currentValue)
                      onModelChange(currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedValue === model.name ? "opacity-100" : "opacity-0")} />
                    {model.friendly_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

