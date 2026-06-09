import { StatCardSkeleton } from '@/components/dashboard/stat-card'
import { RecentActivitySkeleton } from '@/components/dashboard/recent-activity'
import { UpcomingDeadlinesSkeleton } from '@/components/dashboard/upcoming-deadlines'

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-1.5 h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <UpcomingDeadlinesSkeleton />
        <RecentActivitySkeleton />
      </div>
    </div>
  )
}
