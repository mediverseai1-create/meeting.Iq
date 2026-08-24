'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { cn, formatDate } from '@/lib/utils'
import { PLAN_LIMITS } from '@/types'
import type { Profile, Subscription } from '@/types'
import { User, Building, CreditCard, LogOut, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
  role: z.string().optional(),
  country: z.string().optional(),
})
type ProfileValues = z.infer<typeof profileSchema>

const TABS = ['profile', 'subscription'] as const
type Tab = (typeof TABS)[number]

interface Props {
  profile: Profile | null
  subscription: Subscription | null
  userEmail: string
}

export function SettingsClient({ profile, subscription, userEmail }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = React.useState<Tab>('profile')
  const [signingOut, setSigningOut] = React.useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      company: profile?.company || '',
      role: profile?.role || '',
      country: profile?.country || '',
    },
  })

  async function onSaveProfile(values: ProfileValues) {
    const { error } = await supabase.from('profiles').update(values).eq('id', profile?.id)
    if (error) {
      toast({ title: 'Failed to save', description: error.message, variant: 'error' })
    } else {
      toast({ title: 'Profile updated', variant: 'success' })
      router.refresh()
    }
  }

  async function signOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  const plan = subscription?.plan || 'free'
  const limits = PLAN_LIMITS[plan]

  const planColors = {
    free: 'bg-slate-100 text-slate-700',
    starter: 'bg-indigo-100 text-indigo-700',
    pro: 'bg-purple-100 text-purple-700',
  }

  const starterLink = process.env.NEXT_PUBLIC_STARTER_LINK || process.env.NEXT_PUBLIC_APP_URL + '/pricing'
  const proLink = process.env.NEXT_PUBLIC_PRO_LINK || process.env.NEXT_PUBLIC_APP_URL + '/pricing'

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize',
              tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <User className="h-5 w-5 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">Profile</h2>
            </div>
            <div className="mb-4 text-sm text-slate-500">
              <span className="font-medium text-slate-700">Email: </span>{userEmail}
              <span className="text-slate-400 ml-2 text-xs">(cannot be changed)</span>
            </div>
            <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
              <Input label="Full name" error={errors.full_name?.message} {...register('full_name')} />
              <Input label="Company" placeholder="Your company" {...register('company')} />
              <Input label="Role" placeholder="Your role" {...register('role')} />
              <Input label="Country" placeholder="Your country" {...register('country')} />
              <Button type="submit" loading={isSubmitting}>Save changes</Button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <LogOut className="h-5 w-5 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">Session</h2>
            </div>
            <Button variant="destructive" onClick={signOut} loading={signingOut}>Sign out</Button>
          </div>
        </div>
      )}

      {tab === 'subscription' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">Current Plan</h2>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className={cn('px-3 py-1 rounded-full text-sm font-semibold capitalize', planColors[plan])}>
                {plan}
              </span>
              {subscription?.current_period_end && (
                <span className="text-sm text-slate-500">
                  Renews {formatDate(subscription.current_period_end)}
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <UsageStat label="Meetings/month" value={limits.meetings_per_month === -1 ? 'Unlimited' : String(limits.meetings_per_month)} />
              <UsageStat label="Transcription" value={limits.transcription_minutes === -1 ? 'Unlimited' : `${limits.transcription_minutes} min`} />
              <UsageStat label="AI requests" value={limits.ai_requests === -1 ? 'Unlimited' : String(limits.ai_requests)} />
            </div>

            {plan === 'free' && (
              <div className="space-y-3">
                <Link href="/pricing">
                  <Button className="w-full sm:w-auto">
                    <ExternalLink className="h-4 w-4" />
                    View upgrade options
                  </Button>
                </Link>
              </div>
            )}

            {plan === 'starter' && (
              <Link href="/pricing">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4" />
                  Upgrade to Pro
                </Button>
              </Link>
            )}

            {plan === 'pro' && (
              <p className="text-sm text-slate-500">You&apos;re on the Pro plan — thank you!</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-base font-bold text-slate-900">{value}</p>
    </div>
  )
}
