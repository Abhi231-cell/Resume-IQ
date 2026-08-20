"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileTextIcon,
  LoaderIcon,
  SparklesIcon,
  TargetIcon,
  UploadCloudIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ScoreRing } from "@/components/score-ring"
import { ScoreBar } from "@/components/score-bar"
import { ChipList, FindingList } from "@/components/analysis-blocks"
import type { JobMatchResult } from "@/lib/types"

const SAMPLE = `Senior Frontend Engineer

We are looking for a Senior Frontend Engineer with strong experience in React, TypeScript, and modern web application architecture. You will design component systems, drive accessibility standards, optimize Core Web Vitals, and build scalable user interfaces. Experience with state management, automated testing (Playwright/Jest), CI/CD pipelines, and cloud APIs is required. Strong communication and product sense are essential.`

interface ResumeOption {
  id: string
  resumeName: string
  createdAt: string
  score: number
}

interface JobMatchProps {
  resumes?: ResumeOption[]
}

export function JobMatch({ resumes = [] }: JobMatchProps) {
  const [selectedResumeId, setSelectedResumeId] = React.useState<string>(
    resumes[0]?.id || ""
  )
  const [value, setValue] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [matchResult, setMatchResult] = React.useState<JobMatchResult | null>(null)
  const [matchedResumeTitle, setMatchedResumeTitle] = React.useState<string>("")

  // Update selected resume if list changes
  React.useEffect(() => {
    if (!selectedResumeId && resumes.length > 0) {
      setSelectedResumeId(resumes[0].id)
    }
  }, [resumes, selectedResumeId])

  async function runMatch() {
    const trimmed = value.trim()
    if (!trimmed) {
      toast.error("Please paste a job description first.")
      return
    }

    if (trimmed.length < 20) {
      toast.error("Job description must be at least 20 characters.")
      return
    }

    if (resumes.length === 0) {
      toast.error("No analyzed resume found. Please upload a resume first.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription: trimmed,
          analysisId: selectedResumeId || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze job match.")
      }

      setMatchResult(data.match)
      setMatchedResumeTitle(data.resumeName || "Resume")
      toast.success("Job match analysis complete!")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const selectedResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      {/* Input Form */}
      <Card className="lg:sticky lg:top-20 lg:self-start">
        <CardHeader className="border-b [.border-b]:pb-4">
          <CardTitle>Job description</CardTitle>
          <CardDescription>Paste a job posting to measure your fit.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Target Resume selector / indicator */}
          {resumes.length > 0 ? (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border/80 bg-muted/30 p-3">
              <span className="text-xs font-medium text-muted-foreground">
                Comparing against resume:
              </span>
              {resumes.length === 1 ? (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileTextIcon className="size-4 text-primary" />
                  <span className="truncate">{selectedResume?.resumeName || "Uploaded Resume"}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    Score: {selectedResume?.score ?? 0}
                  </span>
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.resumeName} (Score: {r.score})
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
              <span>No resume uploaded yet.</span>
              <Button size="xs" variant="outline" nativeButton={false} render={<Link href="/upload" />}>
                Upload
              </Button>
            </div>
          )}

          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste the full job description here..."
            className="min-h-56 resize-y"
            disabled={loading}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={runMatch}
              disabled={loading || !value.trim() || resumes.length === 0}
            >
              {loading ? (
                <>
                  <LoaderIcon data-icon="inline-start" className="animate-spin" />
                  Analyzing match...
                </>
              ) : (
                <>
                  <TargetIcon data-icon="inline-start" />
                  Match resume
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setValue(SAMPLE)}
              disabled={loading}
            >
              Use sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results View */}
      {!matchResult ? (
        <Card>
          <CardContent className="flex min-h-80 items-center justify-center">
            {resumes.length === 0 ? (
              <Empty className="border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UploadCloudIcon />
                  </EmptyMedia>
                  <EmptyTitle>Upload a resume first</EmptyTitle>
                  <EmptyDescription>
                    To calculate your job match score, you need at least one analyzed resume in your account.
                  </EmptyDescription>
                </EmptyHeader>
                <Button nativeButton={false} render={<Link href="/upload" />} className="mt-2">
                  Upload resume
                </Button>
              </Empty>
            ) : (
              <Empty className="border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SparklesIcon />
                  </EmptyMedia>
                  <EmptyTitle>No match yet</EmptyTitle>
                  <EmptyDescription>
                    Paste a job description and run a match to see how your resume stacks up across
                    skills, experience and keywords with real-time AI analysis.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Match score</CardTitle>
                  <CardDescription>
                    Fit evaluation for {matchedResumeTitle || "your resume"}.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 py-4 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center gap-1">
                <ScoreRing
                  value={matchResult.overall}
                  size={132}
                  sublabel={<span className="text-xs text-muted-foreground">overall fit</span>}
                />
              </div>
              <div className="flex flex-1 flex-col gap-3.5">
                {matchResult.breakdown.map((item) => (
                  <ScoreBar key={item.label} label={item.label} value={item.score} />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Matched skills ({matchResult.matchedSkills.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ChipList
                  items={matchResult.matchedSkills.length > 0 ? matchResult.matchedSkills : ["No direct skill matches identified."]}
                  tone="success"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Missing skills ({matchResult.missingSkills.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ChipList
                  items={matchResult.missingSkills.length > 0 ? matchResult.missingSkills : ["None detected — strong skill alignment!"]}
                  tone={matchResult.missingSkills.length > 0 ? "destructive" : "success"}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Matched keywords ({matchResult.matchedKeywords.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ChipList
                  items={matchResult.matchedKeywords.length > 0 ? matchResult.matchedKeywords : ["No matching keywords found."]}
                  tone="success"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Missing keywords ({matchResult.missingKeywords.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ChipList
                  items={matchResult.missingKeywords.length > 0 ? matchResult.missingKeywords : ["None detected — great keyword coverage!"]}
                  tone={matchResult.missingKeywords.length > 0 ? "destructive" : "success"}
                />
              </CardContent>
            </Card>
          </div>

          {matchResult.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">How to close the gap</CardTitle>
              </CardHeader>
              <CardContent>
                <FindingList items={matchResult.recommendations} tone="primary" />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
