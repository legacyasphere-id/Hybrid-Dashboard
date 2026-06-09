import { Settings } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your workspace and account preferences."
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Settings className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-medium">Settings — coming soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Profile, workspace, members, and billing settings will be added here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
