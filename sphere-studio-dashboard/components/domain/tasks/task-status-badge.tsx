import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS, type TaskStatus } from '@/lib/validators/task'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<TaskStatus, string> = {
  todo:        'bg-slate-100 text-slate-700 border-slate-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  in_review:   'bg-purple-100 text-purple-700 border-purple-200',
  done:        'bg-green-100 text-green-700 border-green-200',
  cancelled:   'bg-gray-100 text-gray-500 border-gray-200',
}

interface TaskStatusBadgeProps {
  status: TaskStatus
  className?: string
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(STATUS_STYLES[status], 'font-medium', className)}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
