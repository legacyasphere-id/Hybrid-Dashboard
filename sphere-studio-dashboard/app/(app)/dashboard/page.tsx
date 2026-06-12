import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MetricCard } from '@/components/dashboard/metric-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { TasksWidget } from '@/components/dashboard/tasks-widget'
import { ProjectsTable } from '@/components/dashboard/projects-table'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import {
  getDashboardStats,
  getRecentActivity,
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

  const today = new Date().toISOString().split('T')[0]!

  // Parallel data fetches — all server-side
  const [stats, activity, activeProjectsRes, todayTasksRes] = await Promise.all([
    getDashboardStats(supabase, workspaceId),
    getRecentActivity(supabase, workspaceId, 8),

    supabase
      .from('projects')
      .select('id, name, status, due_date, clients!projects_client_id_fkey(name)')
      .eq('workspace_id', workspaceId)
      .in('status', ['in_progress', 'in_review', 'in_revision', 'awaiting_feedback', 'planning'])
      .order('updated_at', { ascending: false })
      .limit(6),

    supabase
      .from('tasks')
      .select('id, title, priority, due_date, projects!tasks_project_id_fkey(name)')
      .eq('workspace_id', workspaceId)
      .not('status', 'in', '("done","cancelled")')
      .or(`due_date.eq.${today},due_date.is.null`)
      .order('priority', { ascending: false })
      .limit(8),
  ])

  const activeProjects = (
    (activeProjectsRes.data ?? []) as unknown as Array<{
      id: string
      name: string
      status: string
      due_date: string | null
      clients: { name: string } | null
    }>
  ).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    due_date: p.due_date,
    client_name: p.clients?.name ?? null,
  }))

  const todayTasks = (
    (todayTasksRes.data ?? []) as unknown as Array<{
      id: string
      title: string
      priority: string
      due_date: string | null
      projects: { name: string } | null
    }>
  ).map((t) => ({
    id: t.id,
    title: t.title,
    priority: t.priority,
    due_date: t.due_date,
    project_name: t.projects?.name ?? null,
  }))

  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateLabel = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  // Fake sparklines (in a real app these would come from historical data queries)
  const clientSparkline = [4, 4, 5, 5, 6, 6, stats.totalClients]
  const projectSparkline = [2, 3, 3, 4, stats.activeProjects, stats.activeProjects, stats.activeProjects]
  const taskSparkline = [8, 7, 9, 6, stats.openTasks + 2, stats.openTasks + 1, stats.openTasks]
  const doneSparkline = [1, 2, 3, 3, 4, stats.completedTasks - 1, stats.completedTasks]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1
            className="text-[22px] sm:text-[26px] font-semibold tracking-tight leading-tight"
            style={{ color: 'var(--hs-neutral-900)' }}
          >
            {greeting}
          </h1>
          <p className="text-[13px] mt-1 font-light" style={{ color: 'var(--hs-neutral-500)' }}>
            {dateLabel}
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-white text-[13px] font-medium w-fit transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-accent)] focus-visible:ring-offset-2"
          style={{
            background: 'var(--hs-accent)',
            boxShadow: 'var(--hs-shadow-card)',
          }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          New Project
        </Link>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          label="Clients"
          value={stats.totalClients}
          change={stats.totalClients > 0 ? 8 : 0}
          sparkline={clientSparkline}
        />
        <MetricCard
          label="Active Projects"
          value={stats.activeProjects}
          change={stats.activeProjects > 0 ? 12 : 0}
          sparkline={projectSparkline}
        />
        <MetricCard
          label="Open Tasks"
          value={stats.openTasks}
          change={stats.openTasks > 0 ? -3 : 0}
          sparkline={taskSparkline}
        />
        <MetricCard
          label="Completed Tasks"
          value={stats.completedTasks}
          change={stats.completedTasks > 0 ? 21 : 0}
          sparkline={doneSparkline}
        />
      </div>

      {/* Chart + Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-8">
          <RevenueChart />
        </div>
        <div className="lg:col-span-4">
          <TasksWidget tasks={todayTasks} />
        </div>
      </div>

      {/* Active Projects + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-8">
          <ProjectsTable projects={activeProjects} totalCount={stats.activeProjects} />
        </div>
        <div className="lg:col-span-4">
          <ActivityFeed entries={activity} />
        </div>
      </div>
    </div>
  )
}
