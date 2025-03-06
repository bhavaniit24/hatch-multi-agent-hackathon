"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function StockSearch() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSelect = (symbol: string) => {
    setOpen(false)
    router.push(`/stocks/${symbol}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Search</CardTitle>
        <CardDescription>Find stocks by symbol or company name</CardDescription>
      </CardHeader>
      <CardContent>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={() => setOpen(true)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start" sideOffset={5}>
            <Command>
              <CommandInput placeholder="Search stocks..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Popular Stocks">
                  {popularStocks.map((stock) => (
                    <CommandItem key={stock.symbol} value={stock.symbol} onSelect={handleSelect}>
                      <div className="flex items-center">
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="ml-2 text-muted-foreground">{stock.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium">Popular Searches</h4>
          <div className="flex flex-wrap gap-2">
            {popularStocks.slice(0, 5).map((stock) => (
              <Button
                key={stock.symbol}
                variant="outline"
                size="sm"
                onClick={() => router.push(`/stocks/${stock.symbol}`)}
              >
                {stock.symbol}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
]

