import { TrendingUp } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>FinAIze</span>
        </Link>
      </div>
    </header>
  )
}

