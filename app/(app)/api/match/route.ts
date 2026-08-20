import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { createClient } from "@/lib/supabase/server"
import type { JobMatchResult, ResumeAnalysis } from "@/lib/types"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing from environment variables.")
}

const genAI = new GoogleGenAI({ apiKey: apiKey || "" })

class PublicError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PublicError"
  }
}

function clampScore(value: unknown, fallback = 0): number {
  const num = typeof value === "number" ? value : Number(value)
  if (isNaN(num)) return fallback
  return Math.min(100, Math.max(0, Math.round(num)))
}

function sanitizeStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return []
  return arr
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
}

function validateJobMatch(raw: unknown): JobMatchResult {
  if (!raw || typeof raw !== "object") {
    throw new PublicError("Invalid job match response from AI.")
  }

  const obj = raw as Record<string, unknown>
  const overall = clampScore(obj.overall, 70)

  let breakdown: { label: string; score: number }[] = []
  if (Array.isArray(obj.breakdown)) {
    breakdown = obj.breakdown
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map((item) => ({
        label: String(item.label || "Category"),
        score: clampScore(item.score, overall),
      }))
  }

  if (breakdown.length === 0) {
    breakdown = [
      { label: "Skills Match", score: overall },
      { label: "Experience Match", score: overall },
      { label: "Keyword Match", score: overall },
      { label: "Education & Relevance", score: overall },
    ]
  }

  return {
    overall,
    breakdown,
    matchedSkills: sanitizeStringArray(obj.matchedSkills),
    missingSkills: sanitizeStringArray(obj.missingSkills),
    matchedKeywords: sanitizeStringArray(obj.matchedKeywords),
    missingKeywords: sanitizeStringArray(obj.missingKeywords),
    recommendations: sanitizeStringArray(obj.recommendations),
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to perform job matching." },
        { status: 401 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      )
    }

    let body: { jobDescription?: string; analysisId?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      )
    }

    const jobDescription = (body.jobDescription || "").trim()
    if (!jobDescription || jobDescription.length < 20) {
      return NextResponse.json(
        { error: "Please provide a job description of at least 20 characters." },
        { status: 400 }
      )
    }

    if (jobDescription.length > 20000) {
      return NextResponse.json(
        { error: "Job description is too long (maximum 20,000 characters)." },
        { status: 400 }
      )
    }

    // Fetch candidate resume analysis from Supabase
    let query = supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", user.id)

    if (body.analysisId) {
      query = query.eq("id", body.analysisId)
    } else {
      query = query.order("created_at", { ascending: false }).limit(1)
    }

    const { data: analysisData, error: analysisError } = await query.maybeSingle()

    if (analysisError || !analysisData) {
      return NextResponse.json(
        { error: "No resume analysis found. Please upload and analyze a resume first." },
        { status: 404 }
      )
    }

    const structuredResume = (analysisData.structured_resume as ResumeAnalysis) || null
    const strengths = Array.isArray(analysisData.strengths) ? analysisData.strengths : []
    const missingKeywords = Array.isArray(analysisData.missing_keywords) ? analysisData.missing_keywords : []
    const skillGaps = Array.isArray(analysisData.skill_gaps) ? analysisData.skill_gaps : []
    const resumeName = structuredResume?.resumeName || "Candidate Resume"

    const prompt = `You are an expert technical recruiter and Applicant Tracking System (ATS) matching specialist.
Evaluate the candidate's resume against the target job description.

Candidate Resume Details:
- Name / Title: ${resumeName}
- Overall Resume Score: ${analysisData.overall_score ?? "N/A"}/100
- Known Strengths: ${JSON.stringify(strengths)}
- Current Skill Gaps: ${JSON.stringify(skillGaps)}
- Missing Keywords: ${JSON.stringify(missingKeywords)}
- Full Structured Analysis: ${JSON.stringify(structuredResume || {})}

Target Job Description:
"""
${jobDescription}
"""

Task:
1. Calculate the overall fit score (integer 0-100).
2. Generate category breakdown scores:
   - "Skills Match" (0-100): Direct overlap of technical skills, frameworks, languages, and competencies.
   - "Experience Match" (0-100): Alignment with required seniority, responsibilities, and domain scope.
   - "Keyword Match" (0-100): Density and relevance of key industry phrases and tool names.
   - "Education & Relevance" (0-100): Educational background, credentials, and domain applicability.
3. Extract "matchedSkills": Array of strings representing skills present in BOTH the resume and job description.
4. Extract "missingSkills": Array of strings representing crucial skills demanded by the job description but absent from the resume.
5. Extract "matchedKeywords": Key domain/industry keywords found in both.
6. Extract "missingKeywords": Critical keywords mentioned in the job description that the candidate should add.
7. Provide "recommendations": 3-5 concise, concrete suggestions explaining how the candidate can optimize their resume for this specific position.

JSON Output Schema:
{
  "overall": number,
  "breakdown": [
    { "label": "Skills Match", "score": number },
    { "label": "Experience Match", "score": number },
    { "label": "Keyword Match", "score": number },
    { "label": "Education & Relevance", "score": number }
  ],
  "matchedSkills": string[],
  "missingSkills": string[],
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "recommendations": string[]
}

Output JSON only. Do not include markdown code fences or explanatory text.`

    const result = await genAI.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    })

    const responseText = result.text ?? ""
    if (!responseText.trim()) {
      throw new PublicError("Gemini returned an empty response.")
    }

    let parsedJson: unknown
    try {
      parsedJson = JSON.parse(responseText)
    } catch {
      const cleaned = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim()
      try {
        parsedJson = JSON.parse(cleaned)
      } catch {
        throw new PublicError("Gemini returned invalid JSON for job matching.")
      }
    }

    const validatedMatch = validateJobMatch(parsedJson)

    return NextResponse.json({
      match: validatedMatch,
      analysisId: analysisData.id,
      resumeName,
    })
  } catch (err) {
    if (err instanceof PublicError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    console.error("Job match error:", err)
    return NextResponse.json(
      { error: "Failed to process job match analysis. Please try again." },
      { status: 500 }
    )
  }
}
