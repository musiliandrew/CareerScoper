import Link from "next/link";
import { Button } from "@/components/ui/button"
import { CareerScopeLogo } from "@/components/careerscope-logo"
import { ArrowRight } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/landing">
          <CareerScopeLogo size="md" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}