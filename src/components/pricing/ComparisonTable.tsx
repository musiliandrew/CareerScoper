import React from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Brain, Target, GraduationCap, Building2, BarChart3, X } from "lucide-react"

export function ComparisonTable(): any {
  function ComparisonRow({ feature, free, pro }: any) {
    return (
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="text-sm text-muted-foreground">{feature}</div>
        <div className="text-center text-sm">{typeof free === "string" ? <span className="text-muted-foreground">{free}</span> : free}</div>
        <div className="text-center text-sm font-medium">{typeof pro === "string" ? pro : pro}</div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="grid grid-cols-3 gap-4 p-6 border-b bg-muted/50">
        <div className="font-semibold">Feature</div>
        <div className="text-center font-semibold">Free</div>
        <div className="text-center font-semibold flex items-center justify-center gap-2">
          <Crown className="h-4 w-4 text-primary" />
          Pro
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="flex items-center gap-2 font-semibold text-sm text-primary mb-4">
          <Brain className="h-4 w-4" />
          AI & Intelligence
        </div>
        <div className="space-y-4">
          <ComparisonRow feature="Smart AI Assistant" free={<X className="h-5 w-5 text-muted-foreground" />} pro="Real-time career coach" />
          <ComparisonRow feature="Skill Gap Analysis" free="1 per week" pro="Unlimited + deep insights" />
          <ComparisonRow feature="Job Match Score" free="Static % (once)" pro="Live updating" />
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="flex items-center gap-2 font-semibold text-sm text-primary mb-4">
          <Target className="h-4 w-4" />
          Job Tracking & Applications
        </div>
        <div className="space-y-4">
          <ComparisonRow feature="Application Tracking" free="Manual logging" pro="Auto-detect from email" />
          <ComparisonRow feature="Job Listings" free="Basic search" pro="Advanced filters + alerts" />
          <ComparisonRow feature="Automated Applications" free={<X className="h-5 w-5 text-muted-foreground" />} pro="Autofill + reminders" />
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="flex items-center gap-2 font-semibold text-sm text-primary mb-4">
          <GraduationCap className="h-4 w-4" />
          Learning & Growth
        </div>
        <div className="space-y-4">
          <ComparisonRow feature="Learning Recommendations" free="3 courses/week" pro="Unlimited + ranked by ROI" />
          <ComparisonRow feature="Learning Path Optimization" free={<X className="h-5 w-5 text-muted-foreground" />} pro="AI-optimized roadmap" />
          <ComparisonRow feature="Interview Intelligence" free={<X className="h-5 w-5 text-muted-foreground" />} pro="Mock interviews + prep" />
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="flex items-center gap-2 font-semibold text-sm text-primary mb-4">
          <Building2 className="h-4 w-4" />
          Company Intelligence
        </div>
        <div className="space-y-4">
          <ComparisonRow feature="Company Tracking" free="Up to 3 companies" pro="Unlimited companies" />
          <ComparisonRow feature="Hiring Pattern Alerts" free={<X className="h-5 w-5 text-muted-foreground" />} pro="Real-time notifications" />
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 font-semibold text-sm text-primary mb-4">
          <BarChart3 className="h-4 w-4" />
          Analytics & Portfolio
        </div>
        <div className="space-y-4">
          <ComparisonRow feature="Career Analytics Dashboard" free={<X className="h-5 w-5 text-muted-foreground" />} pro="Full analytics suite" />
          <ComparisonRow feature="Portfolio Builder" free={<X className="h-5 w-5 text-muted-foreground" />} pro="Auto-updating portfolio" />
          <ComparisonRow feature="Priority Support" free={<X className="h-5 w-5 text-muted-foreground" />} pro="Email + early features" />
        </div>
      </div>
    </div>
  )
}