'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Plus, Search, Mail, Phone, Building2 } from 'lucide-react'
import { useClients } from '@/hooks/use-clients'
import { useWorkspace } from '@/lib/workspace-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteClientDialog } from '@/components/domain/clients/delete-client-dialog'
import type { Client } from '@/services/clients'

const PAGE_SIZE = 10

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function ClientCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
    </div>
  )
}

interface ClientCardProps {
  client: Client
}

function ClientCard({ client }: ClientCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <Link
            href={`/clients/${client.id}`}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            {client.name}
          </Link>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {client.company && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {client.company}
              </span>
            )}
            {client.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {client.email}
              </span>
            )}
            {client.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {client.phone}
              </span>
            )}
            {!client.company && !client.email && !client.phone && (
              <span className="italic">No contact details</span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0" aria-label="Client actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/clients/${client.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/clients/${client.id}/edit`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteClientDialog
        clientId={client.id}
        clientName={client.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

export function ClientList() {
  const { workspaceId } = useWorkspace()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(0)
  const [, startTransition] = useTransition()

  const { data, isLoading, isFetching } = useClients(workspaceId, debouncedSearch, page)

  const clients = data?.data ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const hasNextPage = page < totalPages - 1
  const hasPrevPage = page > 0

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)
    startTransition(() => {
      // Debounce via transition — clears queued updates
      setTimeout(() => setDebouncedSearch(value), 300)
    })
    setPage(0)
  }

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients…"
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>

      {/* Count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          {totalCount === 0
            ? 'No clients found'
            : `${totalCount} client${totalCount === 1 ? '' : 's'}${debouncedSearch ? ' matching your search' : ''}`}
        </p>
      )}

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <ClientCardSkeleton key={i} />)
        ) : clients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="mb-4 h-12 w-12 text-muted-foreground/40" />
              {debouncedSearch ? (
                <>
                  <h3 className="text-base font-medium">No results for &ldquo;{debouncedSearch}&rdquo;</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p>
                </>
              ) : (
                <>
                  <h3 className="text-base font-medium">No clients yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add your first client to get started.
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/clients/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Client
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => <ClientCard key={client.id} client={client} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrevPage || isFetching}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
