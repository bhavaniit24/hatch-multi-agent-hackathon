"use client"

import { useState, useEffect } from "react"

export function useTopStocks({
  sortBy = "performance",
  filter = "all",
}: {
  sortBy?: string
  filter?: string
}) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // In a real app, fetch data from an API with sortBy and filter params
    // For demo purposes, we'll simulate a loading state
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data - in a real app, this would come from the API
        // and would be filtered/sorted based on the parameters
        setData([
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
          // More stocks would be here
        ])

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setIsLoading(false)
      }
    }

    fetchData()
  }, [sortBy, filter])

  return { data, isLoading, error }
}

