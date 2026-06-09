import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Mail, Phone, Building2, FileText, FolderKanban } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DeleteClientButton } from '@/components/domain/clients/delete-client-button'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

interface InfoRowProps {
  icon: React.ElementType
  label: string
  value: string | null | undefined
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  )
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return notFound()

  // Get workspace
  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)

  const workspaceId = (memberships?.[0] as { workspace_id: string } | undefined)?.workspace_id
  if (!workspaceId) return notFound()

  // Fetch client + project count in parallel
  const [clientResult, projectCountResult] = await Promise.all([
    supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .eq('workspace_id', workspaceId)
      .maybeSingle(),
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', params.id)
      .eq('workspace_id', workspaceId),
  ])

  if (!clientResult.data) return notFound()

  const client = clientResult.data as {
    id: string
    name: string
    company: string | null
    email: string | null
    phone: string | null
    notes: string | null
    created_at: string
    updated_at: string
  }
  const projectCount = projectCountResult.count ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.name}
        description={client.company ?? undefined}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/clients">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Clients
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/clients/${client.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteClientButton clientId={client.id} clientName={client.name} />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Contact card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="text-lg">{getInitials(client.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{client.name}</h2>
                {client.company && (
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={client.email} />
            <InfoRow icon={Phone} label="Phone" value={client.phone} />
            <InfoRow icon={Building2} label="Company" value={client.company} />
            {client.notes && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="whitespace-pre-wrap text-sm">{client.notes}</p>
                </div>
              </div>
            )}
            {!client.email && !client.phone && !client.company && !client.notes && (
              <p className="text-sm text-muted-foreground italic">No contact details added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Stats card */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">{projectCount}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {projectCount === 0
                  ? 'No projects yet'
                  : `${projectCount} project${projectCount === 1 ? '' : 's'} linked`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>{new Date(client.created_at).toLocaleDateString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Last updated</dt>
                  <dd>{new Date(client.updated_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
