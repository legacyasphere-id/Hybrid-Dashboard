import Link from 'next/link'
import { Calendar, FolderKanban, CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { DeadlineItem } from '@/services/dashboard'

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr + 'T00:00:00')
  return Math.round((due.getTime() - today.getTime()) / 86_400_000)
}

function dueBadge(days: number) {
  if (days < 0)  return <Badge variant="outline" className="border-red-200 bg-red-100 text-red-700 text-xs">Overdue</Badge>
  if (days === 0) return <Badge variant="outline" className="border-orange-200 bg-orange-100 text-orange-700 text-xs">Today</Badge>
  if (days <= 3) return <Badge variant="outline" className="border-yellow-200 bg-yellow-100 text-yellow-700 text-xs">{days}d</Badge>
  return <Badge variant="outline" className="text-xs text-muted-foreground">{days}d</Badge>
}

interface UpcomingDeadlinesProps {
  items: DeadlineItem[]
}

export function UpcomingDeadlines({ items }: UpcomingDeadlinesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Calendar className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No upcoming deadlines. Add due dates to projects and tasks.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const days = daysUntil(item.due_date)
              const href = item.type === 'project'
                ? `/projects/${item.id}`
                : `/tasks/${item.id}`
              const Icon = item.type === 'project' ? FolderKanban : CheckSquare

              return (
                <li key={`${item.type}-${item.id}`} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <Link href={href} className="truncate text-sm font-medium hover:underline">
                        {item.title}
                      </Link>
                      {item.project_name && (
                        <p className="truncate text-xs text-muted-foreground">{item.project_name}</p>
                      )}
                    </div>
                  </div>
                  {dueBadge(days)}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function UpcomingDeadlinesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-5 w-44" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
