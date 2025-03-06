"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

export function AIRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
        <CardDescription>Personalized stock recommendations based on market analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{recommendation.symbol}</span>
                <Badge variant={recommendation.type === "Buy" ? "default" : "secondary"}>{recommendation.type}</Badge>
              </div>
              <span className="text-sm text-muted-foreground">{recommendation.confidence}% confidence</span>
            </div>
            <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
          </div>
        ))}
        <Button asChild className="w-full">
          <Link href="/recommendations">
            View All Recommendations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

const recommendations = [
  {
    symbol: "NVDA",
    type: "Buy",
    confidence: 92,
    reason: "Strong AI market growth and dominant position in GPU market",
  },
  {
    symbol: "MSFT",
    type: "Buy",
    confidence: 88,
    reason: "Cloud business expansion and AI integration across product lines",
  },
  {
    symbol: "GOOGL",
    type: "Hold",
    confidence: 75,
    reason: "Advertising revenue concerns balanced by AI advancements",
  },
]

