import Link from "next/link"
import { CheckCircle2Icon } from "lucide-react"

import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

const HIGHLIGHTS = [
  "ATS compatibility scoring in seconds",
  "Job matching against any description you paste",
  "AI rewrites that turn duties into achievements",
]

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_90%_10%,rgba(255,255,255,0.16),transparent)]"
        />
        <div className="relative flex items-center gap-2">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-foreground">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15">
              <span className="text-sm font-semibold">IQ</span>
            </span>
            <span className="text-base font-semibold tracking-tight">ResumeIQ</span>
          </Link>
        </div>

        <div className="relative mt-auto flex flex-col gap-8">
          <h2 className="text-2xl leading-snug font-medium text-balance">
            Understand exactly how recruiters and hiring software read your resume — then fix it.
          </h2>

          <ul className="flex flex-col gap-3 border-t border-primary-foreground/15 pt-8">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <CheckCircle2Icon className="size-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Link href="/" className="lg:hidden">
            <Logo />
          </Link>
          <span className="hidden lg:block" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
