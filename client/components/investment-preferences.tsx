"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Filter } from "lucide-react"
import { useEffect } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useStockAnalysis } from "@/context/stock-analysis-context"

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
})

type UserPreferences = z.infer<typeof formSchema>

export function InvestmentPreferences() {
  const { preferences, setPreferences } = useStockAnalysis()

  const form = useForm<UserPreferences>({
    resolver: zodResolver(formSchema),
    defaultValues: preferences,
  })

  // Update form when preferences change
  useEffect(() => {
    form.reset(preferences)
  }, [form, preferences])

  // Update context when form changes
  function onSubmit(values: UserPreferences) {
    setPreferences(values)
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
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Investment Preferences
        </CardTitle>
        <CardDescription>Customize your investment criteria for personalized recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} onChange={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Timeframe</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="performanceCriteria"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Performance Criteria</FormLabel>
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
                                    const updatedValue = checked
                                      ? [...field.value, option.id]
                                      : field.value?.filter((value) => value !== option.id)
                                    field.onChange(updatedValue)
                                    form.handleSubmit(onSubmit)()
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
                  <div className="mb-2">
                    <FormLabel>Sector Preferences (optional)</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                                    const updatedValue = checked
                                      ? [...field.value, option.id]
                                      : field.value?.filter((value) => value !== option.id)
                                    field.onChange(updatedValue)
                                    form.handleSubmit(onSubmit)()
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
                  <div className="mb-2">
                    <FormLabel>Market Capitalization</FormLabel>
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
                                    const updatedValue = checked
                                      ? [...field.value, option.id]
                                      : field.value?.filter((value) => value !== option.id)
                                    field.onChange(updatedValue)
                                    form.handleSubmit(onSubmit)()
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
                  <FormLabel>Risk Tolerance: {getRiskLabel(field.value)}</FormLabel>
                  <FormControl>
                    <div className="space-y-1">
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => {
                          field.onChange(value[0])
                          form.handleSubmit(onSubmit)()
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Conservative</span>
                        <span>Moderate</span>
                        <span>Aggressive</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        form.handleSubmit(onSubmit)()
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function getRiskLabel(value: number): string {
  switch (value) {
    case 1:
      return "Very Conservative"
    case 2:
      return "Conservative"
    case 3:
      return "Moderate"
    case 4:
      return "Aggressive"
    case 5:
      return "Very Aggressive"
    default:
      return "Moderate"
  }
}

