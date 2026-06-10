'use client'

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
import { useDeleteClient } from '@/hooks/use-clients'
import { useWorkspace } from '@/lib/workspace-context'

interface DeleteClientDialogProps {
  clientId: string
  clientName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteClientDialog({
  clientId,
  clientName,
  open,
  onOpenChange,
}: DeleteClientDialogProps) {
  const { workspaceId } = useWorkspace()
  const { mutate: deleteClient, isPending } = useDeleteClient(workspaceId)

  function handleConfirm() {
    deleteClient(clientId, {
      onSettled: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete client?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{clientName}</strong> and cannot be undone.
            Any projects linked to this client will have their client reference removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Deleting…' : 'Delete client'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
