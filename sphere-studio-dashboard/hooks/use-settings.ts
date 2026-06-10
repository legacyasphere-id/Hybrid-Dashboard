'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { WorkspaceRole } from '@/types/database'
import {
  updateProfile,
  uploadAvatar,
  sendPasswordReset,
  updateWorkspace,
  deleteWorkspace,
  fetchWorkspaceMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
} from '@/services/settings'

export const settingsKeys = {
  members: (workspaceId: string) => ['members', workspaceId] as const,
}

export function useUpdateProfile(userId: string) {
  return useMutation({
    mutationFn: (data: { full_name: string }) => updateProfile(userId, data),
    onSuccess: () => toast.success('Profile updated'),
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUploadAvatar(userId: string) {
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(userId, file),
    onSuccess: () => toast.success('Avatar updated'),
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useSendPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => sendPasswordReset(email),
    onSuccess: () => toast.success('Password reset email sent — check your inbox'),
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateWorkspace(workspaceId: string) {
  return useMutation({
    mutationFn: (data: { name: string; slug: string }) =>
      updateWorkspace(workspaceId, data),
    onSuccess: () => toast.success('Workspace updated'),
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteWorkspace(workspaceId: string) {
  return useMutation({
    mutationFn: () => deleteWorkspace(workspaceId),
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useMembers(workspaceId: string) {
  return useQuery({
    queryKey: settingsKeys.members(workspaceId),
    queryFn: () => fetchWorkspaceMembers(workspaceId),
  })
}

export function useInviteMember(workspaceId: string, invitedBy: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: 'admin' | 'member' }) =>
      inviteMember(workspaceId, invitedBy, email, role),
    onSuccess: () => {
      toast.success('Member added to workspace')
      void qc.invalidateQueries({ queryKey: settingsKeys.members(workspaceId) })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateMemberRole(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: WorkspaceRole }) =>
      updateMemberRole(memberId, role),
    onSuccess: () => {
      toast.success('Role updated')
      void qc.invalidateQueries({ queryKey: settingsKeys.members(workspaceId) })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useRemoveMember(workspaceId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (memberId: string) => removeMember(memberId),
    onSuccess: () => {
      toast.success('Member removed')
      void qc.invalidateQueries({ queryKey: settingsKeys.members(workspaceId) })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
