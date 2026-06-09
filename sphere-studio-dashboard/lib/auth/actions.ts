'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { loginSchema, signupSchema } from '@/lib/validators/auth'
import type { LoginInput, SignupInput } from '@/lib/validators/auth'

export async function login(data: LoginInput): Promise<{ error: string } | never> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signup(data: SignupInput): Promise<{ error: string } | never> {
  const parsed = signupSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  })

  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function signInWithGoogle(): Promise<{ error: string } | never> {
  const supabase = createClient()
  const origin = headers().get('origin') ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })

  if (error) return { error: error.message }
  if (data.url) redirect(data.url)
  return { error: 'OAuth redirect failed' }
}

export async function signOut(): Promise<never> {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
