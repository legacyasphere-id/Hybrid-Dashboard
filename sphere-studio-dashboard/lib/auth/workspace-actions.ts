'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { workspaceSchema } from '@/lib/validators/auth'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function createWorkspace(
  data: { name: string },
): Promise<{ error: string } | never> {
  const parsed = workspaceSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const baseSlug = toSlug(parsed.data.name)

  // Ensure slug uniqueness
  let slug = baseSlug
  let counter = 0
  while (true) {
    const { data: existing } = await supabase
      .from('workspaces')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!existing) break
    counter++
    slug = `${baseSlug}-${counter}`
  }

  // Create the workspace
  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert({ name: parsed.data.name, slug, owner_id: user.id })
    .select('id')
    .single()

  if (wsError || !workspace) {
    return { error: wsError?.message ?? 'Failed to create workspace' }
  }

  const workspaceId = (workspace as { id: string }).id

  // Add creator as owner — policy allows this: user owns the workspace they just created
  const { error: memberError } = await supabase.from('workspace_members').insert({
    workspace_id: workspaceId,
    user_id: user.id,
    role: 'owner',
  })

  if (memberError) return { error: memberError.message }

  redirect('/dashboard')
}
