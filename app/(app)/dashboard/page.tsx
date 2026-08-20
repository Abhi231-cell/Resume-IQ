import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, FileTextIcon, MapPinIcon } from "lucide-react"

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
import { PriorityBadge } from "@/components/priority-badge"
import { scoreTone, toneText } from "@/lib/score"
import { cn } from "@/lib/utils"
import { asResumeAnalysis } from "@/lib/analyses"
import { getUserAnalyses } from "@/lib/analyses-server"
import { createClient } from "@/lib/supabase/server"
import {
  PRIORITY_IMPROVEMENTS,
  RECOMMENDED_JOBS,
} from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your resume health at a glance — scores, recommendations and matches.",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    user?.email?.split("@")[0] ||
    "there"

  const persistedAnalyses = await getUserAnalyses()
  const latest = persistedAnalyses[0]
  const latestAnalysis = latest ? asResumeAnalysis(latest) : null
  const dashboardMetrics = latestAnalysis?.metrics ?? []
  const summaryMetrics = dashboardMetrics.filter((metric) =>
    ["ats", "skills", "experience"].includes(metric.key),
  )
  const recentAnalyses = persistedAnalyses.slice(0, 3).map((analysis) => {
    const structured = asResumeAnalysis(analysis)
    return {
      id: analysis.id,
      resumeName: structured.resumeName,
      createdAt: analysis.createdAt,
      score: analysis.overallScore ?? 0,
    }
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Page intro */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">Welcome back, {userName}</h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s how your latest resume is performing.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/upload" />}>
          Analyze new resume
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>

      {/* Health + score summary */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
        <Card>
          <CardHeader className="border-b [.border-b]:pb-4">
            <CardTitle>Resume health score</CardTitle>
            <CardDescription>Overall readiness across every category.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center gap-6 py-2">
              <ScoreRing
              value={latestAnalysis?.overallScore ?? 0}
              size={148}
              sublabel={<span className="text-xs text-muted-foreground">out of 100</span>}
            />
            <ul className="flex flex-col gap-2 text-sm">
              {dashboardMetrics.map((metric) => (
                <li key={metric.key} className="flex items-center gap-2">
                  <span
                    className={cn("size-2 rounded-full", {
                      "bg-success": scoreTone(metric.score) === "success",
                      "bg-warning": scoreTone(metric.score) === "warning",
                      "bg-destructive": scoreTone(metric.score) === "destructive",
                    })}
                  />
                  <span className="text-muted-foreground">{metric.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          {summaryMetrics.map((metric) => (
            <Card key={metric.key} className="justify-between">
              <CardHeader>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle
                  className={cn(
                    "font-mono text-3xl font-semibold tabular-nums",
                    toneText[scoreTone(metric.score)],
                  )}
                >
                  {metric.score}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{metric.summary}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="justify-between sm:col-span-3">
            <CardContent className="flex flex-col gap-3">
              {dashboardMetrics.map((metric) => (
                <ScoreBar key={metric.key} label={metric.label} value={metric.score} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Priority recommendations + recent analyses */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b [.border-b]:pb-4">
            <CardTitle>Priority recommendations</CardTitle>
            <CardDescription>The highest-impact fixes to make next.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {PRIORITY_IMPROVEMENTS.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1.5 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <PriorityBadge priority={item.priority} />
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b [.border-b]:pb-4">
            <CardTitle>Recent analyses</CardTitle>
            <CardDescription>Your most recently analyzed resumes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {recentAnalyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/analysis?id=${analysis.id}`}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileTextIcon className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{analysis.resumeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(analysis.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-mono text-sm font-semibold tabular-nums",
                    toneText[scoreTone(analysis.score)],
                  )}
                >
                  {analysis.score}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommended jobs */}
      <Card>
        <CardHeader className="border-b [.border-b]:pb-4">
          <CardTitle>Recommended jobs</CardTitle>
          <CardDescription>Roles that match your current resume profile.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {RECOMMENDED_JOBS.map((job) => (
            <div
              key={job.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{job.role}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{job.company}</span>
                  <span aria-hidden="true">·</span>
                  <MapPinIcon className="size-3" />
                  <span className="truncate">{job.location}</span>
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={cn(
                    "font-mono text-sm font-semibold tabular-nums",
                    toneText[scoreTone(job.match)],
                  )}
                >
                  {job.match}%
                </span>
                <span className="text-xs text-muted-foreground">match</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
