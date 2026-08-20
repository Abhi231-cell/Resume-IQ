import type { Metadata } from "next"

import { ImprovementList } from "@/components/improve/improvement-list"
import { getUserAnalyses } from "@/lib/analyses-server"
import { asResumeAnalysis } from "@/lib/analyses"
import type { BulletImprovement } from "@/lib/types"

export const metadata: Metadata = {
  title: "Improve Resume",
  description: "AI-powered rewrites that turn weak bullet points into measurable achievements.",
}

export default async function ImprovePage() {
  const persistedAnalyses = await getUserAnalyses()

  const resumes = persistedAnalyses.map((item) => {
    const structured = asResumeAnalysis(item)
    return {
      id: item.id,
      resumeName: structured.resumeName || "Resume",
      createdAt: item.createdAt,
      score: item.overallScore ?? 0,
    }
  })

  // Extract initial improvements from the latest analysis's weak bullets if present
  const latest = persistedAnalyses[0]
  const initialImprovements: BulletImprovement[] = (latest?.weakBullets || []).map(
    (wb, idx) => ({
      id: wb.id || `bi-${idx + 1}`,
      section: "Experience",
      current: wb.original,
      improved: wb.improved,
      reason: wb.issue,
    })
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Improve your resume</h1>
        <p className="text-muted-foreground text-pretty">
          Compare each line before and after, then copy the stronger rewrite into your resume.
        </p>
      </div>
      <ImprovementList
        resumes={resumes}
        initialImprovements={initialImprovements}
      />
    </div>
  )
}
