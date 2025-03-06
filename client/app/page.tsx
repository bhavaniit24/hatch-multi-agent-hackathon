import { Header } from "@/components/header"
import { AIModelSettings } from "@/components/ai-model-settings"
import { InvestmentPreferences } from "@/components/investment-preferences"
import { TopStockRecommendations } from "@/components/top-stock-recommendations"
import { ModeToggle } from "@/components/mode-toggle"
import { AnalyzeButton } from "@/components/analyze-button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">AI Stock Recommendations</h1>
          <ModeToggle />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AIModelSettings />
          <InvestmentPreferences />
        </div>

        <div className="my-6">
          <AnalyzeButton />
        </div>

        <div>
          <TopStockRecommendations />
        </div>
      </main>
    </div>
  )
}

