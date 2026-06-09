import { z } from 'zod'

export const TASK_STATUSES = ['todo', 'in_progress', 'in_review', 'done', 'cancelled'] as const
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const

export type TaskStatus   = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo:        'To Do',
  in_progress: 'In Progress',
  in_review:   'In Review',
  done:        'Done',
  cancelled:   'Cancelled',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low:    'Low',
  medium: 'Medium',
  high:   'High',
  urgent: 'Urgent',
}

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title must be 300 characters or less'),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .or(z.literal('')),
  project_id: z.string().uuid('Select a project'),
  status:     z.enum(TASK_STATUSES),
  priority:   z.enum(TASK_PRIORITIES),
  assignee_id: z
    .string()
    .uuid()
    .optional()
    .or(z.literal('')),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
})

export type TaskInput = z.infer<typeof taskSchema>

export function normaliseTaskInput(data: TaskInput) {
  return {
    title:       data.title.trim(),
    description: data.description?.trim() || null,
    project_id:  data.project_id,
    status:      data.status,
    priority:    data.priority,
    assignee_id: data.assignee_id?.trim() || null,
    due_date:    data.due_date?.trim() || null,
  }
}
