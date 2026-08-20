import {
  BarChart3Icon,
  FileSearchIcon,
  GaugeIcon,
  PencilRulerIcon,
  ShieldCheckIcon,
  TargetIcon,
} from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FEATURES = [
  {
    icon: GaugeIcon,
    title: "ATS optimization",
    description:
      "See exactly how applicant tracking systems read your resume and fix what breaks parsing.",
  },
  {
    icon: FileSearchIcon,
    title: "Deep content analysis",
    description:
      "Get a category-by-category breakdown of content, formatting, skills and experience quality.",
  },
  {
    icon: TargetIcon,
    title: "Job matching",
    description:
      "Paste any job description and measure your fit across skills, keywords and experience.",
  },
  {
    icon: PencilRulerIcon,
    title: "Smart rewrites",
    description:
      "Turn weak, vague bullet points into measurable, recruiter-ready achievements in one click.",
  },
  {
    icon: BarChart3Icon,
    title: "Progress tracking",
    description:
      "Track every version of your resume and watch your score climb over time.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Private by default",
    description:
      "Your documents are yours. Analyze with confidence and delete anything, anytime.",
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything you need to stand out
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground text-pretty">
            ResumeIQ analyzes your resume the way recruiters and hiring software actually do — then
            shows you precisely how to improve.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="transition-colors hover:bg-accent/40">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="mt-3 text-base">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
