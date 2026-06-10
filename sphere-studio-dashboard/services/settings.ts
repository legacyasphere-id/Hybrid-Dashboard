import { createClient } from '@/lib/supabase/client'
import type { WorkspaceRole } from '@/types/database'

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function updateProfile(
  userId: string,
  data: { full_name: string },
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('users')
    .update({ full_name: data.full_name })
    .eq('id', userId)
  if (error) throw new Error(error.message)
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })
  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  const avatarUrl = `${data.publicUrl}?t=${Date.now()}`

  const { error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)
  if (updateError) throw new Error(updateError.message)

  return avatarUrl
}

export async function sendPasswordReset(email: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw new Error(error.message)
}

// ─── Workspace ────────────────────────────────────────────────────────────────

export async function updateWorkspace(
  workspaceId: string,
  data: { name: string; slug: string },
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('workspaces')
    .update({ name: data.name, slug: data.slug })
    .eq('id', workspaceId)
  if (error) throw new Error(error.message)
}

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('workspaces').delete().eq('id', workspaceId)
  if (error) throw new Error(error.message)
}

// ─── Members ─────────────────────────────────────────────────────────────────

export interface WorkspaceMember {
  id: string
  user_id: string
  role: WorkspaceRole
  joined_at: string
  full_name: string | null
  email: string
}

export async function fetchWorkspaceMembers(
  workspaceId: string,
): Promise<WorkspaceMember[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workspace_members')
    .select(
      'id, user_id, role, joined_at, users!workspace_members_user_id_fkey(full_name, email)',
    )
    .eq('workspace_id', workspaceId)
    .order('joined_at', { ascending: true })

  if (error) throw new Error(error.message)

  return (
    (data ?? []) as unknown as Array<{
      id: string
      user_id: string
      role: WorkspaceRole
      joined_at: string
      users: { full_name: string | null; email: string } | null
    }>
  ).map((m) => ({
    id: m.id,
    user_id: m.user_id,
    role: m.role,
    joined_at: m.joined_at,
    full_name: m.users?.full_name ?? null,
    email: m.users?.email ?? '',
  }))
}

export async function inviteMember(
  workspaceId: string,
  invitedBy: string,
  email: string,
  role: 'admin' | 'member',
): Promise<void> {
  const supabase = createClient()

  const { data: existingUser, error: lookupError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (lookupError) throw new Error(lookupError.message)
  if (!existingUser)
    throw new Error('No account found for this email. They must sign up first.')

  const user = existingUser as { id: string }

  const { data: alreadyMember } = await supabase
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (alreadyMember) throw new Error('This person is already a member of the workspace.')

  const { error } = await supabase.from('workspace_members').insert({
    workspace_id: workspaceId,
    user_id: user.id,
    role,
    invited_by: invitedBy,
  })
  if (error) throw new Error(error.message)
}

export async function updateMemberRole(
  memberId: string,
  role: WorkspaceRole,
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('workspace_members')
    .update({ role })
    .eq('id', memberId)
  if (error) throw new Error(error.message)
}

export async function removeMember(memberId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('id', memberId)
  if (error) throw new Error(error.message)
}
