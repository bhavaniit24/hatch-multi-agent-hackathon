"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Sliders } from "lucide-react"
import Link from "next/link"

export function AIRecommendations() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/preferences">
              <Sliders className="h-4 w-4" />
              <span className="sr-only">Customize Preferences</span>
            </Link>
          </Button>
        </div>
        <CardDescription>Personalized stock recommendations based on your preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline">1 Year Timeframe</Badge>
          <Badge variant="outline">Large Cap</Badge>
          <Badge variant="outline">Moderate Risk</Badge>
        </div>

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

