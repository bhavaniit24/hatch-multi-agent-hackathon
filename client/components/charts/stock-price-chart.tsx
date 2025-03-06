"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"

export function StockPriceChart({
  symbol,
  timeRange,
  chartType,
}: {
  symbol: string
  timeRange: string
  chartType: string
}) {
  const { theme } = useTheme()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real app, fetch data based on symbol and timeRange
    // For demo purposes, we'll generate mock data
    const mockData = generateMockData(timeRange)
    setData(mockData)
  }, [symbol, timeRange])

  const isDark = theme === "dark"
  const textColor = isDark ? "#e1e7ef" : "#64748b"
  const gridColor = isDark ? "#334155" : "#e2e8f0"
  const tooltipBg = isDark ? "#1e293b" : "#ffffff"
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0"

  if (chartType === "candle") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: textColor }}
            tickLine={{ stroke: gridColor }}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis
            tick={{ fill: textColor }}
            tickLine={{ stroke: gridColor }}
            axisLine={{ stroke: gridColor }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              color: textColor,
            }}
          />
          <Bar dataKey="open" fill="#10b981" />
          <Bar dataKey="close" fill={data[0]?.close > data[0]?.open ? "#10b981" : "#ef4444"} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: textColor }}
          tickLine={{ stroke: gridColor }}
          axisLine={{ stroke: gridColor }}
        />
        <YAxis
          tick={{ fill: textColor }}
          tickLine={{ stroke: gridColor }}
          axisLine={{ stroke: gridColor }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            color: textColor,
          }}
        />
        <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function generateMockData(timeRange: string) {
  const data = []
  let points = 0

  switch (timeRange) {
    case "1D":
      points = 24
      break
    case "1W":
      points = 7
      break
    case "1M":
      points = 30
      break
    case "3M":
      points = 90
      break
    case "1Y":
      points = 12
      break
    case "5Y":
      points = 60
      break
    default:
      points = 30
  }

  let basePrice = 150 + Math.random() * 50
  const volatility = 0.02

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * volatility * basePrice
    basePrice += change

    let date
    if (timeRange === "1D") {
      date = `${i}:00`
    } else if (timeRange === "1W") {
      date = `Day ${i + 1}`
    } else if (timeRange === "1M" || timeRange === "3M") {
      date = `Day ${i + 1}`
    } else {
      date = `Month ${i + 1}`
    }

    data.push({
      date,
      price: basePrice,
      open: basePrice - Math.random() * 5,
      close: basePrice + Math.random() * 5,
      volume: Math.floor(Math.random() * 1000000),
    })
  }

  return data
}

