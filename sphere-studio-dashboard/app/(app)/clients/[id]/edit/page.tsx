import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditClientForm } from '@/components/domain/clients/edit-client-form'

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return notFound()

  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)

  const workspaceId = (memberships?.[0] as { workspace_id: string } | undefined)?.workspace_id
  if (!workspaceId) return notFound()

  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .eq('workspace_id', workspaceId)
    .maybeSingle()

  if (!data) return notFound()

  const client = data as {
    id: string
    name: string
    company: string | null
    email: string | null
    phone: string | null
    notes: string | null
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Client"
        description={`Editing ${client.name}`}
        actions={
          <Button variant="ghost" asChild>
            <Link href={`/clients/${client.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditClientForm clientId={client.id} defaultValues={client} />
        </CardContent>
      </Card>
    </div>
  )
}
