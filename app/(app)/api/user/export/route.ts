import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to export your data." },
        { status: 401 }
      )
    }

    // Fetch user's resumes
    const { data: resumes, error: resumesError } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (resumesError) {
      console.error("Error fetching resumes for export:", resumesError)
    }

    // Fetch user's analyses
    const { data: analyses, error: analysesError } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (analysesError) {
      console.error("Error fetching analyses for export:", analysesError)
    }

    const exportData = {
      exportVersion: "1.0",
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
        createdAt: user.created_at,
      },
      resumes: resumes || [],
      analyses: analyses || [],
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="resume-iq-export-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    })
  } catch (err) {
    console.error("Data export error:", err)
    return NextResponse.json(
      { error: "Failed to generate account data export. Please try again." },
      { status: 500 }
    )
  }
}
