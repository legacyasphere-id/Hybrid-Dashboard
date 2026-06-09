'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { inviteMemberSchema, type InviteMemberInput } from '@/lib/validators/settings'
import { useInviteMember } from '@/hooks/use-settings'
import { useWorkspace } from '@/lib/workspace-context'

export function InviteMemberDialog() {
  const { workspaceId, userId } = useWorkspace()
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { role: 'member' },
  })

  const invite = useInviteMember(workspaceId, userId)

  function onSubmit(data: InviteMemberInput) {
    invite.mutate(data, {
      onSuccess: () => {
        reset()
        setOpen(false)
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite member
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invite a team member</SheetTitle>
          <SheetDescription>
            The person must already have a Sphere account. They will be added immediately.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invite-role">Role</Label>
            <Select
              defaultValue="member"
              onValueChange={(v) =>
                setValue('role', v as 'admin' | 'member', { shouldValidate: true })
              }
            >
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member — CRUD on clients, projects, tasks</SelectItem>
                <SelectItem value="admin">Admin — member + workspace & member settings</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <SheetFooter className="pt-2">
            <Button type="submit" disabled={invite.isPending} className="w-full">
              {invite.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to workspace
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
