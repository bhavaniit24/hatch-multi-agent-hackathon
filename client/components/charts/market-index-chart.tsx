"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"

export function MarketIndexChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const textColor = isDark ? "#e1e7ef" : "#64748b"
  const gridColor = isDark ? "#334155" : "#e2e8f0"
  const tooltipBg = isDark ? "#1e293b" : "#ffffff"
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={marketData}>
          <XAxis
            dataKey="time"
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
          <Line type="monotone" dataKey="sp500" stroke="#3b82f6" strokeWidth={2} dot={false} name="S&P 500" />
          <Line type="monotone" dataKey="dow" stroke="#10b981" strokeWidth={2} dot={false} name="Dow Jones" />
          <Line type="monotone" dataKey="nasdaq" stroke="#f59e0b" strokeWidth={2} dot={false} name="Nasdaq" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const marketData = [
  { time: "9:30", sp500: 4800, dow: 38000, nasdaq: 15800 },
  { time: "10:00", sp500: 4810, dow: 38050, nasdaq: 15830 },
  { time: "10:30", sp500: 4815, dow: 38100, nasdaq: 15810 },
  { time: "11:00", sp500: 4825, dow: 38150, nasdaq: 15790 },
  { time: "11:30", sp500: 4830, dow: 38200, nasdaq: 15780 },
  { time: "12:00", sp500: 4835, dow: 38180, nasdaq: 15800 },
  { time: "12:30", sp500: 4840, dow: 38190, nasdaq: 15820 },
  { time: "13:00", sp500: 4845, dow: 38210, nasdaq: 15840 },
  { time: "13:30", sp500: 4850, dow: 38230, nasdaq: 15860 },
  { time: "14:00", sp500: 4860, dow: 38250, nasdaq: 15880 },
  { time: "14:30", sp500: 4870, dow: 38270, nasdaq: 15900 },
  { time: "15:00", sp500: 4880, dow: 38290, nasdaq: 15920 },
  { time: "15:30", sp500: 4890, dow: 38310, nasdaq: 15940 },
  { time: "16:00", sp500: 4900, dow: 38330, nasdaq: 15960 },
]

