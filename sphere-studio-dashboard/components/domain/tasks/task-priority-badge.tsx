import { Badge } from '@/components/ui/badge'
import { PRIORITY_LABELS, type TaskPriority } from '@/lib/validators/task'
import { cn } from '@/lib/utils'

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low:    'bg-slate-100 text-slate-600 border-slate-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high:   'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200',
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

export function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
  return (
    <Badge variant="outline" className={cn(PRIORITY_STYLES[priority], 'font-medium', className)}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  )
}
