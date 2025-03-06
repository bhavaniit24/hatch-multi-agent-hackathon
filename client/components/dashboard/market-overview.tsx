"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketIndexChart } from "@/components/charts/market-index-chart"
import { MarketSectors } from "@/components/charts/market-sectors"
import { useMarketData } from "@/hooks/use-market-data"

export function MarketOverview() {
  const { data, isLoading } = useMarketData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>Real-time market indices and sector performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="indices">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="indices">Major Indices</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
          </TabsList>
          <TabsContent value="indices" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <IndexCard name="S&P 500" value="4,927.11" change="+0.87%" isPositive={true} isLoading={isLoading} />
              <IndexCard name="Dow Jones" value="38,239.98" change="+0.56%" isPositive={true} isLoading={isLoading} />
              <IndexCard name="Nasdaq" value="15,927.90" change="-0.12%" isPositive={false} isLoading={isLoading} />
            </div>
            <MarketIndexChart />
          </TabsContent>
          <TabsContent value="sectors">
            <MarketSectors />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function IndexCard({
  name,
  value,
  change,
  isPositive,
  isLoading,
}: {
  name: string
  value: string
  change: string
  isPositive: boolean
  isLoading: boolean
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-sm font-medium text-muted-foreground">{name}</div>
      <div className="mt-1 flex items-baseline justify-between">
        <div className="text-2xl font-semibold">{value}</div>
        <div className={`text-sm font-medium ${isPositive ? "text-positive" : "text-negative"}`}>{change}</div>
      </div>
    </div>
  )
}

