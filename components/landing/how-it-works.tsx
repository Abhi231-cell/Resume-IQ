import { UploadCloudIcon, ScanSearchIcon, RocketIcon } from "lucide-react"

const STEPS = [
  {
    icon: UploadCloudIcon,
    step: "Step 1",
    title: "Upload your resume",
    description:
      "Drop in your PDF resume. ResumeIQ instantly extracts and structures every section.",
  },
  {
    icon: ScanSearchIcon,
    step: "Step 2",
    title: "Get your analysis",
    description:
      "Receive an overall score with detailed breakdowns, strengths and critical issues.",
  },
  {
    icon: RocketIcon,
    step: "Step 3",
    title: "Improve and apply",
    description:
      "Apply AI rewrites, match against jobs, and track your progress until you're ready to apply.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-border/60 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            From upload to offer-ready in minutes
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground text-pretty">
            A guided workflow that takes the guesswork out of your job search.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <step.icon className="size-5.5" />
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden h-px flex-1 bg-gradient-to-r from-border to-transparent md:block"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium tracking-wide text-primary uppercase">
                  {step.step}
                </span>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
