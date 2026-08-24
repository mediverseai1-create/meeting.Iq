import { Logo, ForgotPasswordForm } from '@/components/auth/auth-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Forgot Password' }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
          <p className="text-sm text-slate-500 mt-1">We&apos;ll send you a reset link</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
