import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS, type ProjectStatus } from '@/lib/validators/project'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<ProjectStatus, string> = {
  planning: 'bg-slate-100 text-slate-700 border-slate-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  in_review: 'bg-purple-100 text-purple-700 border-purple-200',
  in_revision: 'bg-orange-100 text-orange-700 border-orange-200',
  awaiting_feedback: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  complete: 'bg-green-100 text-green-700 border-green-200',
  archived: 'bg-gray-100 text-gray-500 border-gray-200',
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  className?: string
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_STYLES[status], 'font-medium', className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  )
}
