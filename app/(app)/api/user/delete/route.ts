import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to delete your account." },
        { status: 401 }
      )
    }

    let body: { confirmation?: string } = {}
    try {
      body = await request.json()
    } catch {
      // Body parsing failure handled below
    }

    if (body.confirmation !== "DELETE") {
      return NextResponse.json(
        { error: 'Please confirm account deletion by typing "DELETE".' },
        { status: 400 }
      )
    }

    // 1. Delete all user data from PostgreSQL tables
    const { error: analysesDeleteError } = await supabase
      .from("resume_analyses")
      .delete()
      .eq("user_id", user.id)

    if (analysesDeleteError) {
      console.error("Error deleting user analyses:", analysesDeleteError)
    }

    const { error: resumesDeleteError } = await supabase
      .from("resumes")
      .delete()
      .eq("user_id", user.id)

    if (resumesDeleteError) {
      console.error("Error deleting user resumes:", resumesDeleteError)
    }

    // 2. If Supabase Service Role Key is configured, permanently delete auth user record
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && serviceRoleKey) {
      try {
        const adminSupabase = createAdminClient(supabaseUrl, serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        })
        await adminSupabase.auth.admin.deleteUser(user.id)
      } catch (adminErr) {
        console.error("Admin user deletion error:", adminErr)
      }
    }

    // 3. Sign out session
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: "Account and associated data deleted successfully.",
    })
  } catch (err) {
    console.error("Account deletion error:", err)
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    )
  }
}
