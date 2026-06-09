import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FolderKanban, CheckSquare, Users, Activity } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch workspace membership
  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, role')
    .eq('user_id', user.id)
    .limit(1)

  if (!memberships || memberships.length === 0) redirect('/workspace/new')

  const membership = memberships[0] as { workspace_id: string; role: string }

  // Fetch dashboard counts in parallel
  const [projectsResult, tasksResult, clientsResult] = await Promise.all([
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', membership.workspace_id)
      .in('status', ['in_progress', 'in_review', 'in_revision', 'awaiting_feedback']),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', membership.workspace_id)
      .eq('assignee_id', user.id)
      .in('status', ['todo', 'in_progress', 'in_review']),
    supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', membership.workspace_id),
  ])

  const activeProjects = projectsResult.count ?? 0
  const openTasks = tasksResult.count ?? 0
  const totalClients = clientsResult.count ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your workspace activity."
      />

      {/* Stat cards — Dashboard Data Mapping: widget row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Projects"
          value={activeProjects}
          description="In progress, review, or revision"
          icon={FolderKanban}
        />
        <StatCard
          title="Open Tasks"
          value={openTasks}
          description="Assigned to you"
          icon={CheckSquare}
        />
        <StatCard
          title="Clients"
          value={totalClients}
          description="Total in workspace"
          icon={Users}
        />
        <StatCard
          title="Recent Activity"
          value="—"
          description="Activity feed coming soon"
          icon={Activity}
        />
      </div>

      {/* Upcoming section placeholder */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No upcoming deadlines. Projects and tasks will appear here once added.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity feed will populate as you and your team work.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
