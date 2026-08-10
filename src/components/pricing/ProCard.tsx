import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Rocket, Crown, ArrowRight } from "lucide-react"

export function ProCard({ proFeatures, isAnnual, monthlyPrice, annualPrice, monthlyEquivalent, savings }: any) {
  return (
    <Card className="relative border-2 border-primary shadow-xl hover:shadow-2xl transition-shadow">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1">
          <Crown className="mr-1 h-3 w-3" />
          Most Popular
        </Badge>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
            <Rocket className="mr-1 h-3 w-3" />
            AI Career Coach
          </Badge>
        </div>

        <CardTitle className="text-3xl">CareerScope Pro</CardTitle>
        <CardDescription className="text-base mt-2">Your personal AI-powered career growth assistant</CardDescription>

        <div className="mt-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">${isAnnual ? monthlyEquivalent : monthlyPrice}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          {isAnnual ? (
            <p className="text-sm text-muted-foreground mt-2">Billed annually at ${annualPrice}/year</p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">Or save {savings}% with annual billing</p>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Link href={`/checkout?plan=${isAnnual ? "annual" : "monthly"}`} className="w-full block mb-6">
          <Button className="w-full" size="lg">
            Start 14-Day Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <div className="space-y-3">
          <p className="font-semibold text-sm text-muted-foreground mb-4">Everything in Free, plus:</p>
          {proFeatures.map((feature: any, idx: any) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${feature.highlight ? "text-primary" : "text-green-600 dark:text-green-500"}`} />
              <div className="flex-1">
                <p className={`text-sm ${feature.highlight && "font-medium text-foreground"}`}>{feature.name}</p>
                {feature.limit && <p className="text-xs text-muted-foreground mt-0.5">{feature.limit}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Pro transforms CareerScope</strong> from "a helpful tool" into your personal AI career coach.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}