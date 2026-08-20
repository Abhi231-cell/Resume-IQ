import { createClient } from "@/lib/supabase/server"
import type { PersistedResumeAnalysis } from "@/lib/types"
import { toPersistedAnalysis, type ResumeAnalysisRow } from "@/lib/analyses"

export async function getUserAnalyses(): Promise<PersistedResumeAnalysis[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("resume_analyses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error("Unable to load resume analyses.")
  }

  return ((data ?? []) as unknown as ResumeAnalysisRow[]).map(toPersistedAnalysis)
}

export async function getAnalysisById(id: string): Promise<PersistedResumeAnalysis | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !id) return null

  const { data, error } = await supabase
    .from("resume_analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return toPersistedAnalysis(data as unknown as ResumeAnalysisRow)
}
