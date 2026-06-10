import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <FileQuestion className="h-10 w-10 text-muted-foreground/40" />
      <div>
        <h2 className="text-base font-semibold">Page not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This page doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    </div>
  )
}
