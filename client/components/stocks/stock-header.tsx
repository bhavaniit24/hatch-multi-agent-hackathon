"use client"

import { useState } from "react"
import { Bell, BellOff, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useStockData } from "@/hooks/use-stock-data"

export function StockHeader({ symbol }: { symbol: string }) {
  const { data, isLoading } = useStockData(symbol)
  const [isWatchlisted, setIsWatchlisted] = useState(false)
  const [isNotifying, setIsNotifying] = useState(false)
  const { toast } = useToast()

  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted)
    toast({
      title: isWatchlisted ? "Removed from watchlist" : "Added to watchlist",
      description: `${symbol} has been ${isWatchlisted ? "removed from" : "added to"} your watchlist.`,
    })
  }

  const toggleNotifications = () => {
    setIsNotifying(!isNotifying)
    toast({
      title: isNotifying ? "Notifications disabled" : "Notifications enabled",
      description: `You will ${isNotifying ? "no longer" : "now"} receive notifications for ${symbol}.`,
    })
  }

  // Mock data for demonstration
  const stockData = {
    name:
      symbol === "AAPL"
        ? "Apple Inc."
        : symbol === "MSFT"
          ? "Microsoft Corporation"
          : symbol === "GOOGL"
            ? "Alphabet Inc."
            : symbol === "AMZN"
              ? "Amazon.com Inc."
              : symbol === "NVDA"
                ? "NVIDIA Corporation"
                : `${symbol} Inc.`,
    price: 173.57,
    change: 2.13,
    changePercent: 1.24,
    isPositive: true,
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold">{symbol}</h1>
        <p className="text-lg text-muted-foreground">{stockData.name}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-4 text-right">
          <div className="text-2xl font-bold">${stockData.price.toFixed(2)}</div>
          <div className={`text-sm font-medium ${stockData.isPositive ? "text-positive" : "text-negative"}`}>
            {stockData.isPositive ? "+" : ""}
            {stockData.change.toFixed(2)} ({stockData.isPositive ? "+" : ""}
            {stockData.changePercent.toFixed(2)}%)
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleWatchlist}
          className={isWatchlisted ? "text-yellow-500" : ""}
        >
          <Star className="h-4 w-4" fill={isWatchlisted ? "currentColor" : "none"} />
          <span className="sr-only">{isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}</span>
        </Button>

        <Button variant="outline" size="icon" onClick={toggleNotifications}>
          {isNotifying ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          <span className="sr-only">{isNotifying ? "Disable notifications" : "Enable notifications"}</span>
        </Button>
      </div>
    </div>
  )
}

