import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  company: z.string().max(100, 'Company must be 100 characters or less').optional().or(z.literal('')),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().max(30, 'Phone must be 30 characters or less').optional().or(z.literal('')),
  notes: z.string().max(2000, 'Notes must be 2000 characters or less').optional().or(z.literal('')),
})

export type ClientInput = z.infer<typeof clientSchema>

// Normalise empty strings to null for DB storage
export function normaliseClientInput(data: ClientInput) {
  return {
    name: data.name.trim(),
    company: data.company?.trim() || null,
    email: data.email?.trim() || null,
    phone: data.phone?.trim() || null,
    notes: data.notes?.trim() || null,
  }
}
