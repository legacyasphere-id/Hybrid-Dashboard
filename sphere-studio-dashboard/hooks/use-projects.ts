import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  fetchProjects,
  fetchProject,
  fetchProjectTaskCount,
  createProjectRecord,
  updateProjectRecord,
  deleteProjectRecord,
  type Project,
  type ProjectWithClient,
  type ProjectsPage,
} from '@/services/projects'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const projectKeys = {
  all: (workspaceId: string) => ['projects', workspaceId] as const,
  lists: (workspaceId: string) => ['projects', workspaceId, 'list'] as const,
  list: (workspaceId: string, search: string, status: string, clientId: string, page: number) =>
    ['projects', workspaceId, 'list', { search, status, clientId, page }] as const,
  details: (workspaceId: string) => ['projects', workspaceId, 'detail'] as const,
  detail: (workspaceId: string, id: string) =>
    ['projects', workspaceId, 'detail', id] as const,
  taskCount: (workspaceId: string, projectId: string) =>
    ['projects', workspaceId, 'taskCount', projectId] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useProjects(
  workspaceId: string,
  search = '',
  status = '',
  clientId = '',
  page = 0,
) {
  return useQuery({
    queryKey: projectKeys.list(workspaceId, search, status, clientId, page),
    queryFn: () => fetchProjects(workspaceId, { search, status, clientId, page }),
    placeholderData: (prev) => prev,
  })
}

export function useProject(workspaceId: string, id: string) {
  return useQuery({
    queryKey: projectKeys.detail(workspaceId, id),
    queryFn: () => fetchProject(id, workspaceId),
    enabled: !!id,
  })
}

export function useProjectTaskCount(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: projectKeys.taskCount(workspaceId, projectId),
    queryFn: () => fetchProjectTaskCount(projectId, workspaceId),
    enabled: !!projectId,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateProject(workspaceId: string, userId: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: Parameters<typeof createProjectRecord>[2]) =>
      createProjectRecord(workspaceId, userId, data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists(workspaceId) })
      router.push(`/projects/${project.id}`)
    },
  })
}

export function useUpdateProject(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: Parameters<typeof updateProjectRecord>[2]) =>
      updateProjectRecord(projectId, workspaceId, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.detail(workspaceId, projectId) })
      const previous = queryClient.getQueryData<ProjectWithClient>(
        projectKeys.detail(workspaceId, projectId),
      )
      if (previous) {
        queryClient.setQueryData<ProjectWithClient>(projectKeys.detail(workspaceId, projectId), {
          ...previous,
          ...newData,
        })
      }
      return { previous }
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(projectKeys.detail(workspaceId, projectId), context.previous)
      }
    },
    onSuccess: (project) => {
      // Re-fetch to get joined client name
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(workspaceId, projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.lists(workspaceId) })
      router.push(`/projects/${project.id}`)
    },
  })
}

export function useDeleteProject(workspaceId: string) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (projectId: string) => deleteProjectRecord(projectId, workspaceId),
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.lists(workspaceId) })
      const snapshot = queryClient.getQueriesData<ProjectsPage>({
        queryKey: projectKeys.lists(workspaceId),
      })
      queryClient.setQueriesData(
        { queryKey: projectKeys.lists(workspaceId) },
        (old: ProjectsPage | undefined) => {
          if (!old) return old
          return {
            data: old.data.filter((p) => p.id !== projectId),
            count: Math.max(0, old.count - 1),
          }
        },
      )
      return { snapshot }
    },
    onError: (_err, _projectId, context) => {
      if (context?.snapshot) {
        context.snapshot.forEach(([key, value]) => {
          queryClient.setQueryData(key, value)
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(workspaceId) })
      router.push('/projects')
    },
  })
}
