"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useStockData } from "@/hooks/use-stock-data"

export function StockStats({ symbol }: { symbol: string }) {
  const { data, isLoading } = useStockData(symbol)

  // Mock data for demonstration
  const stats = {
    marketCap: "$2.7T",
    peRatio: "28.5",
    dividend: "0.92%",
    volume: "52.3M",
    avgVolume: "64.8M",
    high52w: "$198.23",
    low52w: "$124.17",
    open: "$172.30",
    previousClose: "$171.21",
    beta: "1.28",
    eps: "$6.14",
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Trading Information</h3>
          <div className="space-y-4">
            <StatItem label="Previous Close" value={stats.previousClose} />
            <StatItem label="Open" value={stats.open} />
            <StatItem label="Day's Range" value="$170.92 - $174.30" />
            <StatItem label="52 Week Range" value={`${stats.low52w} - ${stats.high52w}`} />
            <StatItem label="Volume" value={stats.volume} />
            <StatItem label="Avg. Volume" value={stats.avgVolume} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Key Statistics</h3>
          <div className="space-y-4">
            <StatItem label="Market Cap" value={stats.marketCap} />
            <StatItem label="P/E Ratio" value={stats.peRatio} />
            <StatItem label="Dividend Yield" value={stats.dividend} />
            <StatItem label="Beta" value={stats.beta} />
            <StatItem label="EPS (TTM)" value={stats.eps} />
            <StatItem label="Next Earnings Date" value="Jul 25, 2023" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

