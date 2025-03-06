"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModelSelector } from "@/components/model-selector"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import { useStockAnalysis } from "@/context/stock-analysis-context"

export function AIModelSettings() {
  const { aiSettings, setAISettings } = useStockAnalysis()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Model Settings
        </CardTitle>
        <CardDescription>Configure the AI model used for stock analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="model-selector">AI Model</Label>
          <ModelSelector value={aiSettings.model} onModelChange={(model) => setAISettings({ ...aiSettings, model })} />
          <p className="mt-1 text-xs text-muted-foreground">
            Select the AI model to use for analysis. More powerful models may provide better insights.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature">Temperature: {aiSettings.temperature}</Label>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.1}
            value={[aiSettings.temperature]}
            onValueChange={(value) => setAISettings({ ...aiSettings, temperature: value[0] })}
          />
          <p className="text-xs text-muted-foreground">
            Lower values produce more consistent recommendations. Higher values produce more diverse recommendations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

