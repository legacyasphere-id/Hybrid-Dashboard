import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware handles the unauthenticated redirect — this is a safety net
  if (!user) redirect('/login')

  return <>{children}</>
}
