'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TaskForm } from '@/components/domain/tasks/task-form'
import type { ProjectOption, MemberOption } from '@/components/domain/tasks/task-form'
import { useUpdateTask } from '@/hooks/use-tasks'
import { useWorkspace } from '@/lib/workspace-context'
import { normaliseTaskInput } from '@/lib/validators/task'
import type { TaskInput } from '@/lib/validators/task'

interface EditTaskFormProps {
  taskId: string
  defaultValues: Partial<TaskInput>
  projects: ProjectOption[]
  members: MemberOption[]
}

export function EditTaskForm({ taskId, defaultValues, projects, members }: EditTaskFormProps) {
  const router = useRouter()
  const { workspaceId } = useWorkspace()
  const [serverError, setServerError] = useState<string | null>(null)

  const { mutate: updateTask, isPending } = useUpdateTask(workspaceId, taskId)

  function handleSubmit(data: ReturnType<typeof normaliseTaskInput>) {
    setServerError(null)
    updateTask(data, { onError: (err) => setServerError(err.message) })
  }

  return (
    <TaskForm
      defaultValues={defaultValues}
      projects={projects}
      members={members}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Save Changes"
      serverError={serverError}
      onCancel={() => router.push(`/tasks/${taskId}`)}
    />
  )
}
