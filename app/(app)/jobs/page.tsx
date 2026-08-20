import type { Metadata } from "next"

import { JobMatch } from "@/components/jobs/job-match"

export const metadata: Metadata = {
  title: "Job matching",
  description: "Measure how well your resume fits any job description.",
}

export default function JobsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Job matching</h2>
        <p className="text-sm text-muted-foreground">
          Paste a job description to see your fit across skills, experience and keywords.
        </p>
      </div>
      <JobMatch />
    </div>
  )
}
