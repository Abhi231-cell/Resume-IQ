import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SupabaseTestPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase
    .from("resume_analyses")
    .select("id")
    .limit(1)

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Supabase Connection Diagnostics</h1>

      {error ? (
        <>
          <h2>❌ Database query failed</h2>
          <p>Unable to connect to the database. Please check your Supabase configuration.</p>
        </>
      ) : (
        <>
          <h2>✅ Supabase connected successfully!</h2>
          <p>Authenticated session verified for {user.email}.</p>
        </>
      )}
    </main>
  )
}