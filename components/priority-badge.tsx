import { cn } from "@/lib/utils"

const STYLES: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/15 text-warning",
  low: "bg-muted text-muted-foreground",
}

const LABELS: Record<string, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: "high" | "medium" | "low"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center gap-1 rounded-full px-2 text-xs font-medium",
        STYLES[priority],
        className,
      )}
    >
      {LABELS[priority]} priority
    </span>
  )
}
