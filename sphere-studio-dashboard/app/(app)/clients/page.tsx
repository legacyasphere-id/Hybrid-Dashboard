import { Users } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage your client relationships."
        actions={
          <Button disabled>
            <Users className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        }
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-medium">Clients — coming soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Client CRUD will be implemented in the next sprint.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
