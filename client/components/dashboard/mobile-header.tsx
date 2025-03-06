"use client"

import { Menu, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center border-b bg-background px-4 lg:px-6 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <TrendingUp className="h-5 w-5 text-primary" />
        <span>StockSense AI</span>
      </Link>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  )
}

