import Link from "next/link"
import { ArrowRightIcon, CheckCircle2Icon, PlayIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PreviewPanel } from "@/components/landing/preview-panel"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,var(--accent),transparent)] opacity-70"
      />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="outline" className="gap-1.5 bg-background/60 py-1 pl-1.5 backdrop-blur">
            <span className="flex size-4 items-center justify-center rounded-full bg-primary/15 text-primary">
              <SparklesIcon className="size-2.5" />
            </span>
            AI resume intelligence for 2026
          </Badge>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Build a resume that gets noticed.
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            AI-powered resume analysis, ATS optimization and job matching built for the modern
            hiring process.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/upload" />}>
              Analyze my resume
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<a href="#how-it-works" />}
            >
              <PlayIcon data-icon="inline-start" />
              See how it works
            </Button>
          </div>

          <ul className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
            {[
              "ATS compatibility check",
              "Job description matching",
              "AI bullet rewrites",
            ].map((capability) => (
              <li key={capability} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2Icon className="size-4 shrink-0 text-primary" />
                {capability}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pl-6">
          <PreviewPanel />
        </div>
      </div>
    </section>
  )
}
