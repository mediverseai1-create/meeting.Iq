import Link from 'next/link'
import { Check } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pricing' }

const PLANS = [
  {
    name: 'Starter',
    price: 47,
    description: 'For professionals who want to capture and understand every meeting.',
    envKey: 'NEXT_PUBLIC_STARTER_PAYMENT_LINK',
    color: 'border-slate-200',
    badge: '',
    features: [
      '50 meetings per month',
      '600 minutes transcription',
      '200 AI requests',
      '10 GB storage',
      'AI note enhancement',
      'Meeting summaries',
      'Action item extraction',
      'Follow-up generation',
      'Meeting search',
      'All templates',
    ],
  },
  {
    name: 'Pro',
    price: 97,
    description: 'Unlimited meetings and AI for power users and teams.',
    envKey: 'NEXT_PUBLIC_PRO_PAYMENT_LINK',
    color: 'border-indigo-500',
    badge: 'Most popular',
    features: [
      'Unlimited meetings',
      'Unlimited transcription',
      'Unlimited AI requests',
      '100 GB storage',
      'Everything in Starter',
      'Cross-meeting AI search',
      'Priority support',
      'Advanced analytics',
      'Export & sharing',
    ],
  },
]

export default function PricingPage() {
  const starterLink = process.env.NEXT_PUBLIC_STARTER_PAYMENT_LINK
  const proLink = process.env.NEXT_PUBLIC_PRO_PAYMENT_LINK

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-indigo-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900">MeetingIQ</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">Sign in</Link>
          <Link href="/signup" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">
            Get started
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-slate-500">Start free. Upgrade when you&apos;re ready.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {PLANS.map((plan) => {
            const link = plan.name === 'Starter' ? starterLink : proLink
            const isPro = plan.name === 'Pro'
            return (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl border-2 p-8 relative ${plan.color} ${isPro ? 'shadow-lg' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.badge}</span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                  <p className="text-slate-500 text-sm mt-1">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                </div>

                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-colors mb-6 ${
                      isPro
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    Get started with {plan.name}
                  </a>
                ) : (
                  <div className="mb-6 space-y-2">
                    <div className={`block w-full text-center py-3 rounded-lg font-semibold text-sm bg-slate-200 text-slate-500 cursor-not-allowed`}>
                      Payment link not configured
                    </div>
                    <p className="text-xs text-slate-400 text-center">Add {plan.envKey} to your .env.local</p>
                  </div>
                )}

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Free tier */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Free tier</h3>
              <p className="text-slate-500 text-sm mt-1">5 meetings/mo · 30 min transcription · 10 AI requests</p>
            </div>
            <Link href="/signup" className="bg-slate-100 text-slate-900 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors">
              Start free
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do I need a credit card to start?',
                a: 'No. The free tier requires no credit card. Upgrade when you need more.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel at any time from your settings. Your data remains accessible until the end of your billing period.',
              },
              {
                q: 'How does transcription work?',
                a: 'Record meeting audio directly in MeetingIQ, or paste a transcript from an external tool. AI then analyzes the content.',
              },
              {
                q: 'Is my meeting data private?',
                a: 'Yes. Your meetings are private by default and protected with row-level security. Only you can access your data.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
