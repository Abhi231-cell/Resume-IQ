import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

const FOOTER_LINKS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Upload resume", href: "/upload" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      {/* CTA band */}
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_100%_0%,rgba(255,255,255,0.18),transparent)]"
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Ready to get noticed?
              </h2>
              <p className="max-w-md text-primary-foreground/80 text-pretty">
                Run your first AI resume analysis in under two minutes — no credit card required.
              </p>
            </div>
            <Button size="lg" variant="secondary" nativeButton={false} render={<Link href="/upload" />}>
              Analyze my resume
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-10 border-t border-border/60 pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered resume analysis, ATS optimization and job matching for the modern hiring
              process.
            </p>
          </div>
          {FOOTER_LINKS.map((col) => (
            <nav key={col.heading} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">{col.heading}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ResumeIQ. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Build a resume that gets noticed.</p>
        </div>
      </div>
    </footer>
  )
}
