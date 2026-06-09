'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { ProjectForm } from '@/components/domain/projects/project-form'
import { useCreateProject } from '@/hooks/use-projects'
import { useWorkspace } from '@/lib/workspace-context'
import { useClients } from '@/hooks/use-clients'

export default function NewProjectPage() {
  const router = useRouter()
  const { workspaceId, userId } = useWorkspace()
  const [serverError, setServerError] = useState<string | null>(null)

  const { mutate: createProject, isPending } = useCreateProject(workspaceId, userId)
  const { data: clientsPage } = useClients(workspaceId)

  const clients = (clientsPage?.data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    company: c.company,
  }))

  function handleSubmit(data: Parameters<typeof createProject>[0]) {
    setServerError(null)
    createProject(data, {
      onError: (err) => setServerError(err.message),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Project"
        description="Add a new project to your workspace."
        actions={
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm
            clients={clients}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Create Project"
            serverError={serverError}
            onCancel={() => router.push('/projects')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
