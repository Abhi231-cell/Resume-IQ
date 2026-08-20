import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    q: "What file formats can I upload?",
    a: "ResumeIQ accepts PDF and DOCX files. We extract the text and structure while preserving the meaning of each section.",
  },
  {
    q: "How does the ATS score work?",
    a: "We evaluate your resume against the checks that mirror how applicant tracking systems parse and rank documents — including structure, headings, fonts and keyword coverage.",
  },
  {
    q: "Is job matching accurate?",
    a: "Paste any job description and we compare your resume across skills, keywords, experience and education to produce a fit score with clear, actionable gaps.",
  },
  {
    q: "Will my data stay private?",
    a: "Your resume belongs to you. You control what is stored and can delete your documents and account at any time from settings.",
  },
  {
    q: "Do I need to pay to try it?",
    a: "You can run your first full analysis for free. Upgrade later for unlimited analyses, job matching and version history.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground text-pretty">
            Everything you need to know about analyzing and improving your resume with ResumeIQ.
          </p>
        </div>

        <Accordion className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={faq.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-base">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
