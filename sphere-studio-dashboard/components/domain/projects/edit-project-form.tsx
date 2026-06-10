'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/domain/projects/project-form'
import { useUpdateProject } from '@/hooks/use-projects'
import { useWorkspace } from '@/lib/workspace-context'
import { normaliseProjectInput } from '@/lib/validators/project'
import type { ProjectInput } from '@/lib/validators/project'

interface ClientOption {
  id: string
  name: string
  company: string | null
}

interface EditProjectFormProps {
  projectId: string
  defaultValues: Partial<ProjectInput>
  clients: ClientOption[]
}

export function EditProjectForm({ projectId, defaultValues, clients }: EditProjectFormProps) {
  const router = useRouter()
  const { workspaceId } = useWorkspace()
  const [serverError, setServerError] = useState<string | null>(null)

  const { mutate: updateProject, isPending } = useUpdateProject(workspaceId, projectId)

  function handleSubmit(data: ReturnType<typeof normaliseProjectInput>) {
    setServerError(null)
    updateProject(data, {
      onError: (err) => setServerError(err.message),
    })
  }

  return (
    <ProjectForm
      defaultValues={defaultValues}
      clients={clients}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Save Changes"
      serverError={serverError}
      onCancel={() => router.push(`/projects/${projectId}`)}
    />
  )
}
