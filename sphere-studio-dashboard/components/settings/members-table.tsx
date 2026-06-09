'use client'

import { useState } from 'react'
import { Loader2, MoreHorizontal, ShieldCheck, ShieldMinus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useMembers, useUpdateMemberRole, useRemoveMember } from '@/hooks/use-settings'
import { useWorkspace } from '@/lib/workspace-context'
import { InviteMemberDialog } from '@/components/settings/invite-member-dialog'
import type { WorkspaceMember } from '@/services/settings'
import type { WorkspaceRole } from '@/types/database'

const ROLE_LABELS: Record<WorkspaceRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
}

const ROLE_RANK: Record<WorkspaceRole, number> = { owner: 3, admin: 2, member: 1 }

function memberInitials(m: WorkspaceMember): string {
  if (m.full_name?.trim()) {
    const parts = m.full_name.trim().split(' ')
    return parts.length >= 2
      ? `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
      : m.full_name.slice(0, 2).toUpperCase()
  }
  return m.email.slice(0, 2).toUpperCase()
}

function MemberRow({
  member,
  currentUserId,
  currentRole,
  workspaceId,
}: {
  member: WorkspaceMember
  currentUserId: string
  currentRole: WorkspaceRole
  workspaceId: string
}) {
  const [removeOpen, setRemoveOpen] = useState(false)
  const updateRole = useUpdateMemberRole(workspaceId)
  const removeMember = useRemoveMember(workspaceId)

  const currentRank = ROLE_RANK[currentRole]
  const memberRank = ROLE_RANK[member.role]
  const isSelf = member.user_id === currentUserId
  const isOwner = member.role === 'owner'

  // Can manage if: current user has higher rank than target, and is not targeting self
  const canManage = !isSelf && !isOwner && currentRank > memberRank

  function promoteToAdmin() {
    updateRole.mutate({ memberId: member.id, role: 'admin' })
  }
  function demoteToMember() {
    updateRole.mutate({ memberId: member.id, role: 'member' })
  }

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">{memberInitials(member)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {member.full_name ?? member.email}
            {isSelf && (
              <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
            )}
          </p>
          {member.full_name && (
            <p className="truncate text-xs text-muted-foreground">{member.email}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Badge
          variant="outline"
          className="hidden text-xs sm:inline-flex"
        >
          {ROLE_LABELS[member.role]}
        </Badge>

        {canManage && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={updateRole.isPending || removeMember.isPending}
                >
                  {updateRole.isPending || removeMember.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                  <span className="sr-only">Member options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {member.role === 'member' && (
                  <DropdownMenuItem onClick={promoteToAdmin}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Promote to admin
                  </DropdownMenuItem>
                )}
                {member.role === 'admin' && (
                  <DropdownMenuItem onClick={demoteToMember}>
                    <ShieldMinus className="mr-2 h-4 w-4" />
                    Demote to member
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setRemoveOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove from workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove member?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <span className="font-semibold text-foreground">
                      {member.full_name ?? member.email}
                    </span>{' '}
                    will lose access to this workspace immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      removeMember.mutate(member.id)
                      setRemoveOpen(false)
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </li>
  )
}

export function MembersTable() {
  const { workspaceId, userId, role } = useWorkspace()
  const { data: members, isLoading, isError } = useMembers(workspaceId)
  const currentRole = role as WorkspaceRole

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">Team members</CardTitle>
          <CardDescription>
            Manage who has access to this workspace.
          </CardDescription>
        </div>
        <InviteMemberDialog />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ul className="divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </li>
            ))}
          </ul>
        ) : isError ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Failed to load members.
          </p>
        ) : (
          <ul className="divide-y">
            {(members ?? []).map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                currentUserId={userId}
                currentRole={currentRole}
                workspaceId={workspaceId}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
