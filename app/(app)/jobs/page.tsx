import type { Metadata } from "next"

import { JobMatch } from "@/components/jobs/job-match"
import { getUserAnalyses } from "@/lib/analyses-server"
import { asResumeAnalysis } from "@/lib/analyses"

export const metadata: Metadata = {
  title: "Job matching",
  description: "Measure how well your resume fits any job description.",
}

export default async function JobsPage() {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Job matching</h2>
        <p className="text-sm text-muted-foreground">
          Paste a job description to see your fit across skills, experience and keywords with AI analysis.
        </p>
      </div>
      <JobMatch resumes={resumes} />
    </div>
  )
}
