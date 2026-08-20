import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-4.5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 4h6.5L18 8.5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="opacity-90"
        />
        <path
          d="M13 4v4.5h4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="opacity-90"
        />
        <path
          d="m8.5 14.5 1.8 1.8 3.7-3.9"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="text-base font-semibold tracking-tight">
          Resume<span className="text-primary">IQ</span>
        </span>
      )}
    </span>
  )
}
