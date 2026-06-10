'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteProjectDialog } from '@/components/domain/projects/delete-project-dialog'

interface DeleteProjectButtonProps {
  projectId: string
  projectName: string
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="destructive" size="icon" onClick={() => setOpen(true)} aria-label="Delete project">
        <Trash2 className="h-4 w-4" />
      </Button>
      <DeleteProjectDialog
        projectId={projectId}
        projectName={projectName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
