import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Ensure profile and subscription exist (handles cases where the DB trigger failed)
      await ensureProfileExists(data.user.id, data.user.email || '', data.user.user_metadata?.full_name)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}

async function ensureProfileExists(userId: string, email: string, full_name?: string) {
  try {
    const admin = createAdminClient()

    await admin
      .from('profiles')
      .insert({ id: userId, email, full_name: full_name || email })
      .select()
      .single()

    await admin
      .from('subscriptions')
      .insert({ user_id: userId, plan: 'free', status: 'active' })
      .select()
      .single()
  } catch {
    // Non-fatal — conflicts (23505) and other errors are fine here
  }
}
