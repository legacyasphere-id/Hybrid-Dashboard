import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/settings/profile-form'

export default async function ProfileSettingsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  const p = profile as { full_name: string | null; avatar_url: string | null } | null

  return (
    <ProfileForm
      userId={user.id}
      email={user.email ?? ''}
      initialFullName={p?.full_name ?? ''}
      initialAvatarUrl={p?.avatar_url ?? null}
    />
  )
}
