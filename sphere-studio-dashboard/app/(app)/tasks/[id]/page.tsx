import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Calendar, FileText, FolderKanban, User2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TaskStatusBadge } from '@/components/domain/tasks/task-status-badge'
import { TaskPriorityBadge } from '@/components/domain/tasks/task-priority-badge'
import { DeleteTaskButton } from '@/components/domain/tasks/delete-task-button'
import type { TaskStatus, TaskPriority } from '@/lib/validators/task'

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

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
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

  const { data, error } = await supabase
    .from('tasks')
    .select(
      `*, projects!tasks_project_id_fkey(id, name), users!tasks_assignee_id_fkey(id, full_name, email)`,
    )
    .eq('id', params.id)
    .eq('workspace_id', workspaceId)
    .maybeSingle()

  if (!data || error) return notFound()

  const task = data as {
    id: string
    title: string
    description: string | null
    status: TaskStatus
    priority: TaskPriority
    due_date: string | null
    completed_at: string | null
    created_at: string
    updated_at: string
    projects: { id: string; name: string } | null
    users: { id: string; full_name: string | null; email: string } | null
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={task.title}
        description={task.projects?.name ?? undefined}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/tasks">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Tasks
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/tasks/${task.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteTaskButton taskId={task.id} taskTitle={task.title} />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <TaskStatusBadge   status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {task.description && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="whitespace-pre-wrap text-sm">{task.description}</p>
                </div>
              </div>
            )}
            {task.projects && (
              <div className="flex items-start gap-3">
                <FolderKanban className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Project</p>
                  <Link
                    href={`/projects/${task.projects.id}`}
                    className="text-sm hover:underline"
                  >
                    {task.projects.name}
                  </Link>
                </div>
              </div>
            )}
            {task.users && (
              <div className="flex items-start gap-3">
                <User2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Assignee</p>
                  <p className="text-sm">{task.users.full_name ?? task.users.email}</p>
                </div>
              </div>
            )}
            <InfoRow
              icon={Calendar}
              label="Due Date"
              value={task.due_date ? new Date(task.due_date).toLocaleDateString() : null}
            />
            {task.completed_at && (
              <InfoRow
                icon={Calendar}
                label="Completed"
                value={new Date(task.completed_at).toLocaleDateString()}
              />
            )}
            {!task.description && !task.users && !task.due_date && (
              <p className="text-sm italic text-muted-foreground">No details added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Meta */}
        <Card>
          <CardContent className="pt-6">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd>{new Date(task.created_at).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last updated</dt>
                <dd>{new Date(task.updated_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
