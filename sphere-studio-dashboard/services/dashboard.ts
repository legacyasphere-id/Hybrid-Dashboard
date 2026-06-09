import type { SupabaseClient } from '@supabase/supabase-js'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalClients: number
  activeProjects: number
  openTasks: number
  completedTasks: number
}

export interface ActivityEntry {
  id: string
  actor_id: string
  actor_name: string | null
  actor_email: string
  entity_type: string
  entity_id: string
  action: string
  created_at: string
}

export type DeadlineType = 'project' | 'task'

export interface DeadlineItem {
  id: string
  type: DeadlineType
  title: string
  due_date: string
  status: string
  project_name: string | null
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getDashboardStats(
  supabase: SupabaseClient,
  workspaceId: string,
): Promise<DashboardStats> {
  const [clientsRes, activeProjectsRes, openTasksRes, completedTasksRes] = await Promise.all([
    supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),

    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .in('status', ['in_progress', 'in_review', 'in_revision', 'awaiting_feedback']),

    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .in('status', ['todo', 'in_progress', 'in_review']),

    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('status', 'done'),
  ])

  return {
    totalClients:    clientsRes.count         ?? 0,
    activeProjects:  activeProjectsRes.count  ?? 0,
    openTasks:       openTasksRes.count       ?? 0,
    completedTasks:  completedTasksRes.count  ?? 0,
  }
}

export async function getRecentActivity(
  supabase: SupabaseClient,
  workspaceId: string,
  limit = 10,
): Promise<ActivityEntry[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select(`*, users!activity_logs_actor_id_fkey(full_name, email)`)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []

  const rows = (data ?? []) as Array<{
    id: string
    actor_id: string
    entity_type: string
    entity_id: string
    action: string
    created_at: string
    users: { full_name: string | null; email: string } | null
  }>

  return rows.map((r) => ({
    id:           r.id,
    actor_id:     r.actor_id,
    actor_name:   r.users?.full_name ?? null,
    actor_email:  r.users?.email ?? r.actor_id,
    entity_type:  r.entity_type,
    entity_id:    r.entity_id,
    action:       r.action,
    created_at:   r.created_at,
  }))
}

export async function getUpcomingDeadlines(
  supabase: SupabaseClient,
  workspaceId: string,
  limit = 5,
): Promise<DeadlineItem[]> {
  const today = new Date().toISOString().split('T')[0]!

  // Projects with future due dates
  const [projectsRes, tasksRes] = await Promise.all([
    supabase
      .from('projects')
      .select('id, name, due_date, status')
      .eq('workspace_id', workspaceId)
      .not('due_date', 'is', null)
      .gte('due_date', today)
      .not('status', 'in', '("complete","archived")')
      .order('due_date', { ascending: true })
      .limit(limit),

    supabase
      .from('tasks')
      .select(`id, title, due_date, status, projects!tasks_project_id_fkey(name)`)
      .eq('workspace_id', workspaceId)
      .not('due_date', 'is', null)
      .gte('due_date', today)
      .not('status', 'in', '("done","cancelled")')
      .order('due_date', { ascending: true })
      .limit(limit),
  ])

  const projectDeadlines: DeadlineItem[] = (
    (projectsRes.data ?? []) as Array<{
      id: string; name: string; due_date: string; status: string
    }>
  ).map((p) => ({
    id:           p.id,
    type:         'project' as const,
    title:        p.name,
    due_date:     p.due_date,
    status:       p.status,
    project_name: null,
  }))

  const taskDeadlines: DeadlineItem[] = (
    (tasksRes.data ?? []) as unknown as Array<{
      id: string; title: string; due_date: string; status: string;
      projects: { name: string } | null
    }>
  ).map((t) => ({
    id:           t.id,
    type:         'task' as const,
    title:        t.title,
    due_date:     t.due_date,
    status:       t.status,
    project_name: t.projects?.name ?? null,
  }))

  // Merge, sort by due_date, take top `limit`
  return [...projectDeadlines, ...taskDeadlines]
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, limit)
}
