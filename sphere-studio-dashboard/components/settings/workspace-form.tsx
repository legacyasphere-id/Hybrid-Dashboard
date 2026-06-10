'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { workspaceSchema, type WorkspaceInput } from '@/lib/validators/settings'
import { useUpdateWorkspace } from '@/hooks/use-settings'

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  solo: 'Solo',
  studio: 'Studio',
}

interface WorkspaceFormProps {
  workspaceId: string
  initialName: string
  initialSlug: string
  plan: string
}

export function WorkspaceForm({
  workspaceId,
  initialName,
  initialSlug,
  plan,
}: WorkspaceFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { name: initialName, slug: initialSlug },
  })

  const updateWorkspace = useUpdateWorkspace(workspaceId)

  function onSubmit(data: WorkspaceInput) {
    updateWorkspace.mutate(data, {
      onSuccess: () => router.refresh(),
    })
  }

  const nameRegistration = register('name', {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value
      const autoSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50)
      setValue('slug', autoSlug, { shouldDirty: true })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Workspace details</CardTitle>
        <CardDescription>Update your workspace name and URL slug.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ws-name">Workspace name</Label>
            <Input
              id="ws-name"
              {...nameRegistration}
              className="max-w-sm"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ws-slug">Slug</Label>
            <div className="flex max-w-sm items-center rounded-md border bg-muted pl-3 text-sm text-muted-foreground focus-within:ring-1 focus-within:ring-ring">
              <span className="shrink-0">sphere.studio/</span>
              <input
                id="ws-slug"
                {...register('slug')}
                className="flex-1 bg-transparent py-2 pr-3 text-foreground outline-none"
              />
            </div>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Plan</Label>
            <div>
              <Badge variant="outline" className="text-xs capitalize">
                {PLAN_LABELS[plan] ?? plan}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Plan changes are not available in this version.
            </p>
          </div>

          <Button
            type="submit"
            disabled={!isDirty || updateWorkspace.isPending}
            size="sm"
          >
            {updateWorkspace.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
