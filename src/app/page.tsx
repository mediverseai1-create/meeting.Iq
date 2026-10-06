import Link from 'next/link'
import { ArrowRight, Brain, Zap, Shield, GitBranch, Activity, CheckCircle2, AlertTriangle, Users, Target, TrendingUp, MessageSquare } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingIQ – AI Meeting Execution Platform',
  description: 'MeetingIQ understands your business conversations and uses AI agents to turn them into executed actions — decisions captured, commitments tracked, workflows triggered automatically.',
}

const FLOW_STEPS = [
  { label: 'Conversation', desc: 'Your meeting happens', color: 'bg-slate-100 text-slate-600' },
  { label: 'Understanding', desc: 'AI reads every signal', color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Decision', desc: 'Intelligence extracted', color: 'bg-violet-50 text-violet-600' },
  { label: 'Execution', desc: 'Agents take action', color: 'bg-blue-50 text-blue-600' },
  { label: 'Follow-through', desc: 'Nothing falls through', color: 'bg-green-50 text-green-600' },
]

const AGENTS = [
  {
    icon: Brain,
    name: 'Meeting Intelligence Agent',
    desc: 'Reads every conversation and extracts decisions, commitments, risks, buying signals, objections, and open issues — structured and actionable.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: Target,
    name: 'Commitment Agent',
    desc: 'Identifies every commitment made — who promised what, by when. Tracks completion and surfaces overdue items before they become problems.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: MessageSquare,
    name: 'Follow-Up Agent',
    desc: 'Drafts professional follow-up communications based on actual meeting content. Tailored to meeting type and business context.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: TrendingUp,
    name: 'Sales Intelligence Agent',
    desc: 'Detects buying signals, objections, deal risks, and customer requirements. Gives sales teams intelligence, not just transcripts.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Activity,
    name: 'Risk Intelligence Agent',
    desc: 'Surfaces risks across meetings — timeline slippages, budget concerns, relationship friction, unresolved blockers — before they escalate.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: GitBranch,
    name: 'Executive Memory Agent',
    desc: 'Builds persistent organizational memory. Ask why a product decision was made or what a client requested three meetings ago.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
]

const MEMORY_QUERIES = [
  '"Why did we decide not to launch the enterprise tier last quarter?"',
  '"What did Acme Corp request in the last three meetings?"',
  '"Who committed to delivering the revised proposal?"',
  '"What risks did we identify in the infrastructure project?"',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">MeetingIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="#agents" className="hover:text-slate-900">AI Agents</Link>
            <Link href="#memory" className="hover:text-slate-900">Company Memory</Link>
            <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">Sign in</Link>
            <Link href="/signup" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-indigo-100">
          <Zap className="h-3 w-3" />
          AI Meeting Execution Platform
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
          Turn business conversations
          <br />
          into <span className="text-indigo-600">business execution</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          MeetingIQ&apos;s AI agents understand every meeting — extracting decisions, tracking commitments, identifying risks, and executing follow-through automatically.
        </p>

        {/* Execution flow */}
        <div className="flex items-center justify-center gap-1 mb-10 flex-wrap">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1">
              <div className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${step.color}`}>
                {step.label}
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-base flex items-center justify-center gap-2">
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto bg-slate-100 text-slate-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-base">
            See pricing
          </Link>
        </div>
        <p className="text-sm text-slate-400 mt-4">Free plan available · No credit card required</p>
      </section>

      {/* Intelligence panel mockup */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-slate-400 text-xs ml-2">Meeting Intelligence — Q4 Strategy Review</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-slate-800">
            {/* Commitments */}
            <div className="bg-slate-900 p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Commitments</span>
              </div>
              <div className="space-y-3">
                {[
                  { text: 'Deliver revised pricing model', owner: 'Sarah', deadline: 'Oct 15' },
                  { text: 'Schedule technical demo with client', owner: 'Marcus', deadline: 'Oct 10' },
                  { text: 'Review Q4 budget proposal', owner: 'Team', deadline: 'Oct 20' },
                ].map((c) => (
                  <div key={c.text} className="bg-slate-800/60 rounded-lg p-3">
                    <p className="text-xs text-slate-200 leading-snug">{c.text}</p>
                    <p className="text-xs text-slate-500 mt-1.5">{c.owner} · {c.deadline}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Risks */}
            <div className="bg-slate-900 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Risks Identified</span>
              </div>
              <div className="space-y-3">
                {[
                  { text: 'Timeline compressed — 3 weeks to launch', severity: 'high' },
                  { text: 'Budget approval pending executive sign-off', severity: 'medium' },
                  { text: 'Key engineer unavailable in November', severity: 'medium' },
                ].map((r) => (
                  <div key={r.text} className="bg-slate-800/60 rounded-lg p-3">
                    <p className="text-xs text-slate-200 leading-snug">{r.text}</p>
                    <span className={`inline-block text-xs font-medium mt-1.5 px-1.5 py-0.5 rounded ${
                      r.severity === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
                    }`}>{r.severity}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Decisions */}
            <div className="bg-slate-900 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Decisions Made</span>
              </div>
              <div className="space-y-3">
                {[
                  'Proceed with enterprise tier launch in Q4',
                  'Postpone international expansion to Q1',
                  'Hire two senior engineers before November',
                ].map((d) => (
                  <div key={d} className="bg-slate-800/60 rounded-lg p-3">
                    <p className="text-xs text-slate-200 leading-snug">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Not another transcription tool */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Not another transcription tool
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed mb-8">
            Every meeting platform records and transcribes. MeetingIQ goes further — it <strong className="text-slate-700">understands</strong> what happened and <strong className="text-slate-700">executes</strong> what needs to happen next.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <div className="bg-white rounded-xl border border-red-100 p-5">
              <p className="text-xs font-semibold text-red-500 mb-3 uppercase tracking-wide">Traditional tools do this</p>
              <ul className="space-y-2 text-sm text-slate-500">
                {['Record audio', 'Transcribe speech', 'Generate a summary', 'List action items'].map((i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-red-300 mt-0.5">×</span>{i}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-indigo-200 p-5">
              <p className="text-xs font-semibold text-indigo-600 mb-3 uppercase tracking-wide">MeetingIQ does this</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {[
                  'Extracts decisions with business context',
                  'Tracks commitments with owners and deadlines',
                  'Identifies risks before they escalate',
                  'Detects buying signals in sales meetings',
                  'Builds persistent organizational memory',
                  'Executes follow-through automatically',
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents */}
      <section id="agents" className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-violet-100">
              <Zap className="h-3 w-3" />
              AI Agent Layer
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Six specialized AI agents</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Each agent focuses on a specific dimension of business communication intelligence.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AGENTS.map((agent) => (
              <div key={agent.name} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
                <div className={`h-9 w-9 rounded-lg ${agent.bg} flex items-center justify-center mb-4`}>
                  <agent.icon className={`h-4.5 w-4.5 ${agent.color}`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{agent.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Execution example */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What happens after a meeting ends</h2>
            <p className="text-slate-500">MeetingIQ goes to work the moment the conversation is over.</p>
          </div>
          <div className="space-y-3">
            {[
              { step: 1, icon: Brain, text: 'AI reads the meeting — notes, transcript, context', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { step: 2, icon: Target, text: 'Identifies 7 commitments, assigns owners, flags deadlines', color: 'text-violet-600', bg: 'bg-violet-50' },
              { step: 3, icon: AlertTriangle, text: 'Surfaces 2 risks for immediate attention', color: 'text-orange-600', bg: 'bg-orange-50' },
              { step: 4, icon: CheckCircle2, text: 'Creates action items with correct priorities', color: 'text-green-600', bg: 'bg-green-50' },
              { step: 5, icon: MessageSquare, text: 'Drafts personalized follow-up email ready to send', color: 'text-blue-600', bg: 'bg-blue-50' },
              { step: 6, icon: GitBranch, text: 'Stores everything in Company Memory — searchable forever', color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-4">
                <div className={`h-8 w-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-slate-700 font-medium">{item.text}</p>
                </div>
                <span className="text-xs text-slate-400 font-medium shrink-0 mt-1.5">{String(item.step).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Memory */}
      <section id="memory" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-rose-100">
              <Brain className="h-3 w-3" />
              Company Memory
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your organization&apos;s institutional knowledge</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Ask questions across your entire meeting history. MeetingIQ retrieves and reasons across conversations — not just searches keywords.</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 space-y-3">
            {MEMORY_QUERIES.map((q, i) => (
              <div key={i} className="bg-slate-800 rounded-xl px-4 py-3 flex items-start gap-3">
                <Users className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-200 italic">{q}</p>
              </div>
            ))}
            <p className="text-xs text-slate-500 text-center pt-2">Ask anything about your meeting history in natural language</p>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple pricing</h2>
          <p className="text-slate-500 mb-8">Start free. Upgrade when you need more.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { name: 'Free', price: '$0', desc: '5 meetings/mo · 10 AI requests' },
              { name: 'Starter', price: '$47/mo', desc: '50 meetings/mo · 200 AI requests', highlight: false },
              { name: 'Pro', price: '$97/mo', desc: 'Unlimited · Full agent suite', highlight: true },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl border p-5 ${(p as { highlight?: boolean }).highlight ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200'}`}>
                <p className={`text-sm font-semibold mb-1 ${(p as { highlight?: boolean }).highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{p.name}</p>
                <p className={`text-2xl font-bold mb-2 ${(p as { highlight?: boolean }).highlight ? 'text-white' : 'text-slate-900'}`}>{p.price}</p>
                <p className={`text-xs ${(p as { highlight?: boolean }).highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{p.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/pricing" className="inline-flex items-center gap-1.5 text-indigo-600 font-medium hover:text-indigo-700 text-sm">
            See full pricing details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Stop losing what matters in meetings</h2>
        <p className="text-lg text-slate-500 mb-8">MeetingIQ turns every business conversation into tracked decisions, committed actions, and executed follow-through.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors">
          Get started free
          <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="text-sm text-slate-400 mt-4">Free plan · No credit card required</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-indigo-600 flex items-center justify-center">
              <Brain className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">MeetingIQ</span>
            <span className="text-xs text-slate-400 ml-1">AI Meeting Execution Platform</span>
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
