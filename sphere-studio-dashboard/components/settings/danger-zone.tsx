'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, TriangleAlert } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useDeleteWorkspace } from '@/hooks/use-settings'

interface DangerZoneProps {
  workspaceId: string
  workspaceName: string
}

export function DangerZone({ workspaceId, workspaceName }: DangerZoneProps) {
  const router = useRouter()
  const [confirmName, setConfirmName] = useState('')
  const deleteWorkspace = useDeleteWorkspace(workspaceId)
  const confirmed = confirmName === workspaceName

  function handleDelete() {
    if (!confirmed) return
    deleteWorkspace.mutate(undefined, {
      onSuccess: () => {
        router.push('/workspace/new')
      },
    })
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <TriangleAlert className="h-4 w-4" />
          Danger zone
        </CardTitle>
        <CardDescription>
          Permanently delete this workspace and all its data. This cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog onOpenChange={() => setConfirmName('')}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Delete workspace
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete{' '}
                <span className="font-semibold text-foreground">{workspaceName}</span> and
                all clients, projects, tasks, and activity data. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-1.5 py-2">
              <Label htmlFor="confirm-name">
                Type{' '}
                <span className="font-semibold text-foreground">{workspaceName}</span> to
                confirm
              </Label>
              <Input
                id="confirm-name"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={workspaceName}
                autoComplete="off"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={!confirmed || deleteWorkspace.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteWorkspace.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete workspace
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
