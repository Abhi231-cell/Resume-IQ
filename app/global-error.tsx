"use client"

import * as React from "react"
import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("Global application error:", error.message)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans text-zinc-100 antialiased">
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 text-center shadow-xl">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertTriangleIcon className="size-7" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold tracking-tight">System Error</h1>
            <p className="text-sm text-zinc-400">
              A critical error occurred. Please refresh or try reloading the application.
            </p>
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-zinc-100 px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            <RotateCcwIcon className="size-4" />
            Reload application
          </button>
        </div>
      </body>
    </html>
  )
}
