import { CheckIcon, PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type FindingTone = "success" | "destructive" | "primary"

const FINDING_STYLES: Record<FindingTone, string> = {
  success: "bg-success/12 text-success",
  destructive: "bg-destructive/12 text-destructive",
  primary: "bg-primary/12 text-primary",
}

const FINDING_ICON = {
  success: CheckIcon,
  destructive: XIcon,
  primary: PlusIcon,
}

export function FindingList({
  items,
  tone = "primary",
  className,
}: {
  items: string[]
  tone?: FindingTone
  className?: string
}) {
  const Icon = FINDING_ICON[tone]
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm">
          <span
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
              FINDING_STYLES[tone],
            )}
          >
            <Icon className="size-3" strokeWidth={3} />
          </span>
          <span className="leading-relaxed text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ChipList({
  items,
  tone = "muted",
  className,
}: {
  items: string[]
  tone?: "muted" | "success" | "destructive"
  className?: string
}) {
  const styles: Record<string, string> = {
    muted: "border-border bg-muted/50 text-foreground",
    success: "border-transparent bg-success/12 text-success",
    destructive: "border-transparent bg-destructive/12 text-destructive",
  }
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
            styles[tone],
          )}
        >
          {item}
        </span>
      ))}
    </div>
  )
}
