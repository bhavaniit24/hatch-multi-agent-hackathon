"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"

export function SentimentChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const textColor = isDark ? "#e1e7ef" : "#64748b"
  const gridColor = isDark ? "#334155" : "#e2e8f0"
  const tooltipBg = isDark ? "#1e293b" : "#ffffff"
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0"

  return (
    <div className="h-[150px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sentimentData}>
          <defs>
            <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            domain={[0, 100]}
            hide
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              color: textColor,
            }}
            formatter={(value: number) => [`${value}`, "Sentiment Score"]}
          />
          <Area type="monotone" dataKey="score" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSentiment)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const sentimentData = [
  { date: "Mon", score: 65 },
  { date: "Tue", score: 68 },
  { date: "Wed", score: 62 },
  { date: "Thu", score: 70 },
  { date: "Fri", score: 68 },
  { date: "Sat", score: 65 },
  { date: "Sun", score: 67 },
]

