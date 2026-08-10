import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FAQItem({ question, answer }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{answer}</p>
      </CardContent>
    </Card>
  )
}