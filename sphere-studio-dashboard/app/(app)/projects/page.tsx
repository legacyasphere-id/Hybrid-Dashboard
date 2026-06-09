import { FolderKanban } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Track your active projects and their status."
        actions={
          <Button disabled>
            <FolderKanban className="mr-2 h-4 w-4" />
            New Project
          </Button>
        }
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-medium">Projects — coming soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Project CRUD will be implemented in the next sprint.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
