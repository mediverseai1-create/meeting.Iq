'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { Logo } from '@/components/auth/auth-form'

const schema = z.object({
  full_name: z.string().min(2, 'Required'),
  company: z.string().min(1, 'Required'),
  role: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  use_case: z.string().min(1, 'Required'),
})
type FormValues = z.infer<typeof schema>

const USE_CASES = [
  { value: '', label: 'Select your primary use case' },
  { value: 'client_meetings', label: 'Client meetings & sales' },
  { value: 'team_meetings', label: 'Team meetings & standups' },
  { value: 'one_on_ones', label: '1:1s & performance reviews' },
  { value: 'interviews', label: 'Interviews & recruiting' },
  { value: 'product_planning', label: 'Product planning & design' },
  { value: 'all', label: 'All of the above' },
]

const ROLES = [
  { value: '', label: 'Select your role' },
  { value: 'founder', label: 'Founder / CEO' },
  { value: 'executive', label: 'Executive / VP' },
  { value: 'manager', label: 'Manager / Director' },
  { value: 'individual_contributor', label: 'Individual contributor' },
  { value: 'sales', label: 'Sales / Account executive' },
  { value: 'product', label: 'Product manager' },
  { value: 'engineer', label: 'Engineer / Developer' },
  { value: 'recruiter', label: 'Recruiter / HR' },
  { value: 'other', label: 'Other' },
]

export function OnboardingForm({ userEmail, userName }: { userEmail: string; userName: string }) {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: userName },
  })

  async function onSubmit(values: FormValues) {
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ ...values, onboarding_completed: true })
      .eq('id', user.id)

    if (updateError) {
      setError('Failed to save. Please try again.')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to MeetingIQ</h1>
          <p className="text-sm text-slate-500 mt-1">Tell us a bit about yourself to get started</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Alex Johnson"
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <Input
              label="Company or organization"
              placeholder="Acme Inc."
              error={errors.company?.message}
              {...register('company')}
            />
            <Select
              label="Your role"
              options={ROLES}
              error={errors.role?.message}
              {...register('role')}
            />
            <Input
              label="Country"
              placeholder="United States"
              error={errors.country?.message}
              {...register('country')}
            />
            <Select
              label="Primary use case"
              options={USE_CASES}
              error={errors.use_case?.message}
              {...register('use_case')}
            />

            {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Go to MeetingIQ
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Signed in as {userEmail}
        </p>
      </div>
    </div>
  )
}
