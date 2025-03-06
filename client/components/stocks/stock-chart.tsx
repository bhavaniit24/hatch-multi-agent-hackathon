"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockPriceChart } from "@/components/charts/stock-price-chart"

export function StockChart({ symbol }: { symbol: string }) {
  const [timeRange, setTimeRange] = useState("1D")
  const [chartType, setChartType] = useState("line")

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs defaultValue="1D" onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
              <TabsTrigger value="5Y">5Y</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
            >
              Line
            </Button>
            <Button
              variant={chartType === "candle" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("candle")}
            >
              Candlestick
            </Button>
          </div>
        </div>

        <div className="h-[400px]">
          <StockPriceChart symbol={symbol} timeRange={timeRange} chartType={chartType} />
        </div>
      </CardContent>
    </Card>
  )
}

