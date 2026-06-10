import { createClient } from '@/lib/supabase/client'
import type { ProjectStatus } from '@/lib/validators/project'

export interface Project {
  id: string
  workspace_id: string
  client_id: string | null
  name: string
  description: string | null
  status: ProjectStatus
  due_date: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface ProjectWithClient extends Project {
  client_name: string | null
  client_company: string | null
}

export interface ProjectsPage {
  data: ProjectWithClient[]
  count: number
}

const PAGE_SIZE = 10

export async function fetchProjects(
  workspaceId: string,
  opts: { search?: string; status?: string; clientId?: string; page?: number } = {},
): Promise<ProjectsPage> {
  const supabase = createClient()
  const { search = '', status = '', clientId = '', page = 0 } = opts
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('projects')
    .select(
      `*, clients!projects_client_id_fkey(name, company)`,
      { count: 'exact' },
    )
    .eq('workspace_id', workspaceId)
    .order('updated_at', { ascending: false })
    .range(from, to)

  if (search.trim()) {
    query = query.ilike('name', `%${search}%`)
  }
  if (status.trim()) {
    query = query.eq('status', status as ProjectStatus)
  }
  if (clientId.trim()) {
    query = query.eq('client_id', clientId)
  }

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  const rows = (data ?? []) as Array<
    Project & { clients: { name: string; company: string | null } | null }
  >

  return {
    data: rows.map((r) => ({
      ...r,
      client_name: r.clients?.name ?? null,
      client_company: r.clients?.company ?? null,
    })),
    count: count ?? 0,
  }
}

export async function fetchProject(id: string, workspaceId: string): Promise<ProjectWithClient> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(`*, clients!projects_client_id_fkey(name, company)`)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .single()

  if (error) throw new Error(error.message)

  const r = data as Project & { clients: { name: string; company: string | null } | null }
  return {
    ...r,
    client_name: r.clients?.name ?? null,
    client_company: r.clients?.company ?? null,
  }
}

export async function fetchProjectTaskCount(
  projectId: string,
  workspaceId: string,
): Promise<number> {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('workspace_id', workspaceId)

  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function createProjectRecord(
  workspaceId: string,
  userId: string,
  data: {
    name: string
    description: string | null
    client_id: string | null
    status: ProjectStatus
    due_date: string | null
  },
): Promise<Project> {
  const supabase = createClient()
  const { data: created, error } = await supabase
    .from('projects')
    .insert({ ...data, workspace_id: workspaceId, created_by: userId })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return created as Project
}

export async function updateProjectRecord(
  id: string,
  workspaceId: string,
  data: {
    name?: string
    description?: string | null
    client_id?: string | null
    status?: ProjectStatus
    due_date?: string | null
  },
): Promise<Project> {
  const supabase = createClient()
  const { data: updated, error } = await supabase
    .from('projects')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return updated as Project
}

export async function deleteProjectRecord(id: string, workspaceId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId)

  if (error) throw new Error(error.message)
}
