import { createBrowserClient } from '@supabase/ssr'

// Database generic is omitted intentionally: our manually-written types don't include
// the Relationships/CompositeTypes fields that @supabase/supabase-js v2 requires for
// full inference. Run `supabase gen types typescript` after CLI setup to replace this.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
