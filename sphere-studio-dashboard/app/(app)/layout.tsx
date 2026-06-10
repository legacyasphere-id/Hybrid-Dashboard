export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/app-shell'
import { WorkspaceProvider } from '@/lib/workspace-context'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect('/login')
  }

  let user: Awaited<ReturnType<ReturnType<typeof createClient>['auth']['getUser']>>['data']['user']

  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) redirect('/login')
    user = data.user
  } catch (err) {
    console.error('[AppLayout] auth error:', err)
    redirect('/login')
  }

  const supabase = createClient()

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

  return (
    <WorkspaceProvider
      value={{
        workspaceId: ws.id,
        workspaceName: ws.name,
        workspacePlan: ws.plan,
        userId: user.id,
        userEmail: user.email ?? '',
        userFullName: fullName,
        role: membership.role,
      }}
    >
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
