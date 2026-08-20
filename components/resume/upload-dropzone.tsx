"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  FileTextIcon,
  LoaderIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { ResumeAnalysis } from "@/lib/types"

const STEPS = [
  "Extracting text and sections",
  "Running ATS compatibility checks",
  "Scoring content and skills",
  "Preparing recommendations",
]

type AnalyzeErrorResponse = { error?: string; details?: string }

function getErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback

  const response = data as AnalyzeErrorResponse
  return response.details ?? response.error ?? fallback
}

export function UploadDropzone() {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [dragging, setDragging] = React.useState(false)
  const [analyzing, setAnalyzing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const [completedAnalysisId, setCompletedAnalysisId] = React.useState<string | null>(null)

  const activeStep = Math.min(STEPS.length - 1, Math.floor(progress / (100 / STEPS.length)))

  function handleFiles(files: FileList | null) {
    const picked = files?.[0]
    if (!picked) return
    const valid = picked.type === "application/pdf" || /\.pdf$/i.test(picked.name)
    if (!valid) {
      toast.error("Unsupported file", { description: "Please upload a PDF file." })
      return
    }
    setFile(picked)
  }

  async function startAnalysis() {
    if (!file) return

    setAnalyzing(true)
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const rawResponse = await response.text()
      let data: unknown = null

      try {
        data = JSON.parse(rawResponse) as unknown
      } catch {
        // The API is expected to return JSON; retain the raw response for the error below.
      }

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, rawResponse || `API failed with status ${response.status}`),
        )
      }

      const analysis = data as ResumeAnalysis

      // Save the real Gemini analysis for the Analysis page
      sessionStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(analysis)
      )

      setCompletedAnalysisId(analysis.id)
      setProgress(100)
    } catch (error) {
      console.warn("Resume analysis failed:", error)

      toast.error("Analysis failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      })

      setAnalyzing(false)
      setProgress(0)
    }
  }

  React.useEffect(() => {
    if (analyzing && progress >= 100) {
      const timeout = setTimeout(() => {
        toast.success("Analysis complete", { description: "Here's your full breakdown." })
        router.push(completedAnalysisId ? `/analysis?id=${completedAnalysisId}` : "/analysis")
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [analyzing, progress, completedAnalysisId, router])

  if (analyzing) 
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LoaderIcon className="size-7 animate-spin" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-medium">Analyzing {file?.name}</p>
            <p className="text-sm text-muted-foreground">
              This usually takes a few seconds.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Progress value={progress} />
          </div>
          <ul className="flex w-full max-w-sm flex-col gap-2 text-left">
            {STEPS.map((step, i) => (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  i <= activeStep ? "text-foreground" : "text-muted-foreground/60",
                )}
              >
                {i < activeStep ? (
                  <span className="flex size-4 items-center justify-center rounded-full bg-success/15 text-success">
                    <svg viewBox="0 0 24 24" className="size-3" fill="none">
                      <path
                        d="m5 13 4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : i === activeStep ? (
                  <LoaderIcon className="size-4 animate-spin text-primary" />
                ) : (
                  <span className="size-4 rounded-full border border-current" />
                )}
                {step}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card p-10 text-center transition-colors outline-none hover:border-primary/50 hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          dragging && "border-primary bg-accent/60",
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UploadCloudIcon className="size-7" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-medium">
            Drop your resume here, or <span className="text-primary">browse</span>
          </p>
          <p className="text-sm text-muted-foreground">Supports PDF files up to 10MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {file && (
        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileTextIcon className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove file"
              onClick={() => setFile(null)}
            >
              <XIcon />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button size="lg" disabled={!file} onClick={startAnalysis}>
          Analyze resume
        </Button>
      </div>
    </div>
  )
}
