"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function StockNews({ symbol }: { symbol: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-medium">Recent News</h3>
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <div key={index}>
              <div className="flex items-center gap-2">
                <Badge variant={getSentimentVariant(item.sentiment)}>{item.sentiment}</Badge>
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
              <h4 className="mt-2 font-medium">{item.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.source}</span>
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  Read more
                </a>
              </div>
              {index < newsItems.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
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
    title: "Company Announces Record Quarterly Earnings",
    summary:
      "The company reported earnings that exceeded analyst expectations, with revenue growth of 15% year-over-year.",
    date: "2 hours ago",
    source: "Financial Times",
    sentiment: "Positive",
  },
  {
    title: "New Product Launch Set for Next Month",
    summary:
      "The company announced plans to launch a new flagship product next month, which analysts expect to drive significant revenue growth.",
    date: "1 day ago",
    source: "Bloomberg",
    sentiment: "Positive",
  },
  {
    title: "Regulatory Investigation Announced",
    summary:
      "Regulators have announced an investigation into the company's business practices, which could result in fines or operational changes.",
    date: "2 days ago",
    source: "Wall Street Journal",
    sentiment: "Negative",
  },
  {
    title: "Expansion into New Markets",
    summary: "The company announced plans to expand into emerging markets, with a focus on Asia and Latin America.",
    date: "3 days ago",
    source: "Reuters",
    sentiment: "Neutral",
  },
]

