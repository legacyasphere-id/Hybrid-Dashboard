'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { TaskForm } from '@/components/domain/tasks/task-form'
import { useCreateTask } from '@/hooks/use-tasks'
import { useWorkspace } from '@/lib/workspace-context'
import { useProjects } from '@/hooks/use-projects'

export default function NewTaskPage() {
  const router = useRouter()
  const { workspaceId, userId } = useWorkspace()
  const [serverError, setServerError] = useState<string | null>(null)

  const { mutate: createTask, isPending } = useCreateTask(workspaceId, userId)
  const { data: projectsPage } = useProjects(workspaceId)

  const projects = (projectsPage?.data ?? []).map((p) => ({ id: p.id, name: p.name }))
  // Solo-freelancer ICP: workspace members = just the owner; pass current user as only member
  const members = [{ id: userId, full_name: null, email: '' }]

  function handleSubmit(data: Parameters<typeof createTask>[0]) {
    setServerError(null)
    createTask(data, { onError: (err) => setServerError(err.message) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Task"
        description="Add a new task to a project."
        actions={
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            projects={projects}
            members={members}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Create Task"
            serverError={serverError}
            onCancel={() => router.push('/tasks')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
