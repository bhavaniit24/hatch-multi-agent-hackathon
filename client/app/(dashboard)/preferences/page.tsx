import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPreferencesForm } from "@/components/user-preferences-form"
import { AISettings } from "@/components/dashboard/ai-settings"

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Investment Preferences</h1>
      <p className="text-muted-foreground">
        Customize your investment criteria to receive personalized AI-powered stock recommendations
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <UserPreferencesForm />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How Your Preferences Affect Recommendations</CardTitle>
              <CardDescription>Understanding how the multi-agent AI system uses your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Our multi-agent AI system uses your preferences to customize the analysis process:
                </p>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Technical Analysis Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Uses your timeframe and risk tolerance to analyze price patterns, trends, and momentum indicators.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Fundamental Analysis Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Focuses on your selected performance criteria and evaluates companies based on financial health
                    metrics.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sector Specialist Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Provides industry-specific insights for your selected sectors and evaluates competitive positioning.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Risk Assessment Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Evaluates volatility and downside protection based on your risk tolerance and market cap
                    preferences.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Coordinator Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Combines all insights and weighs them according to your preferences to generate final
                    recommendations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <AISettings />
        </div>
      </div>
    </div>
  )
}

