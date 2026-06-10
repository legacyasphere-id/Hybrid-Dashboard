'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Search, CheckSquare, MoreHorizontal, Calendar, User2, FolderKanban } from 'lucide-react'
import { useTasks } from '@/hooks/use-tasks'
import { useWorkspace } from '@/lib/workspace-context'
import { TASK_STATUSES, TASK_PRIORITIES, STATUS_LABELS, PRIORITY_LABELS } from '@/lib/validators/task'
import { TaskStatusBadge } from '@/components/domain/tasks/task-status-badge'
import { TaskPriorityBadge } from '@/components/domain/tasks/task-priority-badge'
import { DeleteTaskDialog } from '@/components/domain/tasks/delete-task-dialog'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProjectOption { id: string; name: string }

interface TaskListProps {
  projects: ProjectOption[]
}

export function TaskList({ projects }: TaskListProps) {
  const { workspaceId } = useWorkspace()

  const [search,          setSearch]          = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter,    setStatusFilter]    = useState('')
  const [priorityFilter,  setPriorityFilter]  = useState('')
  const [projectFilter,   setProjectFilter]   = useState('')
  const [page,            setPage]            = useState(0)
  const [deleteTarget,    setDeleteTarget]    = useState<{ id: string; title: string } | null>(null)
  const [, startTransition] = useTransition()

  const { data, isLoading } = useTasks(
    workspaceId,
    debouncedSearch,
    statusFilter,
    priorityFilter,
    projectFilter,
    page,
  )

  function handleSearch(value: string) {
    setSearch(value)
    startTransition(() => {
      setTimeout(() => { setDebouncedSearch(value); setPage(0) }, 300)
    })
  }

  function handleFilter<T>(setter: (v: T) => void, resetPage = true) {
    return (value: string) => {
      setter((value === 'all' ? '' : value) as unknown as T)
      if (resetPage) setPage(0)
    }
  }

  const tasks    = data?.data ?? []
  const total    = data?.count ?? 0
  const PAGE_SIZE = 10
  const hasMore  = (page + 1) * PAGE_SIZE < total

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter || 'all'} onValueChange={handleFilter(setStatusFilter)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter || 'all'} onValueChange={handleFilter(setPriorityFilter)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {TASK_PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {projects.length > 0 && (
          <Select value={projectFilter || 'all'} onValueChange={handleFilter(setProjectFilter)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-4">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16">
            <CheckSquare className="h-12 w-12 text-muted-foreground/40" />
            <div className="text-center">
              <p className="font-medium">No tasks found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {debouncedSearch || statusFilter || priorityFilter || projectFilter
                  ? 'Try adjusting your filters.'
                  : 'Create your first task to get started.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card key={task.id} className="transition-shadow hover:shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <CheckSquare className="h-5 w-5 shrink-0 text-muted-foreground" />

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="truncate font-medium hover:underline"
                  >
                    {task.title}
                  </Link>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    {task.project_name && (
                      <span className="flex items-center gap-1">
                        <FolderKanban className="h-3 w-3" />
                        {task.project_name}
                      </span>
                    )}
                    {task.assignee_name && (
                      <span className="flex items-center gap-1">
                        <User2 className="h-3 w-3" />
                        {task.assignee_name}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <TaskPriorityBadge priority={task.priority} />
                <TaskStatusBadge   status={task.status} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/tasks/${task.id}`}>View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/tasks/${task.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => setDeleteTarget({ id: task.id, title: task.title })}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {(page > 0 || hasMore) && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <DeleteTaskDialog
          taskId={deleteTarget.id}
          taskTitle={deleteTarget.title}
          open={!!deleteTarget}
          onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        />
      )}
    </>
  )
}
