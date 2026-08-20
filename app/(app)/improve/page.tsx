import type { Metadata } from "next"

import { ImprovementList } from "@/components/improve/improvement-list"

export const metadata: Metadata = {
  title: "Improve Resume",
  description: "AI-powered rewrites that turn weak bullet points into measurable achievements.",
}

export default function ImprovePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Improve your resume</h1>
        <p className="text-muted-foreground text-pretty">
          Compare each line before and after, then copy the stronger rewrite into your resume.
        </p>
      </div>
      <ImprovementList />
    </div>
  )
}
