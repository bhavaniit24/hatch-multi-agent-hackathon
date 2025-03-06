"use client"

import { useState, useEffect } from "react"

export function useStockData(symbol: string) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // In a real app, fetch data from an API
    // For demo purposes, we'll simulate a loading state
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data based on symbol
        setData({
          symbol,
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
        })

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setIsLoading(false)
      }
    }

    fetchData()

    // Set up WebSocket or polling for real-time updates
    const intervalId = setInterval(() => {
      // In a real app, update data from WebSocket or API
    }, 10000) // Update every 10 seconds

    return () => clearInterval(intervalId)
  }, [symbol])

  return { data, isLoading, error }
}

