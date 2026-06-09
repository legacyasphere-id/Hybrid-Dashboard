import { z } from 'zod'

export const PROJECT_STATUSES = [
  'planning',
  'in_progress',
  'in_review',
  'in_revision',
  'awaiting_feedback',
  'complete',
  'archived',
] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  in_review: 'In Review',
  in_revision: 'In Revision',
  awaiting_feedback: 'Awaiting Feedback',
  complete: 'Complete',
  archived: 'Archived',
}

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be 200 characters or less'),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .or(z.literal('')),
  client_id: z.string().uuid('Select a client').optional().or(z.literal('')),
  status: z.enum(PROJECT_STATUSES),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
})

export type ProjectInput = z.infer<typeof projectSchema>

export function normaliseProjectInput(data: ProjectInput) {
  return {
    name: data.name.trim(),
    description: data.description?.trim() || null,
    client_id: data.client_id?.trim() || null,
    status: data.status,
    due_date: data.due_date?.trim() || null,
  }
}
