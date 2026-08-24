import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OnboardingForm } from './onboarding-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Welcome to MeetingIQ' }

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.onboarding_completed) redirect('/dashboard')

  return <OnboardingForm userEmail={user.email!} userName={profile?.full_name || ''} />
}
