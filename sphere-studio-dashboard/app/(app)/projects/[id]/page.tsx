import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Calendar, FileText, CheckSquare, User2, FolderKanban } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectStatusBadge } from '@/components/domain/projects/project-status-badge'
import { DeleteProjectButton } from '@/components/domain/projects/delete-project-button'
import type { ProjectStatus } from '@/lib/validators/project'

interface InfoRowProps {
  icon: React.ElementType
  label: string
  value: string | null | undefined
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  )
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
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

  const [projectResult, taskCountResult] = await Promise.all([
    supabase
      .from('projects')
      .select('*, clients!projects_client_id_fkey(id, name, company)')
      .eq('id', params.id)
      .eq('workspace_id', workspaceId)
      .maybeSingle(),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', params.id)
      .eq('workspace_id', workspaceId),
  ])

  if (!projectResult.data) return notFound()

  const raw = projectResult.data as {
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
    clients: { id: string; name: string; company: string | null } | null
  }

  const taskCount = taskCountResult.count ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title={raw.name}
        description={raw.clients?.name ?? undefined}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Projects
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/projects/${raw.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteProjectButton projectId={raw.id} projectName={raw.name} />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{raw.name}</h2>
                  {raw.clients && (
                    <Link
                      href={`/clients/${raw.clients.id}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      {raw.clients.name}
                      {raw.clients.company ? ` · ${raw.clients.company}` : ''}
                    </Link>
                  )}
                </div>
              </div>
              <ProjectStatusBadge status={raw.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {raw.description && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="whitespace-pre-wrap text-sm">{raw.description}</p>
                </div>
              </div>
            )}
            <InfoRow
              icon={Calendar}
              label="Due Date"
              value={raw.due_date ? new Date(raw.due_date).toLocaleDateString() : null}
            />
            <InfoRow icon={User2} label="Client" value={raw.clients?.name ?? null} />
            {!raw.description && !raw.due_date && !raw.clients && (
              <p className="text-sm italic text-muted-foreground">No details added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Stats sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">{taskCount}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {taskCount === 0
                  ? 'No tasks yet'
                  : `${taskCount} task${taskCount === 1 ? '' : 's'}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground italic">
                Progress tracking will be available once tasks are added.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>{new Date(raw.created_at).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Last updated</dt>
                  <dd>{new Date(raw.updated_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
