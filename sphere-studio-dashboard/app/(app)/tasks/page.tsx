import { CheckSquare } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tasks"
        description="All tasks assigned to you across projects."
        actions={
          <Button disabled>
            <CheckSquare className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        }
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <CheckSquare className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-base font-medium">Tasks — coming soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Task CRUD will be implemented after Projects.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
