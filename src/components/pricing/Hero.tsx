import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function Hero({ isAnnual, setIsAnnual, savings }: any) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 text-center">
      <Badge className="mb-4" variant="outline">
        <Sparkles className="mr-1 h-3 w-3" />
        Simple, Transparent Pricing
      </Badge>

      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Choose Your Growth Plan
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Start free and upgrade when you're ready to unlock your full career potential with AI-powered tools.
      </p>

      <div className="flex items-center justify-center gap-4 mb-12">
        <button
          onClick={() => setIsAnnual(false)}
          className={`text-sm font-medium cursor-pointer transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Monthly
        </button>

        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} aria-label="Toggle annual billing" />

        <button
          onClick={() => setIsAnnual(true)}
          className={`text-sm font-medium cursor-pointer transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Annual
        </button>

        {isAnnual && (
          <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
            Save {savings}%
          </Badge>
        )}
      </div>
    </section>
  )
}