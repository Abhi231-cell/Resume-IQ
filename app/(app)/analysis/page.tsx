"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  LightbulbIcon,
  LoaderIcon,
  RefreshCwIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { ScoreRing } from "@/components/score-ring"
import { ScoreBar } from "@/components/score-bar"
import { FindingList, ChipList } from "@/components/analysis-blocks"
import { ResumePreview } from "@/components/resume/resume-preview"
import { scoreLabel } from "@/lib/score"
import { createClient } from "@/lib/supabase/client"
import { asResumeAnalysis, toPersistedAnalysis } from "@/lib/analyses"
import type { ResumeAnalysis } from "@/lib/types"

function AnalysisContent() {
  const searchParams = useSearchParams()
  const idFromUrl = searchParams.get("id")
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadAnalysis() {
      setLoading(true)

      // 1. If an explicit analysis ID is provided in the URL query, load from Supabase
      if (idFromUrl) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("resume_analyses")
          .select("*")
          .eq("id", idFromUrl)
          .maybeSingle()

        if (isMounted) {
          if (!error && data) {
            setAnalysis(asResumeAnalysis(toPersistedAnalysis(data as Record<string, unknown>)))
            setLoading(false)
            return
          }
        }
      }

      // 2. Try loading the freshly uploaded analysis from sessionStorage
      try {
        const storedAnalysis = sessionStorage.getItem("resumeAnalysis")
        if (storedAnalysis) {
          const parsed = JSON.parse(storedAnalysis) as ResumeAnalysis
          if (isMounted) {
            setAnalysis(parsed)
            setLoading(false)
            return
          }
        }
      } catch {
        // Fall back to querying Supabase
      }

      // 3. Fallback: load the user's latest analysis from Supabase
      const supabase = createClient()
      const { data, error } = await supabase
        .from("resume_analyses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (isMounted) {
        if (!error && data) {
          setAnalysis(asResumeAnalysis(toPersistedAnalysis(data as Record<string, unknown>)))
        } else {
          setAnalysis(null)
        }
        setLoading(false)
      }
    }

    loadAnalysis()

    return () => {
      isMounted = false
    }
  }, [idFromUrl])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <LoaderIcon className="size-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading analysis breakdown...</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">No analysis selected</h2>
          <p className="text-sm text-muted-foreground">
            Analyze a resume to view its detailed score breakdown and recommendations.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/upload" />}>
          Analyze a resume
        </Button>
      </div>
    )
  }

  const a = analysis

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">{a.resumeName}</h2>
          <p className="text-sm text-muted-foreground">
            Analyzed{" "}
            {new Date(a.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href="/upload" />}>
            <RefreshCwIcon data-icon="inline-start" />
            Re-analyze
          </Button>
          <Button nativeButton={false} render={<Link href="/improve" />}>
            Improve resume
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: analysis */}
        <div className="flex flex-col gap-6">
          {/* Score breakdown */}
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle>Score breakdown</CardTitle>
              <CardDescription>How your resume scores in each category.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 py-2 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center gap-1">
                <ScoreRing
                  value={a.overallScore}
                  size={132}
                  sublabel={
                    <span className="text-xs text-muted-foreground">{scoreLabel(a.overallScore)}</span>
                  }
                />
                <span className="text-xs text-muted-foreground">Overall score</span>
              </div>
              <div className="flex flex-1 flex-col gap-3.5">
                {a.metrics.map((metric) => (
                  <ScoreBar key={metric.key} label={metric.label} value={metric.score} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2Icon className="size-4.5 text-success" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FindingList items={a.strengths} tone="success" />
            </CardContent>
          </Card>

          {/* Critical issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangleIcon className="size-4.5 text-destructive" />
                Critical issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FindingList items={a.criticalIssues} tone="destructive" />
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="size-4.5 text-primary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FindingList items={a.recommendations} tone="primary" />
            </CardContent>
          </Card>

          {/* Keywords + skill gaps */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Missing keywords</CardTitle>
                <CardDescription>Terms your target roles expect.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChipList items={a.missingKeywords} tone="destructive" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Skill gaps</CardTitle>
                <CardDescription>Skills worth adding or highlighting.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChipList items={a.skillGaps} tone="muted" />
              </CardContent>
            </Card>
          </div>

          {/* Weak bullet points */}
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle>Weak bullet points</CardTitle>
              <CardDescription>
                Bullets that undersell your impact — with stronger rewrites.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {a.weakBullets.map((bullet) => (
                <div
                  key={bullet.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-destructive">Original</span>
                    <p className="text-sm text-muted-foreground line-through decoration-destructive/40">
                      {bullet.original}
                    </p>
                    <p className="text-xs text-muted-foreground">{bullet.issue}</p>
                  </div>
                  <div className="flex flex-col gap-1 rounded-md bg-success/8 p-3">
                    <span className="text-xs font-medium text-success">Improved</span>
                    <p className="text-sm leading-relaxed">{bullet.improved}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: resume preview (sticky on desktop) */}
        <div className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Resume preview</h3>
            <span className="text-xs text-muted-foreground">{a.resumeName}</span>
          </div>
          <ResumePreview analysis={a} />
        </div>
      </div>
    </div>
  )
}

export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
          <LoaderIcon className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading analysis breakdown...</p>
        </div>
      }
    >
      <AnalysisContent />
    </Suspense>
  )
}
