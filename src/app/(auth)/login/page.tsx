import { Logo, LoginForm } from '@/components/auth/auth-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your MeetingIQ account</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
