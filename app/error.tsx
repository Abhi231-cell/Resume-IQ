"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangleIcon, HomeIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log sanitized error message for client monitoring
    console.error("Application error:", error.message)
  }, [error])

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangleIcon className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">Something went wrong</CardTitle>
            <CardDescription>
              An unexpected error occurred while loading this page. Please try again.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} className="gap-2">
            <RotateCcwIcon className="size-4" />
            Try again
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/" />} className="gap-2">
            <HomeIcon className="size-4" />
            Go to home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
