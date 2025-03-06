"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModelSelector } from "@/components/model-selector"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles } from "lucide-react"

export function AISettings() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [temperature, setTemperature] = useState(0.7)
  const [enableRealTimeAnalysis, setEnableRealTimeAnalysis] = useState(true)
  const [enableSentimentAnalysis, setEnableSentimentAnalysis] = useState(true)
  const { toast } = useToast()

  const handleSaveSettings = () => {
    // In a real app, save settings to backend or local storage
    toast({
      title: "Settings saved",
      description: `Model: ${selectedModel}, Temperature: ${temperature}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Model Settings
        </CardTitle>
        <CardDescription>Configure the AI models used for stock analysis and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="model-selector">AI Model</Label>
          <ModelSelector onModelChange={setSelectedModel} />
          <p className="text-xs text-muted-foreground mt-1">
            Select the AI model to use for analysis and recommendations. More powerful models may provide better
            insights but may be slower.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature">Temperature: {temperature}</Label>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.1}
            value={[temperature]}
            onValueChange={(value) => setTemperature(value[0])}
          />
          <p className="text-xs text-muted-foreground">
            Lower values produce more consistent, conservative recommendations. Higher values produce more creative,
            diverse recommendations.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="real-time-analysis"
              checked={enableRealTimeAnalysis}
              onCheckedChange={setEnableRealTimeAnalysis}
            />
            <Label htmlFor="real-time-analysis">Enable real-time analysis</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="sentiment-analysis"
              checked={enableSentimentAnalysis}
              onCheckedChange={setEnableSentimentAnalysis}
            />
            <Label htmlFor="sentiment-analysis">Enable sentiment analysis</Label>
          </div>
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}

