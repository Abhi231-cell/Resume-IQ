import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function HistoryLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Summary stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="justify-between p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="my-2 h-8 w-14" />
          <Skeleton className="h-3 w-28" />
        </Card>
        <Card className="justify-between p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="my-2 h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </Card>
        <Card className="justify-between p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="my-2 h-8 w-12" />
          <Skeleton className="h-3 w-28" />
        </Card>
      </div>

      {/* Progression chart skeleton */}
      <Card>
        <CardHeader className="border-b [.border-b]:pb-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="py-8">
          <Skeleton className="h-44 w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Version timeline skeleton */}
      <Card>
        <CardHeader className="border-b [.border-b]:pb-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-4">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}
