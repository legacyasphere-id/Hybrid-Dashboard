import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditTaskForm } from '@/components/domain/tasks/edit-task-form'
import type { TaskStatus, TaskPriority } from '@/lib/validators/task'

export default async function EditTaskPage({ params }: { params: { id: string } }) {
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

  const [taskResult, projectsResult, membersResult] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .eq('workspace_id', workspaceId)
      .maybeSingle(),
    supabase
      .from('projects')
      .select('id, name')
      .eq('workspace_id', workspaceId)
      .order('name', { ascending: true }),
    supabase
      .from('workspace_members')
      .select('user_id, users!workspace_members_user_id_fkey(id, full_name, email)')
      .eq('workspace_id', workspaceId),
  ])

  if (!taskResult.data) return notFound()

  const task = taskResult.data as {
    id: string
    title: string
    description: string | null
    project_id: string
    status: TaskStatus
    priority: TaskPriority
    assignee_id: string | null
    due_date: string | null
  }

  const projects = (projectsResult.data ?? []) as { id: string; name: string }[]

  const memberRows = (membersResult.data ?? []) as Array<{
    user_id: string
    users: unknown
  }>
  const members = memberRows.flatMap((m) => {
    const u = m.users as { id: string; full_name: string | null; email: string } | null
    if (!u) return []
    return [{ id: u.id, full_name: u.full_name, email: u.email }]
  })

  const defaultValues = {
    title:       task.title,
    description: task.description ?? '',
    project_id:  task.project_id,
    status:      task.status,
    priority:    task.priority,
    assignee_id: task.assignee_id ?? '',
    due_date:    task.due_date ?? '',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Task"
        description={`Editing "${task.title}"`}
        actions={
          <Button variant="ghost" asChild>
            <Link href={`/tasks/${task.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditTaskForm
            taskId={task.id}
            defaultValues={defaultValues}
            projects={projects}
            members={members}
          />
        </CardContent>
      </Card>
    </div>
  )
}
