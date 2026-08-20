// Shared domain types for ResumeIQ.
// These describe the shape of data the UI expects so a real backend/API
// can be connected later without changing component contracts.

export type ScoreCategory =
  | "ats"
  | "content"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "formatting"

export interface ScoreMetric {
  key: ScoreCategory
  label: string
  score: number // 0 - 100
  summary?: string
}

export interface Improvement {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
}

export interface ResumeAnalysis {
  id: string
  resumeId: string
  resumeName: string
  createdAt: string // ISO date
  overallScore: number
  metrics: ScoreMetric[]
  strengths: string[]
  criticalIssues: string[]
  recommendations: string[]
  missingKeywords: string[]
  skillGaps: string[]
  weakBullets: WeakBullet[]
}

export interface PersistedResumeAnalysis {
  id: string
  resumeId: string
  userId: string
  overallScore: number | null
  atsScore: number | null
  contentScore: number | null
  skillsScore: number | null
  experienceScore: number | null
  projectsScore: number | null
  formattingScore: number | null
  strengths: string[]
  criticalIssues: string[]
  recommendations: string[]
  missingKeywords: string[]
  skillGaps: string[]
  weakBullets: WeakBullet[]
  structuredResume: ResumeAnalysis | null
  createdAt: string
}

export interface WeakBullet {
  id: string
  original: string
  issue: string
  improved: string
}

export interface RecentAnalysis {
  id: string
  resumeName: string
  createdAt: string
  score: number
}

export interface RecommendedJob {
  id: string
  role: string
  company: string
  location: string
  match: number // 0 - 100
}

export interface JobMatchResult {
  overall: number
  breakdown: {
    label: string
    score: number
  }[]
  matchedSkills: string[]
  missingSkills: string[]
  matchedKeywords: string[]
  missingKeywords: string[]
  recommendations: string[]
}

export interface ResumeVersion {
  id: string
  label: string
  createdAt: string
  score: number
  changeSummary: string
}

export interface BulletImprovement {
  id: string
  section: string
  current: string
  improved: string
  reason: string
}
