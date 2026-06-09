import { PageHeader } from '@/components/layout/page-header'
import { ClientList } from '@/components/domain/clients/client-list'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage your client relationships."
      />
      <ClientList />
    </div>
  )
}
