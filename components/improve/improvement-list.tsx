"use client"

import * as React from "react"
import Link from "next/link"
import {
  CheckIcon,
  CopyIcon,
  FileTextIcon,
  LoaderIcon,
  PlusIcon,
  RefreshCwIcon,
  SparklesIcon,
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
import { cn } from "@/lib/utils"
import type { BulletImprovement } from "@/lib/types"

interface ResumeOption {
  id: string
  resumeName: string
  createdAt: string
  score: number
}

interface ImprovementListProps {
  resumes?: ResumeOption[]
  initialImprovements?: BulletImprovement[]
}

export function ImprovementList({
  resumes = [],
  initialImprovements = [],
}: ImprovementListProps) {
  const [selectedResumeId, setSelectedResumeId] = React.useState<string>(
    resumes[0]?.id || ""
  )
  const [improvements, setImprovements] = React.useState<BulletImprovement[]>(initialImprovements)
  const [improved, setImproved] = React.useState(initialImprovements.length > 0)
  const [improving, setImproving] = React.useState(false)
  const [regenerating, setRegenerating] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // Custom bullet input state
  const [showCustomInput, setShowCustomInput] = React.useState(false)
  const [customBullet, setCustomBullet] = React.useState("")
  const [customSection, setCustomSection] = React.useState("Experience")
  const [addingCustom, setAddingCustom] = React.useState(false)

  React.useEffect(() => {
    if (!selectedResumeId && resumes.length > 0) {
      setSelectedResumeId(resumes[0].id)
    }
  }, [resumes, selectedResumeId])

  async function improveAll() {
    if (resumes.length === 0) {
      toast.error("No analyzed resume found. Please upload a resume first.")
      return
    }

    setImproving(true)

    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: selectedResumeId || undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate improvements.")
      }

      if (Array.isArray(data.improvements) && data.improvements.length > 0) {
        setImprovements(data.improvements)
        setImproved(true)
        toast.success("Rewrites ready", {
          description: `${data.improvements.length} bullet points improved.`,
        })
      } else {
        toast.info("No weak bullets were found that require immediate rewriting.")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred."
      toast.error(message)
    } finally {
      setImproving(false)
    }
  }

  async function regenerate(id: string, current: string, section: string) {
    setRegenerating(id)

    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: selectedResumeId || undefined,
          current,
          section,
          bulletId: id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to regenerate rewrite.")
      }

      if (data.improvement) {
        setImprovements((prev) =>
          prev.map((item) => (item.id === id ? data.improvement : item))
        )
        toast.success("Regenerated", { description: "A fresh rewrite is ready." })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to regenerate rewrite."
      toast.error(message)
    } finally {
      setRegenerating(null)
    }
  }

  async function addAndImproveCustomBullet() {
    const text = customBullet.trim()
    if (!text || text.length < 10) {
      toast.error("Please enter a bullet point of at least 10 characters.")
      return
    }

    setAddingCustom(true)
    const customId = `bi-custom-${Date.now()}`

    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: selectedResumeId || undefined,
          current: text,
          section: customSection,
          bulletId: customId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to rewrite bullet point.")
      }

      if (data.improvement) {
        setImprovements((prev) => [data.improvement, ...prev])
        setImproved(true)
        setCustomBullet("")
        setShowCustomInput(false)
        toast.success("Custom bullet rewritten!")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to rewrite bullet."
      toast.error(message)
    } finally {
      setAddingCustom(false)
    }
  }

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      toast.error("Couldn't copy", { description: "Copy the text manually instead." })
    }
  }

  const selectedResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0]

  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-80 items-center justify-center p-8">
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UploadCloudIcon />
              </EmptyMedia>
              <EmptyTitle>No resume uploaded yet</EmptyTitle>
              <EmptyDescription>
                Upload and analyze a resume first so our AI can extract and optimize your bullet points.
              </EmptyDescription>
            </EmptyHeader>
            <Button nativeButton={false} render={<Link href="/upload" />} className="mt-4">
              Upload a resume
            </Button>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls & Status Card */}
      <Card>
        <CardContent className="flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SparklesIcon className="size-5" />
            </span>
            <div className="flex flex-col">
              <p className="text-sm font-medium">
                {improvements.length} bullet {improvements.length === 1 ? "point" : "points"} ready for optimization
              </p>
              <p className="text-sm text-muted-foreground">
                Turn weak, vague lines into measurable, recruiter-ready achievements.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {resumes.length > 1 && (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.resumeName} ({r.score}/100)
                  </option>
                ))}
              </select>
            )}

            <Button onClick={improveAll} disabled={improving}>
              {improving ? (
                <>
                  <LoaderIcon data-icon="inline-start" className="animate-spin" />
                  Generating rewrites...
                </>
              ) : (
                <>
                  <SparklesIcon data-icon="inline-start" />
                  {improved ? "Regenerate all" : "Improve all"}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="default"
              onClick={() => setShowCustomInput((prev) => !prev)}
            >
              <PlusIcon data-icon="inline-start" />
              {showCustomInput ? "Cancel" : "Add custom bullet"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Optional Custom Bullet Input Box */}
      {showCustomInput && (
        <Card className="border-primary/30 bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Rewrite a custom bullet point</CardTitle>
            <CardDescription>
              Paste any single line from your resume to generate a high-impact, quantified version.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={customSection}
                onChange={(e) => setCustomSection(e.target.value)}
                placeholder="Section (e.g. Experience — Stripe)"
                className="h-8 w-60 rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Textarea
              value={customBullet}
              onChange={(e) => setCustomBullet(e.target.value)}
              placeholder="e.g. Worked on the API to make things faster for clients."
              className="min-h-20 resize-y text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                onClick={addAndImproveCustomBullet}
                disabled={addingCustom || !customBullet.trim()}
              >
                {addingCustom ? (
                  <>
                    <LoaderIcon data-icon="inline-start" className="animate-spin" />
                    Rewriting...
                  </>
                ) : (
                  <>
                    <SparklesIcon data-icon="inline-start" />
                    Generate rewrite
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvements List */}
      <div className="flex flex-col gap-6">
        {improvements.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-60 items-center justify-center p-8">
              <Empty className="border-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SparklesIcon />
                  </EmptyMedia>
                  <EmptyTitle>Ready to generate improvements</EmptyTitle>
                  <EmptyDescription>
                    Click &ldquo;Improve all&rdquo; above to analyze your resume and generate recruiter-approved bullet point revisions.
                  </EmptyDescription>
                </EmptyHeader>
                <Button onClick={improveAll} disabled={improving} className="mt-4">
                  <SparklesIcon data-icon="inline-start" />
                  Improve my resume
                </Button>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          improvements.map((item) => (
            <Card key={item.id} className="transition-all hover:border-border/80">
              <CardHeader className="border-b [.border-b]:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{item.section}</CardTitle>
                  <span className="text-xs text-muted-foreground font-mono">
                    {selectedResume?.resumeName}
                  </span>
                </div>
                <CardDescription>{item.reason}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
                {/* Before */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Before
                  </span>
                  <div className="flex-1 rounded-lg border border-border bg-muted/40 p-3">
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.current}</p>
                  </div>
                </div>

                {/* After */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium tracking-wide text-success uppercase">
                    After (Recruiter-Ready)
                  </span>
                  <div
                    className={cn(
                      "flex-1 rounded-lg border p-3 transition-colors",
                      improved
                        ? "border-success/30 bg-success/8"
                        : "border-dashed border-border bg-transparent"
                    )}
                  >
                    <p className="text-sm leading-relaxed text-foreground font-normal">
                      {item.improved}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copy(item.id, item.improved)}
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckIcon data-icon="inline-start" className="text-success" />
                          Copied
                        </>
                      ) : (
                        <>
                          <CopyIcon data-icon="inline-start" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerate(item.id, item.current, item.section)}
                      disabled={regenerating === item.id}
                    >
                      <RefreshCwIcon
                        data-icon="inline-start"
                        className={cn(regenerating === item.id && "animate-spin")}
                      />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
