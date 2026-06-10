import { createClient } from '@/lib/supabase/client'

export interface Client {
  id: string
  workspace_id: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  notes: string | null
  avatar_url: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface ClientsPage {
  data: Client[]
  count: number
}

export interface ClientWithProjectCount extends Client {
  projectCount: number
}

const PAGE_SIZE = 10

export async function fetchClients(
  workspaceId: string,
  opts: { search?: string; page?: number } = {},
): Promise<ClientsPage> {
  const supabase = createClient()
  const { search = '', page = 0 } = opts
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .order('name', { ascending: true })
    .range(from, to)

  if (search.trim()) {
    query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  return {
    data: (data ?? []) as Client[],
    count: count ?? 0,
  }
}

export async function fetchClient(id: string, workspaceId: string): Promise<Client> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .single()

  if (error) throw new Error(error.message)
  return data as Client
}

export async function fetchClientProjectCount(
  clientId: string,
  workspaceId: string,
): Promise<number> {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('workspace_id', workspaceId)

  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function createClientRecord(
  workspaceId: string,
  userId: string,
  data: {
    name: string
    company: string | null
    email: string | null
    phone: string | null
    notes: string | null
  },
): Promise<Client> {
  const supabase = createClient()
  const { data: created, error } = await supabase
    .from('clients')
    .insert({ ...data, workspace_id: workspaceId, created_by: userId })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return created as Client
}

export async function updateClientRecord(
  id: string,
  workspaceId: string,
  data: {
    name?: string
    company?: string | null
    email?: string | null
    phone?: string | null
    notes?: string | null
  },
): Promise<Client> {
  const supabase = createClient()
  const { data: updated, error } = await supabase
    .from('clients')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return updated as Client
}

export async function deleteClientRecord(id: string, workspaceId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId)

  if (error) throw new Error(error.message)
}
