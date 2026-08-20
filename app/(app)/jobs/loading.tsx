import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function JobsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card>
          <CardHeader className="border-b [.border-b]:pb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-56 w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex min-h-80 items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="size-12 rounded-2xl" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
