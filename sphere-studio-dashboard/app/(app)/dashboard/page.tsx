import { redirect } from 'next/navigation'
import { FolderKanban, CheckSquare, Users, CheckCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines'
import {
  getDashboardStats,
  getRecentActivity,
  getUpcomingDeadlines,
} from '@/services/dashboard'

export default async function DashboardPage() {
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

  const { workspace_id: workspaceId } =
    memberships[0] as { workspace_id: string; role: string }

  // All three sections fetched in parallel
  const [stats, activity, deadlines] = await Promise.all([
    getDashboardStats(supabase, workspaceId),
    getRecentActivity(supabase, workspaceId),
    getUpcomingDeadlines(supabase, workspaceId),
  ])

  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting} 👋`}
        description="Here's what's happening in your workspace."
      />

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Clients"
          value={stats.totalClients}
          description={
            stats.totalClients === 0
              ? 'No clients yet'
              : `${stats.totalClients} client${stats.totalClients === 1 ? '' : 's'} in workspace`
          }
          icon={Users}
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          description="In progress, review, or revision"
          icon={FolderKanban}
          highlight={stats.activeProjects > 0}
        />
        <StatCard
          title="Open Tasks"
          value={stats.openTasks}
          description="To do, in progress, or in review"
          icon={CheckSquare}
          highlight={stats.openTasks > 0}
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          description={
            stats.completedTasks === 0
              ? 'None done yet'
              : `${stats.completedTasks} task${stats.completedTasks === 1 ? '' : 's'} marked done`
          }
          icon={CheckCheck}
        />
      </div>

      {/* ── Widgets ────────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <UpcomingDeadlines items={deadlines} />
        <RecentActivity entries={activity} />
      </div>
    </div>
  )
}
