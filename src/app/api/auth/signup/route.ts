import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
      },
    })

    if (error) {
      if (error.message?.includes('Database error')) {
        return await adminSignup(email, password, full_name)
      }
      if (error.message?.toLowerCase().includes('rate limit') || error.message?.toLowerCase().includes('email rate')) {
        return NextResponse.json({
          error: 'Too many signup attempts. Please wait a few minutes and try again, or use a different email address.',
        }, { status: 429 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
    }

    // Ensure profile exists (in case trigger failed silently)
    await ensureProfileExists(data.user.id, email, full_name)

    return NextResponse.json({
      success: true,
      user: { id: data.user.id, email: data.user.email },
      emailConfirmationRequired: !data.session,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Signup failed'
    console.error('[Signup API]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function adminSignup(email: string, password: string, full_name?: string) {
  try {
    const admin = createAdminClient()

    // Create user bypassing the broken trigger context
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Require email confirmation
      user_metadata: { full_name },
    })

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'Signup failed' }, { status: 500 })
    }

    // Manually create profile and subscription since trigger is broken
    await ensureProfileExists(data.user.id, email, full_name)

    // Send confirmation email via admin (triggers the email confirmation flow)
    await admin.auth.admin.inviteUserByEmail(email).catch(() => {
      // inviteUserByEmail won't work if user exists; that's fine
    })

    return NextResponse.json({
      success: true,
      user: { id: data.user.id, email: data.user.email },
      emailConfirmationRequired: true,
      message: 'Account created. Please check your email to confirm your account.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Signup failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function ensureProfileExists(userId: string, email: string, full_name?: string) {
  try {
    const admin = createAdminClient()

    // Create profile if it doesn't exist
    const { error: profileError } = await admin
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: full_name || email,
      })
      .select()
      .single()

    if (profileError && profileError.code !== '23505') {
      // 23505 = unique violation (profile already exists) — that's fine
      console.error('[Signup] Profile creation error:', profileError.message)
    }

    // Create subscription if it doesn't exist
    const { error: subError } = await admin
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan: 'free',
        status: 'active',
      })
      .select()
      .single()

    if (subError && subError.code !== '23505') {
      console.error('[Signup] Subscription creation error:', subError.message)
    }
  } catch (err) {
    console.error('[Signup] ensureProfileExists error:', err)
  }
}
