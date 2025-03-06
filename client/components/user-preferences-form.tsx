"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Filter, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  timeframe: z.string(),
  performanceCriteria: z.array(z.string()).min(1, {
    message: "Please select at least one performance criteria.",
  }),
  sectors: z.array(z.string()),
  marketCap: z.array(z.string()).min(1, {
    message: "Please select at least one market cap range.",
  }),
  riskTolerance: z.number().min(1).max(5),
  dividendPreference: z.boolean(),
  esgFocus: z.boolean(),
  internationalExposure: z.boolean(),
})

type UserPreferences = z.infer<typeof formSchema>

export function UserPreferencesForm() {
  const { toast } = useToast()
  const [isExpanded, setIsExpanded] = useState(false)

  const form = useForm<UserPreferences>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeframe: "1year",
      performanceCriteria: ["price"],
      sectors: [],
      marketCap: ["large"],
      riskTolerance: 3,
      dividendPreference: false,
      esgFocus: false,
      internationalExposure: false,
    },
  })

  function onSubmit(values: UserPreferences) {
    toast({
      title: "Preferences saved",
      description: "Your investment preferences have been updated.",
    })
    console.log(values)
    // In a real app, you would save these preferences and use them to filter AI recommendations
  }

  const performanceCriteriaOptions = [
    { id: "price", label: "Price Appreciation" },
    { id: "revenue", label: "Revenue Growth" },
    { id: "earnings", label: "Earnings Growth" },
    { id: "margins", label: "Profit Margins" },
    { id: "cashflow", label: "Cash Flow" },
  ]

  const sectorOptions = [
    { id: "technology", label: "Technology" },
    { id: "healthcare", label: "Healthcare" },
    { id: "financial", label: "Financial" },
    { id: "consumer", label: "Consumer" },
    { id: "energy", label: "Energy" },
    { id: "industrial", label: "Industrial" },
    { id: "materials", label: "Materials" },
    { id: "utilities", label: "Utilities" },
    { id: "realestate", label: "Real Estate" },
    { id: "communication", label: "Communication" },
  ]

  const marketCapOptions = [
    { id: "large", label: "Large Cap (>$10B)" },
    { id: "mid", label: "Mid Cap ($2B-$10B)" },
    { id: "small", label: "Small Cap ($300M-$2B)" },
    { id: "micro", label: "Micro Cap (<$300M)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <span>Investment Preferences</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </CardTitle>
        <CardDescription>Customize your investment criteria to get personalized AI recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Timeframe</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a timeframe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1month">Past Month</SelectItem>
                      <SelectItem value="3months">Past Quarter</SelectItem>
                      <SelectItem value="6months">Past 6 Months</SelectItem>
                      <SelectItem value="1year">Past Year</SelectItem>
                      <SelectItem value="3years">Past 3 Years</SelectItem>
                      <SelectItem value="5years">Past 5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The time period to evaluate stock performance</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isExpanded && (
              <>
                <FormField
                  control={form.control}
                  name="performanceCriteria"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Performance Criteria</FormLabel>
                        <FormDescription>Select the metrics you want to prioritize</FormDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {performanceCriteriaOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="performanceCriteria"
                            render={({ field }) => {
                              return (
                                <FormItem key={option.id} className="flex flex-row items-start space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(field.value?.filter((value) => value !== option.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sectors"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Sector Preferences</FormLabel>
                        <FormDescription>
                          Select specific sectors or leave empty for a diversified selection
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                        {sectorOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="sectors"
                            render={({ field }) => {
                              return (
                                <FormItem key={option.id} className="flex flex-row items-start space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(field.value?.filter((value) => value !== option.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketCap"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Market Capitalization</FormLabel>
                        <FormDescription>Select the company sizes you're interested in</FormDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {marketCapOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="marketCap"
                            render={({ field }) => {
                              return (
                                <FormItem key={option.id} className="flex flex-row items-start space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(field.value?.filter((value) => value !== option.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="riskTolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Tolerance</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Conservative</span>
                            <span>Moderate</span>
                            <span>Aggressive</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Higher risk tolerance may include more volatile stocks with higher growth potential
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="dividendPreference"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Dividend Focus</FormLabel>
                          <FormDescription>Prefer stocks that pay dividends</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="esgFocus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>ESG Focus</FormLabel>
                          <FormDescription>Prioritize environmental, social, and governance factors</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="internationalExposure"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:col-span-2">
                        <div className="space-y-0.5">
                          <FormLabel>International Exposure</FormLabel>
                          <FormDescription>Include stocks with significant international business</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
      {!isExpanded && (
        <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
          <Badge variant="outline">1 Year Timeframe</Badge>
          <Badge variant="outline">Price Appreciation</Badge>
          <Badge variant="outline">Large Cap</Badge>
          <Badge variant="outline">Moderate Risk</Badge>
        </CardFooter>
      )}
    </Card>
  )
}

