import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/app-shell'
import { WorkspaceProvider } from '@/lib/workspace-context'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let supabase: ReturnType<typeof createClient>
  try {
    supabase = createClient()
  } catch {
    redirect('/login')
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) redirect('/login')

  const [{ data: memberships }, { data: profile }] = await Promise.all([
    supabase
      .from('workspace_members')
      .select('workspace_id, role')
      .eq('user_id', user.id)
      .limit(1),
    supabase.from('users').select('full_name').eq('id', user.id).maybeSingle(),
  ])

  if (!memberships || memberships.length === 0) redirect('/workspace/new')

  const membership = memberships[0] as { workspace_id: string; role: string }

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name, slug, plan')
    .eq('id', membership.workspace_id)
    .maybeSingle()

  if (!workspace) redirect('/workspace/new')

  const ws = workspace as { id: string; name: string; slug: string; plan: string }
  const fullName = (profile as { full_name: string | null } | null)?.full_name ?? null

  const contextValue = {
    workspaceId: ws.id,
    workspaceName: ws.name,
    workspacePlan: ws.plan,
    userId: user.id,
    userEmail: user.email ?? '',
    userFullName: fullName,
    role: membership.role,
  }

  return (
    <WorkspaceProvider value={contextValue}>
      <AppShell
        user={{ id: user.id, email: user.email ?? '', fullName }}
        workspace={ws}
        role={membership.role}
      >
        {children}
      </AppShell>
    </WorkspaceProvider>
  )
}
