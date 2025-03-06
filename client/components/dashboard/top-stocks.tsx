"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTopStocks } from "@/hooks/use-top-stocks"

export function TopStocks() {
  const [sortBy, setSortBy] = useState<string>("performance")
  const [filter, setFilter] = useState<string>("all")
  const { data, isLoading } = useTopStocks({ sortBy, filter })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Top Investable Stocks</CardTitle>
            <CardDescription>AI-analyzed stocks with the highest investment potential</CardDescription>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {filterLabels[filter]} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter("all")}>All Sectors</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("tech")}>Technology</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("finance")}>Financial</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("healthcare")}>Healthcare</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("consumer")}>Consumer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("energy")}>Energy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {sortLabels[sortBy]} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("performance")}>Performance</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("marketCap")}>Market Cap</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("aiScore")}>AI Score</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("volatility")}>Volatility</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStocks.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>${stock.price}</TableCell>
                  <TableCell className={stock.change > 0 ? "text-positive" : "text-negative"}>
                    {stock.change > 0 ? "+" : ""}
                    {stock.change}%
                  </TableCell>
                  <TableCell>{stock.marketCap}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${stock.aiScore}%` }} />
                      </div>
                      <span className="text-xs">{stock.aiScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>{stock.sector}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/stocks/${stock.symbol}`}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View {stock.symbol}</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

const filterLabels: Record<string, string> = {
  all: "All Sectors",
  tech: "Technology",
  finance: "Financial",
  healthcare: "Healthcare",
  consumer: "Consumer",
  energy: "Energy",
}

const sortLabels: Record<string, string> = {
  performance: "Performance",
  marketCap: "Market Cap",
  aiScore: "AI Score",
  volatility: "Volatility",
}

const mockStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 173.57,
    change: 1.23,
    marketCap: "2.7T",
    aiScore: 92,
    sector: "Technology",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 417.88,
    change: 0.78,
    marketCap: "3.1T",
    aiScore: 94,
    sector: "Technology",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 165.27,
    change: -0.45,
    marketCap: "2.1T",
    aiScore: 88,
    sector: "Technology",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.15,
    change: 2.34,
    marketCap: "1.9T",
    aiScore: 90,
    sector: "Consumer",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 877.35,
    change: 3.56,
    marketCap: "2.2T",
    aiScore: 96,
    sector: "Technology",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 198.47,
    change: -0.23,
    marketCap: "571.2B",
    aiScore: 85,
    sector: "Financial",
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 147.52,
    change: 0.12,
    marketCap: "355.8B",
    aiScore: 82,
    sector: "Healthcare",
  },
]

