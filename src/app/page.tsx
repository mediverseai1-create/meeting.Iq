import Link from 'next/link'
import { Check, ChevronRight, Mic, FileText, Lightbulb, CheckSquare, Search, Users, Zap, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingIQ – AI Meeting Intelligence',
  description: 'Capture, transcribe, and act on every meeting. AI-powered notes, summaries, and action items.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-indigo-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-lg">MeetingIQ</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hidden sm:block text-sm text-slate-600 hover:text-slate-900">Pricing</Link>
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">Sign in</Link>
            <Link href="/signup" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Zap className="h-3 w-3" />
          AI-powered meeting intelligence
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          Never miss what
          <br />
          <span className="text-indigo-600">matters</span> in a meeting
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          MeetingIQ captures your meeting notes, enhances them with AI, extracts action items, and helps you prepare better — so you can focus on the conversation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-base">
            Start for free
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto bg-slate-100 text-slate-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-base">
            See pricing
          </Link>
        </div>
        <p className="text-sm text-slate-400 mt-4">Free plan available · No credit card required</p>
      </section>

      {/* Product screenshot placeholder */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <p className="text-slate-400 text-sm">MeetingIQ workspace</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need from a meeting</h2>
            <p className="text-lg text-slate-500">From preparation to follow-up</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Mic, title: 'Record & Transcribe', desc: 'Capture meeting audio directly in your browser. Paste transcripts from external tools for AI analysis.' },
              { icon: FileText, title: 'AI-Enhanced Notes', desc: 'Write rough notes during the meeting. Let AI clean them up, organize them, and fill in the gaps from the transcript.' },
              { icon: Lightbulb, title: 'Smart Summaries', desc: 'Instant AI summaries with executive overview, key decisions, open questions, and important topics.' },
              { icon: CheckSquare, title: 'Action Item Extraction', desc: 'Automatically identify commitments and next steps. Assign owners, set due dates, track completion.' },
              { icon: Search, title: 'Meeting Search', desc: 'Search across all your meetings, notes, and action items. Ask AI questions across your entire meeting history.' },
              { icon: Users, title: 'Follow-up Generation', desc: 'Generate professional follow-up emails and meeting recaps based on actual meeting content in one click.' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How MeetingIQ works</h2>
        </div>
        <div className="space-y-6">
          {[
            { step: '01', title: 'Create a meeting', desc: 'Set up your meeting workspace with title, type, participants, and context. Choose from templates for common meeting types.' },
            { step: '02', title: 'Capture and take notes', desc: 'Record audio or take notes while the meeting happens. Your notes auto-save as you type.' },
            { step: '03', title: 'Analyze with AI', desc: 'Click Analyze to generate a summary, extract action items, identify decisions, and enhance your notes.' },
            { step: '04', title: 'Follow up and act', desc: 'Generate follow-up emails, review action items, ask questions about the meeting, and search your history.' },
          ].map((item, i) => (
            <div key={item.step} className="flex gap-6 items-start">
              <div className="text-3xl font-bold text-indigo-100 shrink-0 w-12">{item.step}</div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple pricing</h2>
          <p className="text-slate-500 mb-8">Start free. Upgrade when you need more.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { name: 'Free', price: '$0', desc: '5 meetings/mo · 30 min transcription · 10 AI requests' },
              { name: 'Starter', price: '$47/mo', desc: '50 meetings/mo · 600 min transcription · 200 AI requests', highlight: false },
              { name: 'Pro', price: '$97/mo', desc: 'Unlimited everything · 100 GB storage · Priority support', highlight: true },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl border p-5 ${p.highlight ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm font-semibold mb-1 ${p.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{p.name}</p>
                <p className={`text-2xl font-bold mb-2 ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.price}</p>
                <p className={`text-xs ${p.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{p.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/pricing" className="inline-flex items-center gap-1.5 text-indigo-600 font-medium hover:text-indigo-700">
            See full pricing details <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Start making meetings count</h2>
        <p className="text-lg text-slate-500 mb-8">Join professionals who never miss a follow-up.</p>
        <Link href="/signup" className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors">
          Get started free
        </Link>
        <p className="text-sm text-slate-400 mt-4">Free plan · No credit card required</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-indigo-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-900">MeetingIQ</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
            <Link href="/login" className="hover:text-slate-900">Sign in</Link>
            <Link href="/signup" className="hover:text-slate-900">Sign up</Link>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} MeetingIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
