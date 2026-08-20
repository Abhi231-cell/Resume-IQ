"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { scoreTone, toneStroke } from "@/lib/score"

interface ScoreRingProps {
  value: number // 0 - 100
  size?: number
  strokeWidth?: number
  max?: number
  className?: string
  label?: React.ReactNode
  sublabel?: React.ReactNode
}

export function ScoreRing({
  value,
  size = 160,
  strokeWidth = 12,
  max = 100,
  className,
  label,
  sublabel,
}: ScoreRingProps) {
  const [progress, setProgress] = React.useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(Math.max(progress / max, 0), 1)
  const offset = circumference * (1 - pct)
  const tone = scoreTone((value / max) * 100)

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setProgress(value))
    return () => cancelAnimationFrame(raf)
  }, [value])

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={toneStroke[tone]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label ?? (
          <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight">
            {Math.round(progress)}
          </span>
        )}
        {sublabel}
      </div>
    </div>
  )
}
