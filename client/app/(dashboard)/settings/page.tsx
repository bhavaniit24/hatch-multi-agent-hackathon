import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AISettings } from "@/components/dashboard/ai-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Tabs defaultValue="ai">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai">AI Models</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AISettings />

            <Card>
              <CardHeader>
                <CardTitle>Multi-Agent Configuration</CardTitle>
                <CardDescription>Configure how multiple AI agents collaborate for stock analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The multi-agent system uses specialized AI models for different aspects of stock analysis:
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Technical Analyst:</strong> Evaluates price patterns, trends, and technical indicators
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Fundamental Analyst:</strong> Assesses financial health, earnings, and business model
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Sentiment Analyzer:</strong> Monitors news, social media, and market sentiment
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Risk Assessor:</strong> Evaluates potential risks and volatility
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>Coordinator:</strong> Combines insights from all agents to form final recommendations
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Account settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

