import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WorkspaceForm } from '@/components/settings/workspace-form'
import { DangerZone } from '@/components/settings/danger-zone'

export default async function WorkspaceSettingsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Resolve membership
  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, role')
    .eq('user_id', user.id)
    .limit(1)

  if (!memberships || memberships.length === 0) redirect('/workspace/new')

  const membership = memberships[0] as { workspace_id: string; role: string }

  // RBAC: only admin+ can access workspace settings
  if (membership.role === 'member') redirect('/settings/profile')

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name, slug, plan')
    .eq('id', membership.workspace_id)
    .maybeSingle()

  if (!workspace) redirect('/workspace/new')

  const ws = workspace as { id: string; name: string; slug: string; plan: string }

  return (
    <div className="space-y-6">
      <WorkspaceForm
        workspaceId={ws.id}
        initialName={ws.name}
        initialSlug={ws.slug}
        plan={ws.plan}
      />

      {membership.role === 'owner' && (
        <DangerZone workspaceId={ws.id} workspaceName={ws.name} />
      )}
    </div>
  )
}
