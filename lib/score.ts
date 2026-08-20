// Maps a 0-100 score to a semantic tone used across the app.

export type ScoreTone = "success" | "warning" | "destructive"

export function scoreTone(score: number): ScoreTone {
  if (score >= 80) return "success"
  if (score >= 60) return "warning"
  return "destructive"
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent"
  if (score >= 80) return "Strong"
  if (score >= 70) return "Good"
  if (score >= 60) return "Fair"
  return "Needs work"
}

// Tailwind text color class for a given tone.
export const toneText: Record<ScoreTone, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
}

// Stroke color (raw var) for SVG gauges.
export const toneStroke: Record<ScoreTone, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
}
