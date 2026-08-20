"use client"

import * as React from "react"
import { LoaderIcon, SparklesIcon, TargetIcon } from "lucide-react"

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
import { JOB_MATCH } from "@/lib/mock-data"

const SAMPLE = `Senior Frontend Engineer

We're looking for a frontend engineer with strong experience in React, TypeScript and design systems. You'll own performance, accessibility and CI/CD for a product used by millions. GraphQL and observability experience is a plus.`

export function JobMatch() {
  const [value, setValue] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [matched, setMatched] = React.useState(false)

  function runMatch() {
    if (!value.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setMatched(true)
    }, 900)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      {/* Input */}
      <Card className="lg:sticky lg:top-20 lg:self-start">
        <CardHeader className="border-b [.border-b]:pb-4">
          <CardTitle>Job description</CardTitle>
          <CardDescription>Paste a job posting to measure your fit.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste the full job description here..."
            className="min-h-56 resize-y"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={runMatch} disabled={loading || !value.trim()}>
              {loading ? (
                <>
                  <LoaderIcon data-icon="inline-start" className="animate-spin" />
                  Matching
                </>
              ) : (
                <>
                  <TargetIcon data-icon="inline-start" />
                  Match resume
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={() => setValue(SAMPLE)} disabled={loading}>
              Use sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {!matched ? (
        <Card>
          <CardContent className="flex min-h-80 items-center justify-center">
            <Empty className="border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SparklesIcon />
                </EmptyMedia>
                <EmptyTitle>No match yet</EmptyTitle>
                <EmptyDescription>
                  Paste a job description and run a match to see how your resume stacks up across
                  skills, experience and keywords.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle>Match score</CardTitle>
              <CardDescription>Your overall fit for this role.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 py-2 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center gap-1">
                <ScoreRing
                  value={JOB_MATCH.overall}
                  size={132}
                  sublabel={<span className="text-xs text-muted-foreground">overall fit</span>}
                />
              </div>
              <div className="flex flex-1 flex-col gap-3.5">
                {JOB_MATCH.breakdown.map((item) => (
                  <ScoreBar key={item.label} label={item.label} value={item.score} />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Matched skills</CardTitle>
              </CardHeader>
              <CardContent>
                <ChipList items={JOB_MATCH.matchedSkills} tone="success" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Missing skills</CardTitle>
              </CardHeader>
              <CardContent>
                <ChipList items={JOB_MATCH.missingSkills} tone="destructive" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Matched keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <ChipList items={JOB_MATCH.matchedKeywords} tone="success" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Missing keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <ChipList items={JOB_MATCH.missingKeywords} tone="destructive" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How to close the gap</CardTitle>
            </CardHeader>
            <CardContent>
              <FindingList items={JOB_MATCH.recommendations} tone="primary" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
