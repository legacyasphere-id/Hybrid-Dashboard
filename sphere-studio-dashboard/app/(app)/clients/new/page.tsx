'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { ClientForm } from '@/components/domain/clients/client-form'
import { useCreateClient } from '@/hooks/use-clients'
import { useWorkspace } from '@/lib/workspace-context'

export default function NewClientPage() {
  const router = useRouter()
  const { workspaceId, userId } = useWorkspace()
  const [serverError, setServerError] = useState<string | null>(null)

  const { mutate: createClient, isPending } = useCreateClient(workspaceId, userId)

  function handleSubmit(data: Parameters<typeof createClient>[0]) {
    setServerError(null)
    createClient(data, {
      onError: (err) => setServerError(err.message),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Client"
        description="Add a new client to your workspace."
        actions={
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Create Client"
            serverError={serverError}
            onCancel={() => router.push('/clients')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
