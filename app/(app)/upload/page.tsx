import type { Metadata } from "next"
import { FileSearchIcon, GaugeIcon, SparklesIcon } from "lucide-react"

import { UploadDropzone } from "@/components/resume/upload-dropzone"

export const metadata: Metadata = {
  title: "Analyze resume",
  description: "Upload your resume to get an instant AI-powered analysis.",
}

const WHAT_YOU_GET = [
  {
    icon: GaugeIcon,
    title: "ATS compatibility",
    description: "See how tracking systems parse your resume and what breaks it.",
  },
  {
    icon: FileSearchIcon,
    title: "Detailed scoring",
    description: "Category-by-category breakdown of content, skills and formatting.",
  },
  {
    icon: SparklesIcon,
    title: "Actionable fixes",
    description: "Prioritized recommendations and AI rewrites for weak bullets.",
  },
]

export default function UploadPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Analyze your resume</h2>
        <p className="text-sm text-muted-foreground">
          Upload a PDF to get an instant, detailed analysis.
        </p>
      </div>

      <UploadDropzone />

      <div className="grid gap-4 sm:grid-cols-3">
        {WHAT_YOU_GET.map((item) => (
          <div key={item.title} className="flex flex-col gap-2 rounded-xl border border-border p-4">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="size-4.5" />
            </span>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
