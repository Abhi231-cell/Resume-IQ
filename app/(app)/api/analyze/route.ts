import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ResumeAnalysis, ScoreCategory } from "@/lib/types";

export const runtime = "nodejs";

const METRICS = [
  { key: "ats", label: "ATS Compatibility" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "education", label: "Education" },
  { key: "formatting", label: "Formatting" },
] as const;

class PublicError extends Error {}

function isScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

type ValidatedAnalysis = Omit<ResumeAnalysis, "resumeId">

function validateAnalysis(value: unknown): ValidatedAnalysis {
  if (!value || typeof value !== "object") {
      throw new PublicError("Gemini returned an invalid analysis object.");
  }

  const analysis = value as Record<string, unknown>;
  if (!isScore(analysis.overallScore) || !isStringArray(analysis.strengths) ||
    !isStringArray(analysis.criticalIssues) || !isStringArray(analysis.recommendations) ||
    !isStringArray(analysis.missingKeywords) || !isStringArray(analysis.skillGaps) ||
    !Array.isArray(analysis.metrics) || !Array.isArray(analysis.weakBullets)) {
    throw new PublicError("Gemini returned an analysis with an unexpected format.");
  }

  const rawMetrics = analysis.metrics as unknown[];
  const rawWeakBullets = analysis.weakBullets as unknown[];

  const metrics = METRICS.map((metric) => {
    const result = rawMetrics.find((item) => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      return candidate.key === metric.key && isScore(candidate.score);
    }) as Record<string, unknown> | undefined;

    if (!result) {
      throw new PublicError(`Gemini did not return the ${metric.label} score.`);
    }

    return { ...metric, score: result.score as number };
  });

  const weakBullets = rawWeakBullets.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new PublicError("Gemini returned an invalid weak-bullet item.");
    }
    const bullet = item as Record<string, unknown>;
    if (typeof bullet.original !== "string" || typeof bullet.issue !== "string" ||
      typeof bullet.improved !== "string") {
      throw new PublicError("Gemini returned an incomplete weak-bullet item.");
    }
    return {
      id: typeof bullet.id === "string" && bullet.id ? bullet.id : `weak-bullet-${index + 1}`,
      original: bullet.original,
      issue: bullet.issue,
      improved: bullet.improved,
    };
  });

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    resumeName: typeof analysis.resumeName === "string" && analysis.resumeName.trim()
      ? analysis.resumeName.trim()
      : "Resume",
    overallScore: analysis.overallScore,
    metrics,
    strengths: analysis.strengths,
    criticalIssues: analysis.criticalIssues,
    recommendations: analysis.recommendations,
    missingKeywords: analysis.missingKeywords,
    skillGaps: analysis.skillGaps,
    weakBullets,
  };
}

