"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, LineChart, List, Search, Settings, Star, TrendingUp, Sliders } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function DashboardSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Market Overview",
      href: "/market",
      icon: BarChart3,
    },
    {
      name: "Top Stocks",
      href: "/top-stocks",
      icon: TrendingUp,
    },
    {
      name: "Watchlist",
      href: "/watchlist",
      icon: Star,
    },
    {
      name: "Stock Screener",
      href: "/screener",
      icon: Search,
    },
    {
      name: "Portfolio",
      href: "/portfolio",
      icon: List,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: LineChart,
    },
    {
      name: "Preferences",
      href: "/preferences",
      icon: Sliders,
    },
  ]

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>FinAIze</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                pathname === route.href && "bg-secondary text-foreground",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </aside>
  )
}

