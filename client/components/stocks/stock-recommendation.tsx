"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function StockRecommendation({ symbol }: { symbol: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">AI Investment Recommendation</h3>
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Strong Buy
            </Badge>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence</span>
              <span className="text-sm font-medium">92%</span>
            </div>
            <Progress value={92} className="h-2 w-full" />
          </div>
          <p className="text-sm text-muted-foreground">
            Based on our multi-agent analysis system, we strongly recommend buying this stock. The company shows
            excellent fundamentals, positive technical indicators, and strong market sentiment. Our AI models predict
            significant growth potential over the next 6-12 months.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Target Price (12m)</div>
              <div className="text-lg font-semibold">$215.00</div>
              <div className="text-xs text-positive">+24.3% upside</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Risk Level</div>
              <div className="text-lg font-semibold">Moderate</div>
              <div className="text-xs text-muted-foreground">Volatility: 1.28β</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Similar Stocks</h3>
          <div className="space-y-4">
            {similarStocks.map((stock, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div>${stock.price}</div>
                    <div className={stock.change > 0 ? "text-positive" : "text-negative"}>
                      {stock.change > 0 ? "+" : ""}
                      {stock.change}%
                    </div>
                  </div>
                </div>
                {index < similarStocks.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
          <Button asChild className="mt-4 w-full">
            <Link href="/screener">
              Find More Similar Stocks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const similarStocks = [
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 417.88,
    change: 0.78,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 165.27,
    change: -0.45,
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 474.99,
    change: 1.23,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.15,
    change: 2.34,
  },
]

