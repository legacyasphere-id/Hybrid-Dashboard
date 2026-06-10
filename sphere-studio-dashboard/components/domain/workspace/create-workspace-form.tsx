'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createWorkspace } from '@/lib/auth/workspace-actions'
import { workspaceSchema, type WorkspaceInput } from '@/lib/validators/auth'

export function CreateWorkspaceForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
  })

  const nameValue = watch('name') ?? ''
  const slugPreview = nameValue
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  function onSubmit(data: WorkspaceInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await createWorkspace(data)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Workspace name</Label>
        <Input
          id="name"
          type="text"
          placeholder="My Studio"
          autoFocus
          {...register('name')}
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        ) : slugPreview ? (
          <p className="text-xs text-muted-foreground">
            Your URL will be{' '}
            <span className="font-mono text-foreground">/{slugPreview}</span>
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating workspace…' : 'Create workspace'}
      </Button>
    </form>
  )
}
