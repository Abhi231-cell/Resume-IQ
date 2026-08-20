import Link from "next/link"
import { FileQuestionIcon, HomeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FileQuestionIcon className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">Page not found</CardTitle>
            <CardDescription>
              The page you are looking for does not exist or has been moved.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button nativeButton={false} render={<Link href="/" />} className="gap-2">
            <HomeIcon className="size-4" />
            Back to home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
