import { StockHeader } from "@/components/stocks/stock-header"
import { StockChart } from "@/components/stocks/stock-chart"
import { StockStats } from "@/components/stocks/stock-stats"
import { StockNews } from "@/components/stocks/stock-news"
import { StockAnalysis } from "@/components/stocks/stock-analysis"
import { StockRecommendation } from "@/components/stocks/stock-recommendation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StockPage({ params }: { params: { symbol: string } }) {
  const { symbol } = params

  return (
    <div className="space-y-6">
      <StockHeader symbol={symbol} />

      <StockChart symbol={symbol} />

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <StockStats symbol={symbol} />
        </TabsContent>
        <TabsContent value="analysis" className="mt-4">
          <StockAnalysis symbol={symbol} />
        </TabsContent>
        <TabsContent value="news" className="mt-4">
          <StockNews symbol={symbol} />
        </TabsContent>
        <TabsContent value="recommendations" className="mt-4">
          <StockRecommendation symbol={symbol} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

