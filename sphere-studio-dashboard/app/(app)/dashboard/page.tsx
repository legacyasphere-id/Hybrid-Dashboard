import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Workspace bootstrap: redirect if user has no workspace
  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, role')
    .eq('user_id', user.id)
    .limit(1)

  if (!memberships || memberships.length === 0) {
    redirect('/workspace/new')
  }

  const membership = memberships[0]
  const workspaceId = (membership as { workspace_id: string }).workspace_id
  const role = (membership as { role: string }).role

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name, slug')
    .eq('id', workspaceId)
    .maybeSingle()

  const workspaceName = (workspace as { name: string } | null)?.name ?? '—'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Sprint 0 complete — authentication and workspace bootstrap working.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between rounded-md bg-muted px-3 py-2">
              <span className="text-muted-foreground">User</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between rounded-md bg-muted px-3 py-2">
              <span className="text-muted-foreground">Workspace</span>
              <span className="font-medium">{workspaceName}</span>
            </div>
            <div className="flex justify-between rounded-md bg-muted px-3 py-2">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium capitalize">{role}</span>
            </div>
          </CardContent>
        </Card>

        <form action={signOut}>
          <Button variant="outline" className="w-full" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  )
}
