import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  fetchTasks,
  fetchTask,
  createTaskRecord,
  updateTaskRecord,
  deleteTaskRecord,
  type TaskWithRelations,
  type TasksPage,
} from '@/services/tasks'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const taskKeys = {
  all:     (workspaceId: string) => ['tasks', workspaceId] as const,
  lists:   (workspaceId: string) => ['tasks', workspaceId, 'list'] as const,
  list: (
    workspaceId: string,
    search: string,
    status: string,
    priority: string,
    projectId: string,
    page: number,
  ) => ['tasks', workspaceId, 'list', { search, status, priority, projectId, page }] as const,
  details: (workspaceId: string) => ['tasks', workspaceId, 'detail'] as const,
  detail:  (workspaceId: string, id: string) =>
    ['tasks', workspaceId, 'detail', id] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useTasks(
  workspaceId: string,
  search = '',
  status = '',
  priority = '',
  projectId = '',
  page = 0,
) {
  return useQuery({
    queryKey: taskKeys.list(workspaceId, search, status, priority, projectId, page),
    queryFn:  () => fetchTasks(workspaceId, { search, status, priority, projectId, page }),
    placeholderData: (prev) => prev,
  })
}

export function useTask(workspaceId: string, id: string) {
  return useQuery({
    queryKey: taskKeys.detail(workspaceId, id),
    queryFn:  () => fetchTask(id, workspaceId),
    enabled:  !!id,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTask(workspaceId: string, userId: string) {
  const queryClient = useQueryClient()
  const router      = useRouter()

  return useMutation({
    mutationFn: (data: Parameters<typeof createTaskRecord>[2]) =>
      createTaskRecord(workspaceId, userId, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists(workspaceId) })
      router.push(`/tasks/${task.id}`)
    },
  })
}

export function useUpdateTask(workspaceId: string, taskId: string) {
  const queryClient = useQueryClient()
  const router      = useRouter()

  return useMutation({
    mutationFn: (data: Parameters<typeof updateTaskRecord>[2]) =>
      updateTaskRecord(taskId, workspaceId, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(workspaceId, taskId) })
      const previous = queryClient.getQueryData<TaskWithRelations>(
        taskKeys.detail(workspaceId, taskId),
      )
      if (previous) {
        queryClient.setQueryData<TaskWithRelations>(taskKeys.detail(workspaceId, taskId), {
          ...previous,
          ...newData,
        })
      }
      return { previous }
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(taskKeys.detail(workspaceId, taskId), context.previous)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(workspaceId, taskId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.lists(workspaceId) })
      router.push(`/tasks/${taskId}`)
    },
  })
}

export function useDeleteTask(workspaceId: string) {
  const queryClient = useQueryClient()
  const router      = useRouter()

  return useMutation({
    mutationFn: (taskId: string) => deleteTaskRecord(taskId, workspaceId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists(workspaceId) })
      const snapshot = queryClient.getQueriesData<TasksPage>({
        queryKey: taskKeys.lists(workspaceId),
      })
      queryClient.setQueriesData(
        { queryKey: taskKeys.lists(workspaceId) },
        (old: TasksPage | undefined) => {
          if (!old) return old
          return {
            data:  old.data.filter((t) => t.id !== taskId),
            count: Math.max(0, old.count - 1),
          }
        },
      )
      return { snapshot }
    },
    onError: (_err, _taskId, context) => {
      if (context?.snapshot) {
        context.snapshot.forEach(([key, value]) => {
          queryClient.setQueryData(key, value)
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(workspaceId) })
      router.push('/tasks')
    },
  })
}
