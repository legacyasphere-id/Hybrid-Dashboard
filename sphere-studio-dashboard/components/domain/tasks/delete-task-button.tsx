'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteTaskDialog } from '@/components/domain/tasks/delete-task-dialog'

interface DeleteTaskButtonProps {
  taskId: string
  taskTitle: string
}

export function DeleteTaskButton({ taskId, taskTitle }: DeleteTaskButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <DeleteTaskDialog
        taskId={taskId}
        taskTitle={taskTitle}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
