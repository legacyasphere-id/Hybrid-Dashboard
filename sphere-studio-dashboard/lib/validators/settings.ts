import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
})

export type ProfileInput = z.infer<typeof profileSchema>

export const workspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100, 'Name is too long'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug is too long')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    ),
})

export type WorkspaceInput = z.infer<typeof workspaceSchema>

export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'member'] as const),
})

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>

export const deleteWorkspaceSchema = z.object({
  confirm: z.string(),
})
