import { FileTextIcon, TargetIcon } from "lucide-react"

import type { ResumeAnalysis } from "@/lib/types"

export function ResumePreview({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <div className="flex flex-col gap-5 rounded-lg bg-background p-5 text-sm ring-1 ring-border">
      <header className="flex flex-col gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <FileTextIcon className="size-4 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">{analysis.resumeName}</h3>
        </div>
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Analysis generated from the uploaded resume
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Strongest areas
        </h4>
        <ul className="flex list-disc flex-col gap-1.5 pl-4 leading-relaxed text-muted-foreground marker:text-primary">
          {analysis.strengths.slice(0, 3).map((strength) => (
            <li key={strength}>{strength}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <TargetIcon className="size-3.5" /> Focus next
        </h4>
        <ul className="flex list-disc flex-col gap-1.5 pl-4 leading-relaxed text-muted-foreground marker:text-destructive">
          {analysis.criticalIssues.slice(0, 3).map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Missing keywords
        </h4>
        <p className="leading-relaxed text-muted-foreground">
          {analysis.missingKeywords.length > 0
            ? analysis.missingKeywords.join(" · ")
            : "No important missing keywords were identified."}
        </p>
      </section>
    </div>
  )
}
