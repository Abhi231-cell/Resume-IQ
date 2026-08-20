import type { PersistedResumeAnalysis, ResumeAnalysis, WeakBullet } from "@/lib/types"

export type ResumeAnalysisRow = {
  id: string
  resume_id: string
  user_id: string
  overall_score: number | null
  ats_score: number | null
  content_score: number | null
  skills_score: number | null
  experience_score: number | null
  projects_score: number | null
  formatting_score: number | null
  strengths: string[]
  critical_issues: string[]
  recommendations: string[]
  missing_keywords: string[]
  skill_gaps: string[]
  weak_bullets: WeakBullet[]
  structured_resume: ResumeAnalysis | null
  created_at: string
}

export function toPersistedAnalysis(row: Partial<ResumeAnalysisRow>): PersistedResumeAnalysis {
  return {
    id: row.id ?? "",
    resumeId: row.resume_id ?? "",
    userId: row.user_id ?? "",
    overallScore: row.overall_score ?? null,
    atsScore: row.ats_score ?? null,
    contentScore: row.content_score ?? null,
    skillsScore: row.skills_score ?? null,
    experienceScore: row.experience_score ?? null,
    projectsScore: row.projects_score ?? null,
    formattingScore: row.formatting_score ?? null,
    strengths: row.strengths ?? [],
    criticalIssues: row.critical_issues ?? [],
    recommendations: row.recommendations ?? [],
    missingKeywords: row.missing_keywords ?? [],
    skillGaps: row.skill_gaps ?? [],
    weakBullets: row.weak_bullets ?? [],
    structuredResume: row.structured_resume ?? null,
    createdAt: row.created_at ?? new Date().toISOString(),
  }
}

export function asResumeAnalysis(analysis: PersistedResumeAnalysis): ResumeAnalysis {
  if (analysis.structuredResume) return analysis.structuredResume

  return {
    id: analysis.id,
    resumeId: analysis.resumeId,
    resumeName: "Resume",
    createdAt: analysis.createdAt,
    overallScore: analysis.overallScore ?? 0,
    metrics: [
      { key: "ats", label: "ATS Compatibility", score: analysis.atsScore ?? 0 },
      { key: "skills", label: "Skills", score: analysis.skillsScore ?? 0 },
      { key: "experience", label: "Experience", score: analysis.experienceScore ?? 0 },
      { key: "projects", label: "Projects", score: analysis.projectsScore ?? 0 },
      { key: "formatting", label: "Formatting", score: analysis.formattingScore ?? 0 },
    ],
    strengths: analysis.strengths,
    criticalIssues: analysis.criticalIssues,
    recommendations: analysis.recommendations,
    missingKeywords: analysis.missingKeywords,
    skillGaps: analysis.skillGaps,
    weakBullets: analysis.weakBullets,
  }
}
