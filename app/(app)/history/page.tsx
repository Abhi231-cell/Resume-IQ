import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  MinusIcon,
  TrendingUpIcon,
  UploadCloudIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ScoreProgression } from "@/components/history/score-progression"
import { scoreTone, scoreLabel, toneText } from "@/lib/score"
import { cn } from "@/lib/utils"
import { getUserAnalyses } from "@/lib/analyses-server"

export const metadata: Metadata = {
  title: "History",
  description: "Track how your resume score has progressed across every version.",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function HistoryPage() {
  const analyses = await getUserAnalyses()
  // The database query is newest first. The chart expects oldest first.
  const versions = [...analyses].reverse().map((analysis, index) => ({
    id: analysis.id,
    label: `Version ${index + 1}`,
    createdAt: analysis.createdAt,
    score: analysis.overallScore ?? 0,
    changeSummary: "Resume analysis completed.",
  }))
  const timeline = [...versions].reverse()
  const first = versions[0]
  const latest = versions[versions.length - 1]
  const totalGain = latest && first ? latest.score - first.score : 0
  const hasHistory = versions.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">History</h2>
          <p className="text-sm text-muted-foreground">
            Every version you&apos;ve analyzed, with score progression over time.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/upload" />}>
          Analyze new resume
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>

      {!hasHistory ? (
        <Card>
          <CardContent className="flex min-h-72 items-center justify-center">
            <Empty className="border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UploadCloudIcon />
                </EmptyMedia>
                <EmptyTitle>No history yet</EmptyTitle>
                <EmptyDescription>
                  Analyze your first resume to start tracking your score over time.
                </EmptyDescription>
              </EmptyHeader>
              <Button nativeButton={false} render={<Link href="/upload" />} className="mt-1">
                Analyze a resume
              </Button>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="justify-between">
              <CardHeader>
                <CardDescription>Latest score</CardDescription>
                <CardTitle
                  className={cn(
                    "font-mono text-3xl font-semibold tabular-nums",
                    toneText[scoreTone(latest.score)],
                  )}
                >
                  {latest.score}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{scoreLabel(latest.score)}</p>
              </CardContent>
            </Card>
            <Card className="justify-between">
              <CardHeader>
                <CardDescription>Total improvement</CardDescription>
                <CardTitle className="flex items-center gap-1.5 font-mono text-3xl font-semibold tabular-nums text-success">
                  <TrendingUpIcon className="size-6" />+{totalGain}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Points gained since v1</p>
              </CardContent>
            </Card>
            <Card className="justify-between">
              <CardHeader>
                <CardDescription>Versions analyzed</CardDescription>
                <CardTitle className="font-mono text-3xl font-semibold tabular-nums">
                  {versions.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Since {formatDate(first.createdAt)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progression chart */}
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle>Score progression</CardTitle>
              <CardDescription>How your overall score has changed across versions.</CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <ScoreProgression versions={versions} />
            </CardContent>
          </Card>

          {/* Version timeline */}
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle>Version history</CardTitle>
              <CardDescription>Newest first — with the change made in each version.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {timeline.map((version, i) => {
                const previous = timeline[i + 1]
                const delta = previous ? version.score - previous.score : null
                return (
                  <div
                    key={version.id}
                    className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-col items-center gap-1 pt-0.5">
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg font-mono text-sm font-semibold tabular-nums",
                          scoreTone(version.score) === "success" && "bg-success/12 text-success",
                          scoreTone(version.score) === "warning" && "bg-warning/12 text-warning",
                          scoreTone(version.score) === "destructive" &&
                            "bg-destructive/12 text-destructive",
                        )}
                      >
                        {version.score}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{version.label}</span>
                        {delta !== null && (
                          <span
                            className={cn(
                              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                              delta > 0 && "bg-success/12 text-success",
                              delta === 0 && "bg-muted text-muted-foreground",
                              delta < 0 && "bg-destructive/12 text-destructive",
                            )}
                          >
                            {delta > 0 ? (
                              <ArrowUpRightIcon className="size-3" />
                            ) : delta === 0 ? (
                              <MinusIcon className="size-3" />
                            ) : (
                              <ArrowUpRightIcon className="size-3 rotate-90" />
                            )}
                            {delta > 0 ? `+${delta}` : delta}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(version.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground text-pretty">
                        {version.changeSummary}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={<Link href={`/analysis?id=${version.id}`} />}
                      className="shrink-0"
                    >
                      View
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
