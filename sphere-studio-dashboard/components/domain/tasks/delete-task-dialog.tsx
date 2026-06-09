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
import { useDeleteTask } from '@/hooks/use-tasks'
import { useWorkspace } from '@/lib/workspace-context'

interface DeleteTaskDialogProps {
  taskId: string
  taskTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteTaskDialog({
  taskId,
  taskTitle,
  open,
  onOpenChange,
}: DeleteTaskDialogProps) {
  const { workspaceId } = useWorkspace()
  const { mutate: deleteTask, isPending } = useDeleteTask(workspaceId)

  function handleConfirm() {
    deleteTask(taskId, { onError: () => onOpenChange(false) })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium">&quot;{taskTitle}&quot;</span> will be permanently
            deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
