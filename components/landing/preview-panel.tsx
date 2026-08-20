import { CheckCircle2Icon, FileTextIcon, TargetIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScoreRing } from "@/components/score-ring"
import { ScoreBar } from "@/components/score-bar"

export function PreviewPanel() {
  return (
    <div className="relative">
      {/* Main analysis card */}
      <Card className="relative z-10 ring-foreground/10">
        <CardHeader className="border-b [.border-b]:pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileTextIcon className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate">Senior_Frontend_2026.pdf</CardTitle>
              <p className="text-xs text-muted-foreground">Analyzed just now</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pt-1 sm:flex-row sm:items-center">
          <div className="flex items-center justify-center">
            <ScoreRing
              value={84}
              size={132}
              strokeWidth={11}
              sublabel={<span className="text-xs text-muted-foreground">Resume health</span>}
            />
          </div>
          <div className="flex flex-1 flex-col gap-3.5">
            <ScoreBar label="ATS Compatibility" value={91} showLabel={false} />
            <ScoreBar label="Content Quality" value={78} showLabel={false} />
            <ScoreBar label="Skills Match" value={86} showLabel={false} />
          </div>
        </CardContent>
      </Card>

      {/* Floating ATS chip */}
      <Card
        size="sm"
        className="absolute -top-5 -right-3 z-20 hidden w-max animate-in fade-in slide-in-from-top-2 duration-700 sm:block"
      >
        <CardContent className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-success/10 text-success">
            <CheckCircle2Icon className="size-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">ATS score</p>
            <p className="font-mono text-sm font-semibold tabular-nums">91 / 100</p>
          </div>
        </CardContent>
      </Card>

      {/* Floating job match chip */}
      <Card
        size="sm"
        className="absolute -bottom-6 -left-4 z-20 hidden w-max animate-in fade-in slide-in-from-bottom-2 duration-1000 sm:block"
      >
        <CardContent className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <TargetIcon className="size-4" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Top job match</p>
            <p className="font-mono text-sm font-semibold tabular-nums">
              92% <span className="font-sans font-normal text-muted-foreground">fit</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
