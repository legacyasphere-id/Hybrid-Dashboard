'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Camera } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { profileSchema, type ProfileInput } from '@/lib/validators/settings'
import {
  useUpdateProfile,
  useUploadAvatar,
  useSendPasswordReset,
} from '@/hooks/use-settings'

interface ProfileFormProps {
  userId: string
  email: string
  initialFullName: string
  initialAvatarUrl: string | null
}

function initials(name: string, email: string): string {
  if (name.trim()) {
    const parts = name.trim().split(' ')
    return parts.length >= 2
      ? `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

export function ProfileForm({
  userId,
  email,
  initialFullName,
  initialAvatarUrl,
}: ProfileFormProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: initialFullName },
  })

  const fullName = watch('full_name')
  const updateProfile = useUpdateProfile(userId)
  const uploadAvatar = useUploadAvatar(userId)
  const sendReset = useSendPasswordReset()

  function onSubmit(data: ProfileInput) {
    updateProfile.mutate(data, {
      onSuccess: () => router.refresh(),
    })
  }

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2 MB')
      return
    }
    uploadAvatar.mutate(file, {
      onSuccess: (url) => {
        setAvatarUrl(url)
        router.refresh()
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Avatar</CardTitle>
          <CardDescription>Click the avatar to upload a new photo (max 2 MB).</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl ?? undefined} alt={fullName} />
              <AvatarFallback className="text-lg">
                {initials(fullName, email)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-background transition-opacity hover:opacity-80 disabled:opacity-50"
              aria-label="Upload avatar"
            >
              {uploadAvatar.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onAvatarChange}
          />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{fullName || email}</p>
            <p>{email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display name</CardTitle>
          <CardDescription>This is how your name appears across the workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" {...register('full_name')} className="max-w-sm" />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={!isDirty || updateProfile.isPending}
              size="sm"
            >
              {updateProfile.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email address</CardTitle>
          <CardDescription>
            Your login email. Contact support to change it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="max-w-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
          <CardDescription>
            Send a password reset link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Button
            variant="outline"
            size="sm"
            disabled={sendReset.isPending}
            onClick={() => sendReset.mutate(email)}
          >
            {sendReset.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send reset email
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
