import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Wand2, Shield, Zap, ArrowRight, Stars } from "lucide-react"

export function PremiumCard({ premiumFeatures, isAnnual, monthlyPrice, annualPrice, monthlyEquivalent, savings }: any) {
  return (
    <Card className="relative border-2 border-purple-500 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/20 dark:to-background overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
      
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 shadow-md">
          <Wand2 className="mr-1 h-3 w-3" />
          Autonomous Agent
        </Badge>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300">
            <Stars className="mr-1 h-3 w-3" />
            Executive Assistant
          </Badge>
        </div>

        <CardTitle className="text-3xl text-purple-900 dark:text-purple-100">Career Agent</CardTitle>
        <CardDescription className="text-base mt-2">Hire an autonomous worker to find and apply for you.</CardDescription>

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
        <Link href={`/checkout?plan=premium&billing=${isAnnual ? "annual" : "monthly"}`} className="w-full block mb-6">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 dark:shadow-none" size="lg">
            Hire Your Agent
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <div className="space-y-3">
          <p className="font-semibold text-sm text-muted-foreground mb-4">Everything in Pro, plus Actions:</p>
          {premiumFeatures.map((feature: any, idx: any) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${feature.highlight ? "text-purple-600 dark:text-purple-400" : "text-green-600 dark:text-green-500"}`} />
              <div className="flex-1">
                <p className={`text-sm ${feature.highlight && "font-medium text-purple-900 dark:text-purple-100"}`}>{feature.name}</p>
                {feature.limit && <p className="text-xs text-muted-foreground mt-0.5">{feature.limit}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-purple-100/50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-purple-800 dark:text-purple-300">
              <strong>Complete Delegation.</strong> The Agent hunts down hidden recruiter emails, writes the cover letter, and applies while you sleep.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
