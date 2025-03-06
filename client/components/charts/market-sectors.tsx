"use client"

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes"

export function MarketSectors() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const textColor = isDark ? "#e1e7ef" : "#64748b"
  const gridColor = isDark ? "#334155" : "#e2e8f0"
  const tooltipBg = isDark ? "#1e293b" : "#ffffff"
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0"

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sectorData} layout="vertical">
          <XAxis
            type="number"
            tick={{ fill: textColor }}
            tickLine={{ stroke: gridColor }}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: textColor }}
            tickLine={{ stroke: gridColor }}
            axisLine={{ stroke: gridColor }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              color: textColor,
            }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, "Change"]}
          />
          <Bar dataKey="change" radius={[0, 4, 4, 0]}>
            {sectorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.change >= 0 ? "#10b981" : "#ef4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const sectorData = [
  { name: "Technology", change: 1.8 },
  { name: "Healthcare", change: -0.5 },
  { name: "Financial", change: 0.7 },
  { name: "Consumer", change: 0.3 },
  { name: "Energy", change: -1.2 },
  { name: "Materials", change: 0.4 },
  { name: "Utilities", change: -0.2 },
  { name: "Real Estate", change: 0.1 },
]

