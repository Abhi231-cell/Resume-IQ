import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ImproveLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card>
        <CardContent className="flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
          <Skeleton className="h-9 w-32" />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="border-b [.border-b]:pb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-80" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b [.border-b]:pb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-80" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
