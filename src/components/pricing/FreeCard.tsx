import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Info } from "lucide-react"
import { Users } from "lucide-react"

export function FreeCard({ freeFeatures }: any) {
  return (
    <Card className="relative border-2 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            <Users className="mr-1 h-3 w-3" />
            Free Forever
          </Badge>
        </div>
        <CardTitle className="text-3xl">Free Tier</CardTitle>
        <CardDescription className="text-base mt-2">
          The perfect starting point to explore CareerScope
        </CardDescription>

        <div className="mt-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">$0</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">No credit card required</p>
        </div>
      </CardHeader>

      <CardContent>
        <Link href="/signup" className="w-full block mb-6">
          <Button variant="outline" className="w-full" size="lg">Get Started Free</Button>
        </Link>

        <div className="space-y-3">
          <p className="font-semibold text-sm text-muted-foreground mb-4">What's Included:</p>
          {freeFeatures.map((feature: any, idx: any) => (
            <div key={idx} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm ${!feature.included && 'text-muted-foreground line-through'}`}>
                  {feature.name}
                </p>
                {feature.limit && feature.included && (
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.limit}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              <strong>Free users get a taste of AI, not the full meal.</strong> See what you're missing and upgrade when ready.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}