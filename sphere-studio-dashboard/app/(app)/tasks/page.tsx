import Link from 'next/link'
import { Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { TaskList } from '@/components/domain/tasks/task-list'

export default async function TasksPage() {
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

  const { data: projectRows } = await supabase
    .from('projects')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .order('name', { ascending: true })

  const projects = (projectRows ?? []) as { id: string; name: string }[]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage all tasks across your workspace projects."
        actions={
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Link>
          </Button>
        }
      />
      <TaskList projects={projects} />
    </div>
  )
}
