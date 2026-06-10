'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteClientDialog } from '@/components/domain/clients/delete-client-dialog'

interface DeleteClientButtonProps {
  clientId: string
  clientName: string
}

export function DeleteClientButton({ clientId, clientName }: DeleteClientButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="destructive" size="icon" onClick={() => setOpen(true)} aria-label="Delete client">
        <Trash2 className="h-4 w-4" />
      </Button>
      <DeleteClientDialog
        clientId={clientId}
        clientName={clientName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