function metricScore(analysis: Pick<ResumeAnalysis, "metrics">, key: ScoreCategory): number | null {
  return analysis.metrics.find((metric) => metric.key === key)?.score ?? null
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenAI({ apiKey: apiKey || "" });

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to analyze a resume." },
        { status: 401 }
      );
    }

    // Check API key
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    // Read uploaded form data
    const formData = await request.formData();
    const file = formData.get("file");

    // Check file
    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No resume file was provided.",
        },
        { status: 400 }
      );
    }

    // Check file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          error: "Please upload a PDF resume.",
        },
        { status: 400 }
      );
    }

    // Check file size - 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Resume file must be smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    // Verify the uploaded bytes are actually a PDF before sending them to the AI provider.
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    if (fileBuffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
      return NextResponse.json(
        { error: "Please upload a valid PDF resume." },
        { status: 400 }
      );
    }

    const base64Data = fileBuffer.toString("base64");

    const prompt = `
You are an expert resume analyzer and career advisor.

Analyze the uploaded resume carefully.

Return ONLY valid JSON.

The JSON must follow this exact structure:

{
  "resumeName": "string",
  "overallScore": 0,
  "metrics": [
    {
      "key": "ats",
      "label": "ATS Compatibility",
      "score": 0
    },
    {
      "key": "skills",
      "label": "Skills",
      "score": 0
    },
    {
      "key": "experience",
      "label": "Experience",
      "score": 0
    },
    {
      "key": "projects",
      "label": "Projects",
      "score": 0
    },
    {
      "key": "education",
      "label": "Education",
      "score": 0
    },
    {
      "key": "formatting",
      "label": "Formatting",
      "score": 0
    }
  ],
  "strengths": [],
  "criticalIssues": [],
  "recommendations": [],
  "missingKeywords": [],
  "skillGaps": [],
  "weakBullets": [
    {
      "id": "string",
      "original": "string",
      "issue": "string",
      "improved": "string"
    }
  ]
}

Rules:

1. overallScore must be a number between 0 and 100.

2. Every metric score must be between 0 and 100.

3. Analyze the actual uploaded resume.

4. Do NOT invent experience, projects, skills, education, certifications or achievements.

5. Identify genuine weaknesses.

6. Give practical recommendations.

7. Identify missing keywords relevant to the resume.

8. Identify skill gaps only when they are genuinely missing or weak.

9. Rewrite weak resume bullets when appropriate.

10. If information is missing from the resume, explicitly mention that it is missing.

11. resumeName should be the name of the person from the resume if available. Otherwise use "Resume".

12. Return JSON only.

13. Do not use markdown.

14. Do not put the JSON inside a code block.
`;

    // Send prompt + PDF using the current Google Gen AI SDK.
    const result = await genAI.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Data,
          },
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = result.text ?? "";

    if (!responseText.trim()) {
      throw new PublicError("Gemini returned an empty response.");
    }

    // Parse JSON
    let analysis;

    try {
      analysis = JSON.parse(responseText);
    } catch {
      // Try removing markdown code fences just in case
      const cleaned = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      try {
        analysis = JSON.parse(cleaned);
      } catch {
        throw new PublicError(
          "Gemini returned invalid JSON."
        );
      }
    }

    const validatedAnalysis = validateAnalysis(analysis);

    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        name: validatedAnalysis.resumeName,
        original_filename: file.name,
        status: "uploaded",
      })
      .select("id")
      .single();

    if (resumeError || !resume) {
      console.error("Failed to create resume record.", resumeError);
      throw new PublicError("Your resume could not be saved. Please try again.");
    }

    const persistedAnalysis: ResumeAnalysis = {
      ...validatedAnalysis,
      resumeId: resume.id,
    };

    const { error: persistenceError } = await supabase
      .from("resume_analyses")
      .insert({
        id: persistedAnalysis.id,
        resume_id: persistedAnalysis.resumeId,
        user_id: user.id,
        overall_score: persistedAnalysis.overallScore,
        ats_score: metricScore(persistedAnalysis, "ats"),
        content_score: null,
        skills_score: metricScore(persistedAnalysis, "skills"),
        experience_score: metricScore(persistedAnalysis, "experience"),
        projects_score: metricScore(persistedAnalysis, "projects"),
        formatting_score: metricScore(persistedAnalysis, "formatting"),
        strengths: persistedAnalysis.strengths,
        critical_issues: persistedAnalysis.criticalIssues,
        recommendations: persistedAnalysis.recommendations,
        missing_keywords: persistedAnalysis.missingKeywords,
        skill_gaps: persistedAnalysis.skillGaps,
        weak_bullets: persistedAnalysis.weakBullets,
        structured_resume: persistedAnalysis,
        created_at: persistedAnalysis.createdAt,
      });

    if (persistenceError) {
      console.error("Failed to persist resume analysis.", persistenceError);
      throw new PublicError("Your analysis could not be saved. Please try again.");
    }

    return NextResponse.json(persistedAnalysis, {
      status: 200,
    });

  } catch (error) {
    console.error("Resume analysis failed.", error);

    const errorMessage = error instanceof PublicError
      ? error.message
      : "Unable to analyze this resume right now. Please try again.";

    return NextResponse.json(
      {
        error: "Failed to analyze the resume.",
        details: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}
