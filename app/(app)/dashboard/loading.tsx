import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page intro skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Health + score summary skeleton */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.4fr]">
        <Card>
          <CardHeader className="border-b [.border-b]:pb-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="flex items-center justify-center gap-6 py-8">
            <Skeleton className="size-36 rounded-full" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="justify-between p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="my-2 h-8 w-14" />
            <Skeleton className="h-3 w-28" />
          </Card>
          <Card className="justify-between p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="my-2 h-8 w-14" />
            <Skeleton className="h-3 w-28" />
          </Card>
          <Card className="justify-between p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="my-2 h-8 w-14" />
            <Skeleton className="h-3 w-28" />
          </Card>
          <Card className="sm:col-span-3 p-4">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </Card>
        </div>
      </div>

      {/* Recommendations & recent skeleton */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b [.border-b]:pb-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b [.border-b]:pb-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-52" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-4">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
