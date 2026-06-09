import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MembersTable } from '@/components/settings/members-table'

export default async function MembersSettingsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, role')
    .eq('user_id', user.id)
    .limit(1)

  if (!memberships || memberships.length === 0) redirect('/workspace/new')

  const membership = memberships[0] as { workspace_id: string; role: string }

  // RBAC: only admin+ can access members settings
  if (membership.role === 'member') redirect('/settings/profile')

  return <MembersTable />
}
