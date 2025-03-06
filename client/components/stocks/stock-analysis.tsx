"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StockAnalysis({ symbol }: { symbol: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">AI Analysis Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Score</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Strong Buy
              </Badge>
            </div>
            <Progress value={85} className="h-2 w-full" />
            <p className="text-sm text-muted-foreground">
              Our multi-agent AI system has analyzed this stock across technical, fundamental, and sentiment dimensions,
              resulting in a strong buy recommendation. The company shows robust financial health, positive technical
              indicators, and favorable market sentiment.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="technical">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="fundamental">Fundamental</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        </TabsList>
        <TabsContent value="technical" className="mt-4 space-y-4">
          <AnalysisCard
            title="Technical Analysis"
            score={82}
            recommendation="Buy"
            points={[
              "Moving averages show strong upward trend",
              "RSI at 62, indicating momentum without being overbought",
              "MACD shows bullish crossover",
              "Support levels holding well at $165",
              "Volume increasing on up days, decreasing on down days",
            ]}
          />
        </TabsContent>
        <TabsContent value="fundamental" className="mt-4 space-y-4">
          <AnalysisCard
            title="Fundamental Analysis"
            score={88}
            recommendation="Strong Buy"
            points={[
              "Strong revenue growth at 15% year-over-year",
              "Healthy profit margins at 25%",
              "Low debt-to-equity ratio of 0.42",
              "Consistent dividend growth for 10 consecutive years",
              "Significant R&D investment in emerging technologies",
            ]}
          />
        </TabsContent>
        <TabsContent value="sentiment" className="mt-4 space-y-4">
          <AnalysisCard
            title="Sentiment Analysis"
            score={78}
            recommendation="Buy"
            points={[
              "Positive mentions in financial news increasing by 23%",
              "Social media sentiment trending positive",
              "Institutional ownership increased last quarter",
              "Analyst consensus shows 18 buys, 5 holds, 1 sell",
              "Recent product announcements well-received by market",
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AnalysisCard({
  title,
  score,
  recommendation,
  points,
}: {
  title: string
  score: number
  recommendation: string
  points: string[]
}) {
  const badgeVariant = "outline"
  let badgeClass = ""

  if (recommendation === "Strong Buy") {
    badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  } else if (recommendation === "Buy") {
    badgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
  } else if (recommendation === "Hold") {
    badgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
  } else if (recommendation === "Sell") {
    badgeClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <Badge variant={badgeVariant} className={badgeClass}>
            {recommendation}
          </Badge>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Score</span>
            <span className="text-sm font-medium">{score}/100</span>
          </div>
          <Progress value={score} className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Key Points:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {points.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

