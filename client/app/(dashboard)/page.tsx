import { MarketOverview } from "@/components/dashboard/market-overview"
import { TopStocks } from "@/components/dashboard/top-stocks"
import { StockSearch } from "@/components/dashboard/stock-search"
import { RecentNews } from "@/components/dashboard/recent-news"
import { AIRecommendations } from "@/components/dashboard/ai-recommendations"
import { MarketSentiment } from "@/components/dashboard/market-sentiment"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <h1 className="mb-4 text-3xl font-bold tracking-tight">Dashboard</h1>
          <MarketOverview />
        </div>
        <div className="w-full md:w-80">
          <StockSearch />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MarketSentiment />
        <AIRecommendations />
        <RecentNews />
      </div>

      <TopStocks />
    </div>
  )
}

