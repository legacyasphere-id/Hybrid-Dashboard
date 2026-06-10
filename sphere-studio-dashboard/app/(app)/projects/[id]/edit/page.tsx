import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditProjectForm } from '@/components/domain/projects/edit-project-form'
import type { ProjectStatus } from '@/lib/validators/project'

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return notFound()

  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)

  const workspaceId = (memberships?.[0] as { workspace_id: string } | undefined)?.workspace_id
  if (!workspaceId) return notFound()

  const [projectResult, clientsResult] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('workspace_id', workspaceId)
      .maybeSingle(),
    supabase
      .from('clients')
      .select('id, name, company')
      .eq('workspace_id', workspaceId)
      .order('name', { ascending: true }),
  ])

  if (!projectResult.data) return notFound()

  const project = projectResult.data as {
    id: string
    name: string
    description: string | null
    client_id: string | null
    status: ProjectStatus
    due_date: string | null
  }

  const clients = (clientsResult.data ?? []) as {
    id: string
    name: string
    company: string | null
  }[]

  const defaultValues = {
    name: project.name,
    description: project.description ?? '',
    client_id: project.client_id ?? '',
    status: project.status,
    due_date: project.due_date ?? '',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Project"
        description={`Editing ${project.name}`}
        actions={
          <Button variant="ghost" asChild>
            <Link href={`/projects/${project.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProjectForm
            projectId={project.id}
            defaultValues={defaultValues}
            clients={clients}
          />
        </CardContent>
      </Card>
    </div>
  )
}
