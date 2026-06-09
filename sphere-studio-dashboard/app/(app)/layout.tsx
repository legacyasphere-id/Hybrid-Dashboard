import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/app-shell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch membership + workspace in parallel
  const [{ data: memberships }, { data: profile }] = await Promise.all([
    supabase
      .from('workspace_members')
      .select('workspace_id, role')
      .eq('user_id', user.id)
      .limit(1),
    supabase.from('users').select('full_name').eq('id', user.id).maybeSingle(),
  ])

  if (!memberships || memberships.length === 0) {
    redirect('/workspace/new')
  }

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
    <AppShell
      user={{ id: user.id, email: user.email ?? '', fullName }}
      workspace={ws}
      role={membership.role}
    >
      {children}
    </AppShell>
  )
}
