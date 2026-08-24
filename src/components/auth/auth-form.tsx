'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ---- Logo ----
export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-7', md: 'h-8', lg: 'h-10' }
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }
  return (
    <div className="flex items-center gap-2">
      <div className={cn('aspect-square rounded-lg bg-indigo-600 flex items-center justify-center', sizes[size])}>
        <svg viewBox="0 0 24 24" className="w-3/5 h-3/5 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
      </div>
      <span className={cn('font-bold text-slate-900 tracking-tight', textSizes[size])}>MeetingIQ</span>
    </div>
  )
}

// ---- Sign Up ----
const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type SignupValues = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(values: SignupValues) {
    setError(null)
    const supabase = createClient()
    const { error: signupError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })
    if (signupError) {
      setError(signupError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Check your email</h3>
        <p className="text-sm text-slate-500">We sent a confirmation link to your email address.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full name" placeholder="Alex Johnson" error={errors.full_name?.message} {...register('full_name')} />
      <Input label="Email" type="email" placeholder="alex@company.com" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register('password')} />
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      <Button type="submit" className="w-full" loading={isSubmitting}>Create account</Button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
      </p>
    </form>
  )
}

// ---- Login ----
const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginValues) {
    setError(null)
    const supabase = createClient()
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    if (loginError) {
      setError('Invalid email or password')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" placeholder="alex@company.com" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" placeholder="Your password" error={errors.password?.message} {...register('password')} />
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      <Button type="submit" className="w-full" loading={isSubmitting}>Sign in</Button>
      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign up free</Link>
      </p>
    </form>
  )
}

// ---- Forgot Password ----
const forgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type ForgotValues = z.infer<typeof forgotSchema>

export function ForgotPasswordForm() {
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
  })

  async function onSubmit(values: ForgotValues) {
    setError(null)
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Reset link sent</h3>
        <p className="text-sm text-slate-500">Check your email for the password reset link.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" placeholder="alex@company.com" error={errors.email?.message} {...register('email')} />
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      <Button type="submit" className="w-full" loading={isSubmitting}>Send reset link</Button>
      <p className="text-center text-sm text-slate-500">
        <Link href="/login" className="text-indigo-600 hover:text-indigo-700">Back to sign in</Link>
      </p>
    </form>
  )
}

// ---- Reset Password ----
const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type ResetValues = z.infer<typeof resetSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
  })

  async function onSubmit(values: ResetValues) {
    setError(null)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password: values.password })
    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">Password updated</h3>
        <p className="text-sm text-slate-500">Redirecting you to sign in…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="New password" type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register('password')} />
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      <Button type="submit" className="w-full" loading={isSubmitting}>Update password</Button>
    </form>
  )
}
