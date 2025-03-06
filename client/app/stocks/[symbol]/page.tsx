import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function StockDetailPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params
  const stock = getStockDetails(symbol)

  if (!stock) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to recommendations
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold">Stock Not Found</h1>
          <p className="mt-2 text-muted-foreground">We couldn't find details for the symbol {symbol}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to recommendations
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{symbol}</h1>
          <p className="text-lg text-muted-foreground">{stock.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
            <div className={`text-sm font-medium ${stock.change > 0 ? "text-positive" : "text-negative"}`}>
              {stock.change > 0 ? "+" : ""}
              {stock.change}%
            </div>
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link href={`https://finance.yahoo.com/quote/${symbol}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Yahoo Finance
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>AI-powered analysis of {symbol}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">AI Score</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {stock.aiScore}/100
              </Badge>
            </div>

            <div className="mb-4 h-2 w-full rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${stock.aiScore}%` }} />
            </div>

            <h3 className="mb-2 font-medium">Investment Thesis</h3>
            <p className="text-sm text-muted-foreground">{stock.reason}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recommendation</span>
                <Badge>Strong Buy</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Target Price (12m)</span>
                <span className="font-medium">${(stock.price * 1.15).toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <span className="font-medium">Moderate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Statistics</CardTitle>
            <CardDescription>Financial metrics for {symbol}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Market Cap</span>
                <span className="font-medium">{getMarketCap(stock)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">P/E Ratio</span>
                <span className="font-medium">{(Math.random() * 30 + 10).toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dividend Yield</span>
                <span className="font-medium">{(Math.random() * 3).toFixed(2)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">52 Week Range</span>
                <span className="font-medium">
                  ${(stock.price * 0.7).toFixed(2)} - ${(stock.price * 1.1).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sector</span>
                <span className="font-medium">{stock.sector}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Beta</span>
                <span className="font-medium">{(Math.random() * 1.5 + 0.5).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getStockDetails(symbol: string) {
  const stocks = [
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      price: 877.35,
      change: 3.56,
      aiScore: 96,
      sector: "Technology",
      reason: "Strong AI market growth and dominant position in GPU market",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 417.88,
      change: 0.78,
      aiScore: 94,
      sector: "Technology",
      reason: "Cloud business expansion and AI integration across product lines",
    },
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 173.57,
      change: 1.23,
      aiScore: 92,
      sector: "Technology",
      reason: "Strong ecosystem, consistent revenue growth, and robust cash flow",
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase & Co.",
      price: 198.47,
      change: -0.23,
      aiScore: 89,
      sector: "Financial",
      reason: "Strong financial position, diversified revenue streams, and dividend growth",
    },
    {
      symbol: "UNH",
      name: "UnitedHealth Group Inc.",
      price: 527.33,
      change: 1.45,
      aiScore: 87,
      sector: "Healthcare",
      reason: "Market leader in healthcare services with consistent earnings growth",
    },
  ]

  return stocks.find((stock) => stock.symbol === symbol)
}

function getMarketCap(stock: any) {
  const price = stock.price

  if (stock.symbol === "AAPL" || stock.symbol === "MSFT" || stock.symbol === "NVDA") {
    return `$${((price * 1000000000) / 100).toFixed(2)}T`
  } else if (stock.symbol === "JPM" || stock.symbol === "UNH") {
    return `$${((price * 1000000000) / 1000).toFixed(2)}B`
  } else {
    return `$${((price * 1000000000) / 2000).toFixed(2)}B`
  }
}

