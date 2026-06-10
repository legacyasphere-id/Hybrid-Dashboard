import { createClient } from '@/lib/supabase/client'
import type { TaskStatus, TaskPriority } from '@/lib/validators/task'

export interface Task {
  id: string
  workspace_id: string
  project_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assignee_id: string | null
  due_date: string | null
  completed_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface TaskWithRelations extends Task {
  project_name: string | null
  assignee_name: string | null
  assignee_email: string | null
}

export interface TasksPage {
  data: TaskWithRelations[]
  count: number
}

const PAGE_SIZE = 10

export async function fetchTasks(
  workspaceId: string,
  opts: {
    search?: string
    status?: string
    priority?: string
    projectId?: string
    assigneeId?: string
    page?: number
  } = {},
): Promise<TasksPage> {
  const supabase = createClient()
  const { search = '', status = '', priority = '', projectId = '', assigneeId = '', page = 0 } = opts
  const from = page * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  let query = supabase
    .from('tasks')
    .select(
      `*, projects!tasks_project_id_fkey(name), users!tasks_assignee_id_fkey(full_name, email)`,
      { count: 'exact' },
    )
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search.trim())    query = query.ilike('title', `%${search}%`)
  if (status.trim())    query = query.eq('status',   status as TaskStatus)
  if (priority.trim())  query = query.eq('priority', priority as TaskPriority)
  if (projectId.trim()) query = query.eq('project_id', projectId)
  if (assigneeId.trim()) query = query.eq('assignee_id', assigneeId)

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  const rows = (data ?? []) as Array<
    Task & {
      projects: { name: string } | null
      users: { full_name: string | null; email: string } | null
    }
  >

  return {
    data: rows.map((r) => ({
      ...r,
      project_name:   r.projects?.name ?? null,
      assignee_name:  r.users?.full_name ?? null,
      assignee_email: r.users?.email ?? null,
    })),
    count: count ?? 0,
  }
}

export async function fetchTask(id: string, workspaceId: string): Promise<TaskWithRelations> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select(`*, projects!tasks_project_id_fkey(name), users!tasks_assignee_id_fkey(full_name, email)`)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .single()

  if (error) throw new Error(error.message)

  const r = data as Task & {
    projects: { name: string } | null
    users: { full_name: string | null; email: string } | null
  }
  return {
    ...r,
    project_name:   r.projects?.name ?? null,
    assignee_name:  r.users?.full_name ?? null,
    assignee_email: r.users?.email ?? null,
  }
}

export async function createTaskRecord(
  workspaceId: string,
  userId: string,
  data: {
    title: string
    description: string | null
    project_id: string
    status: TaskStatus
    priority: TaskPriority
    assignee_id: string | null
    due_date: string | null
  },
): Promise<Task> {
  const supabase = createClient()
  const payload: Record<string, unknown> = {
    ...data,
    workspace_id: workspaceId,
    created_by:   userId,
  }
  // Set completed_at when status is done
  if (data.status === 'done') {
    payload.completed_at = new Date().toISOString()
  }

  const { data: created, error } = await supabase
    .from('tasks')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return created as Task
}

export async function updateTaskRecord(
  id: string,
  workspaceId: string,
  data: {
    title?: string
    description?: string | null
    project_id?: string
    status?: TaskStatus
    priority?: TaskPriority
    assignee_id?: string | null
    due_date?: string | null
  },
): Promise<Task> {
  const supabase = createClient()
  const payload: Record<string, unknown> = {
    ...data,
    updated_at: new Date().toISOString(),
  }
  // Track completion timestamp
  if (data.status === 'done')      payload.completed_at = new Date().toISOString()
  if (data.status && data.status !== 'done') payload.completed_at = null

  const { data: updated, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return updated as Task
}

export async function deleteTaskRecord(id: string, workspaceId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId)

  if (error) throw new Error(error.message)
}
