"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { scoreTone, scoreLabel } from "@/lib/score"

const toneBg: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
}

interface ScoreBarProps {
  label: string
  value: number // 0 - 100
  className?: string
  showLabel?: boolean
}

export function ScoreBar({ label, value, className, showLabel = true }: ScoreBarProps) {
  const [width, setWidth] = React.useState(0)
  const tone = scoreTone(value)

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setWidth(value))
    return () => cancelAnimationFrame(raf)
  }, [value])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="flex items-baseline gap-1.5">
          <span className="font-mono text-sm font-semibold tabular-nums">{value}</span>
          {showLabel && (
            <span className="text-xs text-muted-foreground">{scoreLabel(value)}</span>
          )}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", toneBg[tone])}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
