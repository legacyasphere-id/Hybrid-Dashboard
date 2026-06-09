'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Search, FolderKanban, MoreHorizontal, Calendar } from 'lucide-react'
import { useProjects } from '@/hooks/use-projects'
import { useWorkspace } from '@/lib/workspace-context'
import { PROJECT_STATUSES, STATUS_LABELS } from '@/lib/validators/project'
import { ProjectStatusBadge } from '@/components/domain/projects/project-status-badge'
import { DeleteProjectDialog } from '@/components/domain/projects/delete-project-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

interface ClientOption {
  id: string
  name: string
}

interface ProjectListProps {
  clients: ClientOption[]
}

export function ProjectList({ clients }: ProjectListProps) {
  const { workspaceId } = useWorkspace()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [clientFilter, setClientFilter] = useState('')
  const [page, setPage] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [, startTransition] = useTransition()

  const { data, isLoading } = useProjects(
    workspaceId,
    debouncedSearch,
    statusFilter,
    clientFilter,
    page,
  )

  function handleSearch(value: string) {
    setSearch(value)
    startTransition(() => {
      setTimeout(() => {
        setDebouncedSearch(value)
        setPage(0)
      }, 300)
    })
  }

  function handleStatusFilter(value: string) {
    setStatusFilter(value === 'all' ? '' : value)
    setPage(0)
  }

  function handleClientFilter(value: string) {
    setClientFilter(value === 'all' ? '' : value)
    setPage(0)
  }

  const projects = data?.data ?? []
  const total = data?.count ?? 0
  const PAGE_SIZE = 10
  const hasMore = (page + 1) * PAGE_SIZE < total

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter || 'all'} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PROJECT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {clients.length > 0 && (
          <Select value={clientFilter || 'all'} onValueChange={handleClientFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All clients</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
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
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16">
            <FolderKanban className="h-12 w-12 text-muted-foreground/40" />
            <div className="text-center">
              <p className="font-medium">No projects found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {debouncedSearch || statusFilter || clientFilter
                  ? 'Try adjusting your filters.'
                  : 'Create your first project to get started.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <Card key={project.id} className="transition-shadow hover:shadow-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/projects/${project.id}`}
                    className="truncate font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    {project.client_name && <span>{project.client_name}</span>}
                    {project.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <ProjectStatusBadge status={project.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${project.id}`}>View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => setDeleteTarget({ id: project.id, name: project.name })}
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
        <DeleteProjectDialog
          projectId={deleteTarget.id}
          projectName={deleteTarget.name}
          open={!!deleteTarget}
          onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        />
      )}
    </>
  )
}
