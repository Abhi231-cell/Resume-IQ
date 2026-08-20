"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, LoaderIcon, RefreshCwIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IMPROVEMENTS } from "@/lib/mock-data"

export function ImprovementList() {
  const [improved, setImproved] = React.useState(false)
  const [improving, setImproving] = React.useState(false)
  const [regenerating, setRegenerating] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  function improveAll() {
    setImproving(true)
    setTimeout(() => {
      setImproving(false)
      setImproved(true)
      toast.success("Rewrites ready", {
        description: `${IMPROVEMENTS.length} bullet points improved.`,
      })
    }, 1000)
  }

  function regenerate(id: string) {
    setRegenerating(id)
    setTimeout(() => {
      setRegenerating(null)
      toast.success("Regenerated", { description: "A fresh rewrite is ready." })
    }, 800)
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

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <SparklesIcon className="size-5" />
            </span>
            <div className="flex flex-col">
              <p className="text-sm font-medium">
                {IMPROVEMENTS.length} bullet points can be improved
              </p>
              <p className="text-sm text-muted-foreground">
                Turn weak, vague lines into measurable achievements.
              </p>
            </div>
          </div>
          <Button onClick={improveAll} disabled={improving}>
            {improving ? (
              <>
                <LoaderIcon data-icon="inline-start" className="animate-spin" />
                Improving
              </>
            ) : (
              <>
                <SparklesIcon data-icon="inline-start" />
                {improved ? "Improve again" : "Improve all"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        {IMPROVEMENTS.map((item) => (
          <Card key={item.id}>
            <CardHeader className="border-b [.border-b]:pb-4">
              <CardTitle className="text-sm">{item.section}</CardTitle>
              <CardDescription>{item.reason}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
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
                  After
                </span>
                <div
                  className={cn(
                    "flex-1 rounded-lg border p-3 transition-colors",
                    improved
                      ? "border-success/30 bg-success/8"
                      : "border-dashed border-border bg-transparent",
                  )}
                >
                  {improved ? (
                    <p className="text-sm leading-relaxed">{item.improved}</p>
                  ) : (
                    <p className="text-sm leading-relaxed text-muted-foreground/70">
                      Run &ldquo;Improve all&rdquo; to generate a stronger rewrite.
                    </p>
                  )}
                </div>

                {improved && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copy(item.id, item.improved)}
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckIcon data-icon="inline-start" />
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
                      onClick={() => regenerate(item.id)}
                      disabled={regenerating === item.id}
                    >
                      <RefreshCwIcon
                        data-icon="inline-start"
                        className={cn(regenerating === item.id && "animate-spin")}
                      />
                      Regenerate
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
