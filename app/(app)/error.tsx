"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangleIcon, LayoutDashboardIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("App workspace error:", error.message)
  }, [error])

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangleIcon className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-semibold">Unable to load this view</CardTitle>
            <CardDescription>
              We encountered an issue loading your workspace data. You can try refreshing or returning to the dashboard.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} className="gap-2">
            <RotateCcwIcon className="size-4" />
            Try again
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/dashboard" />} className="gap-2">
            <LayoutDashboardIcon className="size-4" />
            Go to dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
