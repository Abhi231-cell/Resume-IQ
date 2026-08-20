import type {
  BulletImprovement,
  Improvement,
  JobMatchResult,
  RecentAnalysis,
  RecommendedJob,
  ResumeAnalysis,
  ResumeVersion,
  ScoreMetric,
} from "@/lib/types"

// Placeholder data used only to render the UI. Swap these exports with real
// API/database calls when the backend is connected — component props are typed
// against lib/types so nothing else needs to change.

export const RESUME_HEALTH = 84

export const DASHBOARD_METRICS: ScoreMetric[] = [
  { key: "ats", label: "ATS Compatibility", score: 91, summary: "Parses cleanly" },
  { key: "content", label: "Content Quality", score: 78, summary: "Add impact metrics" },
  { key: "skills", label: "Skills Match", score: 86, summary: "Strong overlap" },
  { key: "experience", label: "Experience Quality", score: 82, summary: "Well structured" },
]

export const PRIORITY_IMPROVEMENTS: Improvement[] = [
  {
    id: "imp-1",
    title: "Add measurable achievements",
    description: "Quantify results with numbers, percentages and outcomes.",
    priority: "high",
  },
  {
    id: "imp-2",
    title: "Improve professional summary",
    description: "Lead with your strongest value proposition in two lines.",
    priority: "medium",
  },
  {
    id: "imp-3",
    title: "Add missing keywords",
    description: "Include role-specific terms that ATS systems scan for.",
    priority: "medium",
  },
]

export const RECENT_ANALYSES: RecentAnalysis[] = [
  { id: "ra-1", resumeName: "Senior_Frontend_2026.pdf", createdAt: "2026-08-14", score: 84 },
  { id: "ra-2", resumeName: "Product_Designer_v3.pdf", createdAt: "2026-08-09", score: 77 },
  { id: "ra-3", resumeName: "Fullstack_Engineer.pdf", createdAt: "2026-08-02", score: 71 },
]

export const RECOMMENDED_JOBS: RecommendedJob[] = [
  { id: "rj-1", role: "Senior Frontend Engineer", company: "Northwind", location: "Remote", match: 92 },
  { id: "rj-2", role: "Product Engineer", company: "Lumen Labs", location: "New York, NY", match: 88 },
  { id: "rj-3", role: "UI Engineer", company: "Cadence", location: "Remote", match: 81 },
  { id: "rj-4", role: "Design Engineer", company: "Foundry", location: "San Francisco, CA", match: 76 },
]

export const ANALYSIS: ResumeAnalysis = {
  id: "analysis-1",
  resumeId: "resume-1",
  resumeName: "Senior_Frontend_2026.pdf",
  createdAt: "2026-08-14",
  overallScore: 84,
  metrics: [
    { key: "ats", label: "ATS Compatibility", score: 91 },
    { key: "content", label: "Content Quality", score: 78 },
    { key: "skills", label: "Skills Match", score: 86 },
    { key: "experience", label: "Experience Quality", score: 82 },
    { key: "projects", label: "Project Quality", score: 80 },
    { key: "formatting", label: "Formatting", score: 93 },
  ],
  strengths: [
    "Clear, single-column layout that parses reliably in most ATS platforms.",
    "Strong action verbs open the majority of bullet points.",
    "Relevant, in-demand technical skills are surfaced early.",
    "Consistent formatting and date alignment throughout.",
  ],
  criticalIssues: [
    "Professional summary is generic and lacks a clear specialization.",
    "Only 3 of 14 bullet points include measurable outcomes.",
    "Missing several keywords found in your target job descriptions.",
  ],
  recommendations: [
    "Rewrite the summary to highlight your niche and top achievement.",
    "Add metrics (%, $, time saved) to at least 8 more bullet points.",
    "Incorporate the missing keywords naturally into experience.",
    "Group skills by category for faster scanning.",
  ],
  missingKeywords: [
    "TypeScript",
    "CI/CD",
    "Accessibility",
    "Design Systems",
    "GraphQL",
    "Performance",
  ],
  skillGaps: ["Kubernetes", "System Design", "Rust"],
  weakBullets: [
    {
      id: "wb-1",
      original: "Worked on a machine learning project.",
      issue: "Vague, no tools, scope or measurable result.",
      improved:
        "Developed a machine learning classification model using Python and Scikit-learn, improving prediction accuracy by 23%.",
    },
    {
      id: "wb-2",
      original: "Responsible for the company website.",
      issue: "Passive phrasing and no impact.",
      improved:
        "Led a redesign of the company website, cutting page load time by 41% and lifting conversions by 18%.",
    },
  ],
}

export const JOB_MATCH: JobMatchResult = {
  overall: 82,
  breakdown: [
    { label: "Skills Match", score: 88 },
    { label: "Experience Match", score: 76 },
    { label: "Keyword Match", score: 84 },
    { label: "Education Match", score: 95 },
  ],
  matchedSkills: ["React", "TypeScript", "Node.js", "REST APIs", "Testing", "Git"],
  missingSkills: ["GraphQL", "AWS", "Kubernetes"],
  matchedKeywords: ["frontend", "component library", "agile", "code review"],
  missingKeywords: ["CI/CD", "observability", "design systems"],
  recommendations: [
    "Add hands-on GraphQL experience or a related project.",
    "Mention any cloud deployment work, even at a small scale.",
    "Use the exact phrase 'design systems' from the job posting.",
  ],
}

export const IMPROVEMENTS: BulletImprovement[] = [
  {
    id: "bi-1",
    section: "Experience — Acme Corp",
    current: "Worked on a machine learning project.",
    improved:
      "Developed a machine learning classification model using Python and Scikit-learn, improving prediction accuracy by 23%.",
    reason:
      "Names concrete tools, defines scope, and quantifies the outcome — the three things recruiters and ATS scoring look for.",
  },
  {
    id: "bi-2",
    section: "Experience — Northwind",
    current: "Helped the team ship features faster.",
    improved:
      "Introduced a component library and CI pipeline that reduced feature delivery time by 35% across a team of 8 engineers.",
    reason:
      "Turns a vague claim into a measurable, ownership-driven achievement with team scale.",
  },
  {
    id: "bi-3",
    section: "Summary",
    current: "Frontend developer with experience in web development.",
    improved:
      "Senior frontend engineer specializing in performance and accessible design systems, with 6 years shipping products used by millions.",
    reason:
      "Adds specialization, seniority and scale so the reader immediately understands your value.",
  },
]

export interface UserProfile {
  name: string
  email: string
  headline: string
  location: string
  initials: string
}

export const USER_PROFILE: UserProfile = {
  name: "Alex Morgan",
  email: "alex@resumeiq.com",
  headline: "Senior Frontend Engineer",
  location: "Remote",
  initials: "AM",
}

export const RESUME_VERSIONS: ResumeVersion[] = [
  {
    id: "v1",
    label: "Version 1",
    createdAt: "2026-06-02",
    score: 68,
    changeSummary: "Initial upload — baseline analysis.",
  },
  {
    id: "v2",
    label: "Version 2",
    createdAt: "2026-07-11",
    score: 77,
    changeSummary: "Rewrote summary and added metrics to key bullets.",
  },
  {
    id: "v3",
    label: "Version 3",
    createdAt: "2026-08-14",
    score: 86,
    changeSummary: "Added missing keywords and grouped skills by category.",
  },
]
