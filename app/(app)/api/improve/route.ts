import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit"
import type { BulletImprovement, ResumeAnalysis, WeakBullet } from "@/lib/types"

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

function sanitizeString(val: unknown, fallback = ""): string {
  if (typeof val === "string") return val.trim()
  return fallback
}

function validateBulletImprovement(raw: unknown, index = 1): BulletImprovement {
  if (!raw || typeof raw !== "object") {
    throw new PublicError("Invalid bullet improvement structure.")
  }

  const obj = raw as Record<string, unknown>
  return {
    id: sanitizeString(obj.id, `bi-${index}`),
    section: sanitizeString(obj.section, "Experience"),
    current: sanitizeString(obj.current, "Previous phrasing"),
    improved: sanitizeString(obj.improved, "Improved action-oriented achievement phrasing."),
    reason: sanitizeString(
      obj.reason,
      "Quantifies outcome and emphasizes active ownership for ATS optimization."
    ),
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
        { error: "You must be signed in to generate resume improvements." },
        { status: 401 }
      )
    }

    // Rate Limiting: max 20 requests per minute (60s)
    const clientKey = getClientIdentifier(request, user.id)
    const rateCheck = checkRateLimit({
      key: `improve:${clientKey}`,
      limit: 20,
      windowSeconds: 60,
    })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Maximum 20 rewrites per minute. Please try again in ${rateCheck.resetInSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.resetInSeconds),
          },
        }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      )
    }

    let body: {
      analysisId?: string
      current?: string
      section?: string
      bulletId?: string
    } = {}

    try {
      body = await request.json()
    } catch {
      // Empty body is acceptable; will default to latest analysis batch improvement
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
    const criticalIssues = Array.isArray(analysisData.critical_issues)
      ? analysisData.critical_issues
      : []
    const weakBullets = Array.isArray(analysisData.weak_bullets)
      ? (analysisData.weak_bullets as unknown as WeakBullet[])
      : []
    const resumeName = structuredResume?.resumeName || "Candidate Resume"

    // Single bullet regeneration mode
    if (body.current && body.current.trim().length > 0) {
      const currentBullet = body.current.trim()
      const section = body.section?.trim() || "Experience"
      const bulletId = body.bulletId || "bi-custom"

      const singlePrompt = `You are an elite executive resume writer and ATS optimization expert.
Candidate Resume: ${resumeName}
Context Strengths: ${JSON.stringify(strengths)}

Section: ${section}
Current Weak Line: "${currentBullet}"

Task:
Generate a powerful, alternative rewrite following the Google X-Y-Z formula ("Accomplished [X] as measured by [Y], by doing [Z]").
Ensure it highlights metrics, business impact, and concrete tools or technologies.

Output strict JSON schema:
{
  "id": "${bulletId}",
  "section": "${section}",
  "current": "${currentBullet.replace(/"/g, '\\"')}",
  "improved": "Action-oriented quantified rewrite",
  "reason": "Clear explanation of why this rewrite increases recruiter interest and ATS rank"
}

Output JSON only. Do not use Markdown code fences.`

      const result = await genAI.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [{ text: singlePrompt }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      })

      const responseText = result.text ?? ""
      if (!responseText.trim()) {
        throw new PublicError("Gemini returned an empty response.")
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(responseText)
      } catch {
        const cleaned = responseText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim()
        parsed = JSON.parse(cleaned)
      }

      const validated = validateBulletImprovement(parsed, 1)
      return NextResponse.json({
        improvement: validated,
        resumeName,
        analysisId: analysisData.id,
      })
    }

    // Batch improvements mode
    const batchPrompt = `You are an elite executive resume writer and ATS optimization specialist.
Analyze this candidate's resume analysis and produce 4 to 6 high-impact bullet point improvements across sections such as Experience, Summary, or Projects.

Candidate Resume Context:
- Name / Title: ${resumeName}
- Strengths: ${JSON.stringify(strengths)}
- Critical Issues: ${JSON.stringify(criticalIssues)}
- Known Weak Bullets: ${JSON.stringify(weakBullets)}
- Structured Resume Content: ${JSON.stringify(structuredResume || {})}

Guidelines for Rewrites:
1. Focus on weak, passive, or unquantified bullet points from their actual background.
2. Follow the Google X-Y-Z formula ("Accomplished [X] as measured by [Y], by doing [Z]").
3. Add realistic metrics (e.g. percentages, team scale, delivery time reduction, uptime, user growth).
4. Give a concise reason explaining why the improvement satisfies recruiters and ATS parsers.

Output JSON adhering strictly to this schema:
{
  "improvements": [
    {
      "id": "bi-1",
      "section": "Experience — [Role or Company]",
      "current": "Original vague or passive line",
      "improved": "Transformed high-impact achievement bullet",
      "reason": "Concise explanation of recruiter appeal"
    }
  ]
}

Output JSON only. Do not include markdown code fences.`

    const result = await genAI.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ text: batchPrompt }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.25,
      },
    })

    const responseText = result.text ?? ""
    if (!responseText.trim()) {
      throw new PublicError("Gemini returned an empty response.")
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(responseText)
    } catch {
      const cleaned = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim()
      parsed = JSON.parse(cleaned)
    }

    const obj = (parsed as Record<string, unknown>) || {}
    let list: BulletImprovement[] = []

    if (Array.isArray(obj.improvements)) {
      list = obj.improvements.map((item, idx) => validateBulletImprovement(item, idx + 1))
    }

    if (list.length === 0 && weakBullets.length > 0) {
      list = weakBullets.map((wb, idx) => ({
        id: wb.id || `bi-${idx + 1}`,
        section: "Experience",
        current: wb.original,
        improved: wb.improved,
        reason: wb.issue,
      }))
    }

    return NextResponse.json({
      improvements: list,
      resumeName,
      analysisId: analysisData.id,
    })
  } catch (err) {
    if (err instanceof PublicError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    console.error("Resume improvement API error:", err)
    return NextResponse.json(
      { error: "Failed to generate resume improvements. Please try again." },
      { status: 500 }
    )
  }
}
