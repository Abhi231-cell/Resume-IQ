import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

function sanitizeNextPath(next: string | null): string {
  if (!next) return "/dashboard"
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return "/dashboard"
  }

  try {
    const parsed = new URL(next, "http://localhost")
    if (parsed.origin !== "http://localhost") {
      return "/dashboard"
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return "/dashboard"
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const destination = sanitizeNextPath(url.searchParams.get("next"))
  const response = NextResponse.redirect(new URL(destination, url.origin))

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      },
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return response
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin))
}
