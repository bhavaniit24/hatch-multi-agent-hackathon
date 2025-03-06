"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentNews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          Market News
        </CardTitle>
        <CardDescription>Latest news affecting the market</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {newsItems.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getSentimentVariant(item.sentiment)}>{item.sentiment}</Badge>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.summary}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function getSentimentVariant(sentiment: string) {
  switch (sentiment) {
    case "Positive":
      return "default"
    case "Negative":
      return "destructive"
    default:
      return "secondary"
  }
}

const newsItems = [
  {
    title: "Fed Signals Potential Rate Cut in September",
    summary:
      "Federal Reserve officials indicated they may be ready to cut interest rates in September if inflation continues to cool.",
    time: "2 hours ago",
    sentiment: "Positive",
  },
  {
    title: "Tech Earnings Beat Expectations",
    summary: "Major tech companies reported stronger-than-expected earnings, driven by AI and cloud services growth.",
    time: "4 hours ago",
    sentiment: "Positive",
  },
  {
    title: "Oil Prices Rise Amid Middle East Tensions",
    summary: "Crude oil prices increased by 3% as geopolitical tensions in the Middle East raised supply concerns.",
    time: "6 hours ago",
    sentiment: "Negative",
  },
  {
    title: "Retail Sales Data Shows Consumer Spending Slowdown",
    summary:
      "Latest retail sales figures indicate a slowdown in consumer spending, raising concerns about economic growth.",
    time: "8 hours ago",
    sentiment: "Negative",
  },
  {
    title: "New AI Regulations Proposed by EU Commission",
    summary:
      "The European Commission proposed new regulations for AI development and deployment, potentially affecting tech companies.",
    time: "10 hours ago",
    sentiment: "Neutral",
  },
]

