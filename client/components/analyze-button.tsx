"use client"

import { Button } from "@/components/ui/button"
import { useStockAnalysis } from "@/context/stock-analysis-context"
import { LineChart } from "lucide-react"

export function AnalyzeButton() {
  const { analyzeStocks, isAnalyzing } = useStockAnalysis()

  return (
    <Button onClick={analyzeStocks} disabled={isAnalyzing} size="lg" className="w-full">
      <LineChart className={`mr-2 h-5 w-5 ${isAnalyzing ? "animate-pulse" : ""}`} />
      {isAnalyzing ? "Analyzing Stocks..." : "Analyze Stocks"}
    </Button>
  )
}

