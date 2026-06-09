import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  fetchClients,
  fetchClient,
  fetchClientProjectCount,
  createClientRecord,
  updateClientRecord,
  deleteClientRecord,
  type Client,
} from '@/services/clients'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const clientKeys = {
  all: (workspaceId: string) => ['clients', workspaceId] as const,
  lists: (workspaceId: string) => ['clients', workspaceId, 'list'] as const,
  list: (workspaceId: string, search: string, page: number) =>
    ['clients', workspaceId, 'list', { search, page }] as const,
  details: (workspaceId: string) => ['clients', workspaceId, 'detail'] as const,
  detail: (workspaceId: string, id: string) =>
    ['clients', workspaceId, 'detail', id] as const,
  projectCount: (workspaceId: string, clientId: string) =>
    ['clients', workspaceId, 'projectCount', clientId] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useClients(workspaceId: string, search = '', page = 0) {
  return useQuery({
    queryKey: clientKeys.list(workspaceId, search, page),
    queryFn: () => fetchClients(workspaceId, { search, page }),
    placeholderData: (prev) => prev,
  })
}

export function useClient(workspaceId: string, id: string) {
  return useQuery({
    queryKey: clientKeys.detail(workspaceId, id),
    queryFn: () => fetchClient(id, workspaceId),
    enabled: !!id,
  })
}

export function useClientProjectCount(workspaceId: string, clientId: string) {
  return useQuery({
    queryKey: clientKeys.projectCount(workspaceId, clientId),
    queryFn: () => fetchClientProjectCount(clientId, workspaceId),
    enabled: !!clientId,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateClient(workspaceId: string, userId: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: Parameters<typeof createClientRecord>[2]) =>
      createClientRecord(workspaceId, userId, data),
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists(workspaceId) })
      router.push(`/clients/${client.id}`)
    },
  })
}

export function useUpdateClient(workspaceId: string, clientId: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: Parameters<typeof updateClientRecord>[2]) =>
      updateClientRecord(clientId, workspaceId, data),
    onMutate: async (newData) => {
      // Optimistic update on detail cache
      await queryClient.cancelQueries({ queryKey: clientKeys.detail(workspaceId, clientId) })
      const previous = queryClient.getQueryData<Client>(clientKeys.detail(workspaceId, clientId))
      if (previous) {
        queryClient.setQueryData<Client>(clientKeys.detail(workspaceId, clientId), {
          ...previous,
          ...newData,
        })
      }
      return { previous }
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(clientKeys.detail(workspaceId, clientId), context.previous)
      }
    },
    onSuccess: (client) => {
      queryClient.setQueryData(clientKeys.detail(workspaceId, clientId), client)
      queryClient.invalidateQueries({ queryKey: clientKeys.lists(workspaceId) })
      router.push(`/clients/${clientId}`)
    },
  })
}

export function useDeleteClient(workspaceId: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (clientId: string) => deleteClientRecord(clientId, workspaceId),
    onMutate: async (clientId) => {
      // Optimistic: remove from all list caches
      await queryClient.cancelQueries({ queryKey: clientKeys.lists(workspaceId) })
      const snapshot = queryClient.getQueriesData({ queryKey: clientKeys.lists(workspaceId) })
      queryClient.setQueriesData(
        { queryKey: clientKeys.lists(workspaceId) },
        (old: { data: Client[]; count: number } | undefined) => {
          if (!old) return old
          return {
            data: old.data.filter((c) => c.id !== clientId),
            count: Math.max(0, old.count - 1),
          }
        },
      )
      return { snapshot }
    },
    onError: (_err, _clientId, context) => {
      if (context?.snapshot) {
        context.snapshot.forEach(([key, value]) => {
          queryClient.setQueryData(key, value)
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all(workspaceId) })
      router.push('/clients')
    },
  })
}
