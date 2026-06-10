'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientForm } from '@/components/domain/clients/client-form'
import { useUpdateClient } from '@/hooks/use-clients'
import { useWorkspace } from '@/lib/workspace-context'
import { normaliseClientInput } from '@/lib/validators/client'
import type { ClientInput } from '@/lib/validators/client'

interface EditClientFormProps {
  clientId: string
  defaultValues: {
    name: string
    company: string | null
    email: string | null
    phone: string | null
    notes: string | null
  }
}

export function EditClientForm({ clientId, defaultValues }: EditClientFormProps) {
  const router = useRouter()
  const { workspaceId } = useWorkspace()
  const [serverError, setServerError] = useState<string | null>(null)

  const { mutate: updateClient, isPending } = useUpdateClient(workspaceId, clientId)

  function handleSubmit(data: ReturnType<typeof normaliseClientInput>) {
    setServerError(null)
    updateClient(data, {
      onError: (err) => setServerError(err.message),
    })
  }

  const formDefaults: Partial<ClientInput> = {
    name: defaultValues.name,
    company: defaultValues.company ?? '',
    email: defaultValues.email ?? '',
    phone: defaultValues.phone ?? '',
    notes: defaultValues.notes ?? '',
  }

  return (
    <ClientForm
      defaultValues={formDefaults}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Save Changes"
      serverError={serverError}
      onCancel={() => router.push(`/clients/${clientId}`)}
    />
  )
}
