import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingIQ – AI Meeting Execution Platform',
  description: 'MeetingIQ understands your business conversations and uses AI agents to turn them into executed actions — decisions captured, commitments tracked, workflows triggered automatically.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO SECTION — Lime yellow (like Linktree)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#d4f84a] min-h-screen relative overflow-hidden">

        {/* Floating pill nav */}
        <div className="sticky top-4 z-50 px-4 pt-4">
          <nav className="max-w-5xl mx-auto bg-white rounded-full shadow-xl shadow-black/10 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#0a0520] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              </div>
              <span className="font-extrabold text-[#0a0520] text-lg tracking-tight">MeetingIQ</span>
            </div>
            <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
              <Link href="#agents" className="hover:text-black transition-colors">Agents</Link>
              <Link href="#how" className="hover:text-black transition-colors">How it works</Link>
              <Link href="#memory" className="hover:text-black transition-colors">Memory</Link>
              <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-black">Log in</Link>
              <Link href="/signup" className="text-sm font-black bg-[#0a0520] text-white px-6 py-2.5 rounded-full hover:bg-[#1a0a40] transition-colors">
                Sign up free
              </Link>
            </div>
          </nav>
        </div>

        {/* Hero content */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-0 grid lg:grid-cols-2 gap-8 items-end min-h-[90vh]">
          {/* Left — text */}
          <div className="pb-16">
            <h1 className="text-[72px] sm:text-[88px] font-black text-[#0a0520] leading-[0.95] tracking-tight mb-6">
              AI that turns meetings into results.
            </h1>
            <p className="text-xl text-[#0a0520]/70 leading-relaxed mb-8 max-w-md font-medium">
              MeetingIQ&apos;s AI agents understand every business conversation — extracting decisions, tracking commitments, identifying risks, and executing follow-through automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center font-black bg-[#0a0520] text-[#d4f84a] px-8 py-4 rounded-full text-base hover:bg-[#1a0a40] transition-colors">
                Get started free
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center font-black bg-white/50 text-[#0a0520] px-8 py-4 rounded-full text-base hover:bg-white/70 transition-colors">
                View pricing
              </Link>
            </div>
            <p className="text-sm text-[#0a0520]/50 mt-4 font-medium">Free plan available · No credit card required</p>
          </div>

          {/* Right — intelligence card visual */}
          <div className="self-end">
            <div className="bg-[#0a0520] rounded-t-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">AI Intelligence</p>
                  <p className="text-white font-black text-xl mt-0.5">Q4 Strategy Review</p>
                </div>
                <span className="text-xs font-black bg-[#d4f84a] text-[#0a0520] px-3 py-1.5 rounded-full">Analyzed ✓</span>
              </div>
              <div className="space-y-3 mb-4">
                {[
                  { color: 'bg-violet-500/20 border-violet-500/20', dot: 'bg-violet-400', label: 'Commitments', count: '7 found', items: ['Revised pricing model — Sarah · Oct 15', 'Technical demo — Marcus · Oct 10'] },
                  { color: 'bg-orange-500/20 border-orange-500/20', dot: 'bg-orange-400', label: 'Risks', count: '3 found', items: ['Timeline compressed — 3 weeks to launch', 'Budget approval pending sign-off'] },
                  { color: 'bg-green-500/20 border-green-500/20', dot: 'bg-green-400', label: 'Decisions Made', count: '4 found', items: ['Proceed with enterprise launch Q4', 'Hire 2 engineers before November'] },
                ].map((b) => (
                  <div key={b.label} className={`rounded-2xl border ${b.color} p-4`}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className={`h-2 w-2 rounded-full ${b.dot}`} />
                      <span className="text-xs font-black text-white uppercase tracking-widest">{b.label}</span>
                      <span className="text-xs text-slate-400 font-semibold ml-auto">{b.count}</span>
                    </div>
                    {b.items.map((item) => (
                      <p key={item} className="text-xs text-white/60 bg-black/20 rounded-lg px-3 py-2 mb-1.5 last:mb-0">{item}</p>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/10">
                <span>Analyzed 4 minutes ago</span>
                <span className="text-[#d4f84a] font-black">View full report →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — Electric blue (like Linktree)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#1a56db] py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — step list visual */}
          <div className="bg-white/10 rounded-3xl p-6 border border-white/10 space-y-3">
            {[
              { n: '01', icon: '📖', text: 'Paste transcript or record audio', sub: 'From Zoom, Teams, Google Meet, or type notes directly' },
              { n: '02', icon: '🧠', text: 'AI reads every signal', sub: 'Decisions, commitments, risks, buying signals, objections' },
              { n: '03', icon: '🎯', text: 'Intelligence is structured', sub: 'Named owners, deadlines, severities — nothing abstract' },
              { n: '04', icon: '✉️', text: 'Follow-up is executed', sub: 'Email drafted, actions created, risks flagged automatically' },
              { n: '05', icon: '🏛️', text: 'Memory grows smarter', sub: 'Ask questions across all meetings in plain English' },
            ].map((step) => (
              <div key={step.n} className="flex items-center gap-4 bg-white/10 rounded-2xl px-4 py-3">
                <span className="text-xl shrink-0">{step.icon}</span>
                <div className="flex-1">
                  <p className="font-black text-white text-sm">{step.text}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{step.sub}</p>
                </div>
                <span className="text-xs font-black text-white/30 shrink-0">{step.n}</span>
              </div>
            ))}
          </div>

          {/* Right — text */}
          <div>
            <p className="text-xs font-black text-blue-200 uppercase tracking-widest mb-4">How MeetingIQ works</p>
            <h2 className="text-[62px] font-black text-white leading-[1.0] tracking-tight mb-6">
              From conversation<br />to execution.<br />Automatically.
            </h2>
            <p className="text-blue-200 text-xl leading-relaxed mb-8 font-medium">
              Five steps. Zero manual work. Every meeting becomes structured intelligence that your team can act on immediately.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#d4f84a] text-[#0a0520] font-black px-8 py-4 rounded-full text-base hover:bg-[#c5e840] transition-colors">
              Get started free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — Dark purple / stats
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#0a0520] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-[64px] sm:text-[80px] font-black text-white leading-[0.95] tracking-tight mb-4">
            Meetings cost<br /><span className="text-[#a78bfa]">more than</span><br />you think.
          </h2>
          <p className="text-slate-400 text-xl max-w-xl mb-16 leading-relaxed font-medium">
            Most meeting value disappears between the last word spoken and the first action taken. MeetingIQ closes that gap permanently.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { stat: '71%', desc: 'of meetings end without clear next steps that get followed up on', color: 'text-[#d4f84a]' },
              { stat: '$37B', desc: 'lost annually to unproductive meetings in the US alone', color: 'text-[#a78bfa]' },
              { stat: '3.2×', desc: 'longer to complete projects when follow-through is manual and untracked', color: 'text-[#67e8f9]' },
            ].map((s) => (
              <div key={s.stat} className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <p className={`text-6xl font-black mb-3 ${s.color}`}>{s.stat}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — Bright indigo / agents
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="agents" className="bg-[#4f46e5] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-4">AI Agent Layer</p>
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <h2 className="text-[64px] font-black text-white leading-[0.95] tracking-tight">
                Six AI agents.<br />One unified<br />intelligence.
              </h2>
              <p className="text-indigo-200 text-xl leading-relaxed font-medium pb-2">
                Each agent focuses on a specific dimension of business communication — working together automatically after every meeting ends.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🧠', name: 'Meeting Intelligence Agent', desc: 'Reads every conversation and extracts decisions, commitments, risks, buying signals, objections, and open issues — structured and ready to act on.' },
              { icon: '🎯', name: 'Commitment Agent', desc: 'Identifies every promise made — who, what, by when. Tracks completion and surfaces overdue commitments before they become problems.' },
              { icon: '✉️', name: 'Follow-Up Agent', desc: 'Drafts professional follow-up emails and meeting recaps based on actual content — tailored to the meeting type and participants.' },
              { icon: '📈', name: 'Sales Intelligence Agent', desc: 'Detects buying signals, concerns, deal risks, and customer requirements. Gives sales teams real intelligence, not just transcripts.' },
              { icon: '⚠️', name: 'Risk Intelligence Agent', desc: 'Surfaces risks — timeline slippages, budget concerns, relationship friction — categorized by severity before they escalate.' },
              { icon: '🏛️', name: 'Executive Memory Agent', desc: 'Builds persistent organizational memory. Ask why a decision was made or what a client requested three meetings ago.' },
            ].map((a) => (
              <div key={a.name} className="bg-white/10 border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="text-4xl mb-4">{a.icon}</div>
                <h3 className="font-black text-white text-base mb-2">{a.name}</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 5 — White / comparison
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[64px] font-black text-[#0a0520] leading-[0.95] tracking-tight mb-6">
              Not another<br />transcription<br />tool.
            </h2>
            <p className="text-slate-500 text-xl leading-relaxed font-medium mb-8">
              Every platform records and summarizes. MeetingIQ <strong className="text-slate-900">understands</strong> and <strong className="text-slate-900">executes</strong>. The difference shows in your results — not your notes.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#0a0520] text-white font-black px-8 py-4 rounded-full text-base hover:bg-[#4f46e5] transition-colors">
              Try it free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border-2 border-slate-200 p-6">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Other tools</p>
              <ul className="space-y-3">
                {['Records audio', 'Transcribes speech', 'Generates a summary', 'Lists action items', 'You follow up manually', 'Memory: none'].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-slate-300 font-black shrink-0">✗</span>{i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border-2 border-[#4f46e5] bg-indigo-50 p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4f46e5] text-white text-xs font-black px-4 py-1 rounded-full whitespace-nowrap">MeetingIQ</div>
              <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-5 mt-1">Execution</p>
              <ul className="space-y-3">
                {['Understands business meaning', 'Extracts commitments + owners', 'Identifies risks by severity', 'Detects buying signals', 'AI drafts follow-up emails', 'Persistent org memory'].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-800 font-semibold">
                    <span className="text-[#4f46e5] font-black shrink-0">✓</span>{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 6 — Use cases / lime
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#d4f84a] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <h2 className="text-[64px] font-black text-[#0a0520] leading-[0.95] tracking-tight mb-4">
              Every team.<br />Every meeting type.
            </h2>
            <p className="text-[#0a0520]/60 text-xl font-medium max-w-lg">MeetingIQ adapts its intelligence to whatever meeting you&apos;re in.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🤝', title: 'Sales Calls', desc: 'Capture buying signals, objections, and deal requirements. Know where every deal stands without manually updating CRM.' },
              { icon: '👔', title: 'Executive Reviews', desc: 'Log strategic decisions and commitments from leadership. Build a searchable archive of organizational intelligence across quarters.' },
              { icon: '🏗️', title: 'Project Standups', desc: 'Track blockers, commitments, and risks across your sprint cycle. Automated status summaries without extra effort.' },
              { icon: '👥', title: 'Client Meetings', desc: 'Never forget a client request or commitment. Full history of every promise made, requirement raised, and concern expressed.' },
              { icon: '🧪', title: 'Product Reviews', desc: 'Capture feature requests, edge cases, and product decisions. Turn every review into a structured backlog of insights.' },
              { icon: '💼', title: 'Board Meetings', desc: 'Maintain a precise record of investor questions, board decisions, and strategic commitments. Always know who committed to what.' },
            ].map((uc) => (
              <div key={uc.title} className="bg-[#0a0520] rounded-2xl p-6 hover:bg-[#1a0a40] transition-colors">
                <div className="text-3xl mb-4">{uc.icon}</div>
                <h3 className="font-black text-white text-base mb-2">{uc.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 7 — Company Memory / dark navy
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="memory" className="bg-[#0a0520] py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-black text-[#d4f84a] uppercase tracking-widest mb-4">Company Memory</p>
            <h2 className="text-[64px] font-black text-white leading-[0.95] tracking-tight mb-6">
              Your organization<br />never forgets<br />again.
            </h2>
            <p className="text-slate-400 text-xl leading-relaxed mb-8 font-medium">
              MeetingIQ builds a searchable memory of every decision, commitment, and conversation across your organization. Ask in plain English and get cited answers.
            </p>
            <div className="space-y-3 mb-8">
              {[
                '"Why did we decide not to launch the enterprise tier?"',
                '"What did Acme Corp request in the last three meetings?"',
                '"Who committed to delivering the revised proposal?"',
                '"What risks have we identified in the infrastructure project?"',
              ].map((q) => (
                <div key={q} className="flex items-start gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <span className="text-[#d4f84a] font-black shrink-0">→</span>
                  <p className="text-sm text-slate-300 italic">{q}</p>
                </div>
              ))}
            </div>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#d4f84a] text-[#0a0520] font-black px-8 py-4 rounded-full hover:bg-[#c5e840] transition-colors">
              Access Company Memory
            </Link>
          </div>

          {/* Memory mockup */}
          <div className="bg-[#140d35] rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 bg-[#d4f84a] rounded-xl flex items-center justify-center text-lg">🏛️</div>
              <div>
                <p className="text-white font-black">Company Memory</p>
                <p className="text-slate-500 text-xs">47 meetings indexed</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl border border-white/10 px-4 py-3 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <span className="text-slate-400 text-sm">Ask anything about your meeting history…</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <p className="text-xs text-[#d4f84a] font-black mb-3 flex items-center gap-1.5">🧠 AI Answer</p>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                The enterprise tier was postponed in the <span className="text-[#d4f84a] font-semibold">Oct Board Review</span> due to insufficient engineering capacity. Marcus committed to revisiting after the Q1 hire (see <span className="text-[#d4f84a] font-semibold">Nov 12 Planning</span>).
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-white/10 text-slate-400 px-3 py-1 rounded-full">Oct Board Review</span>
                <span className="text-xs bg-white/10 text-slate-400 px-3 py-1 rounded-full">Nov 12 Planning</span>
                <span className="text-xs bg-white/10 text-slate-400 px-3 py-1 rounded-full">+2 more</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-3">
              {[['47', 'Meetings'], ['312', 'Insights'], ['89', 'Commitments']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="text-xl font-black text-[#d4f84a]">{n}</p>
                  <p className="text-xs text-slate-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 8 — Pricing / white
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-[64px] font-black text-[#0a0520] leading-tight">
              Simple pricing.<br />Real results.
            </h2>
            <p className="text-slate-500 text-xl mt-4 font-medium">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name: 'Free', price: '$0', period: '', cta: 'Get started free', href: '/signup', highlight: false, features: ['5 meetings / month', '30 min transcription', '10 AI requests', '1 GB storage', 'Basic intelligence', 'Company Memory (limited)'] },
              { name: 'Starter', price: '$47', period: '/mo', cta: 'Get Starter', href: '/pricing', highlight: false, features: ['50 meetings / month', '600 min transcription', '200 AI requests', '10 GB storage', 'Full intelligence suite', 'Commitment tracking', 'Risk detection', 'Follow-up agent', 'All templates'] },
              { name: 'Pro', price: '$97', period: '/mo', cta: 'Get Pro', href: '/pricing', highlight: true, features: ['Unlimited meetings', 'Unlimited transcription', 'Unlimited AI requests', '100 GB storage', 'Everything in Starter', 'Sales intelligence agent', 'Full Company Memory', 'Cross-meeting AI search', 'Priority support'] },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-3xl border-2 p-8 flex flex-col ${plan.highlight ? 'bg-[#0a0520] border-[#0a0520]' : 'bg-white border-slate-200'}`}>
                <div className="mb-6">
                  {plan.highlight && <p className="text-xs font-black text-[#d4f84a] uppercase tracking-widest mb-2">Most popular</p>}
                  <p className={`text-sm font-black mb-2 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-5xl font-black ${plan.highlight ? 'text-white' : 'text-[#0a0520]'}`}>{plan.price}</span>
                    {plan.period && <span className={`text-base mb-2 font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-400'}`}>{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm font-medium ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                      <span className={`font-black shrink-0 mt-0.5 ${plan.highlight ? 'text-[#d4f84a]' : 'text-[#4f46e5]'}`}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block text-center font-black py-4 rounded-full text-sm transition-colors ${plan.highlight ? 'bg-[#d4f84a] text-[#0a0520] hover:bg-[#c5e840]' : 'bg-[#0a0520] text-white hover:bg-[#4f46e5]'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 9 — Testimonials / slate
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-[56px] font-black text-[#0a0520] leading-tight mb-14">
            Teams that take<br />execution seriously.
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { quote: 'We used to lose 40% of our action items between the meeting and the follow-up email. MeetingIQ eliminated that completely.', name: 'Head of Operations', company: 'SaaS company, 80 people' },
              { quote: 'The commitment tracking alone is worth it. I can see across every meeting who promised what and whether it happened.', name: 'VP of Sales', company: 'B2B software firm' },
              { quote: 'Our board meetings are archived and searchable. We can pull any decision or commitment from the last 18 months in seconds.', name: 'Chief of Staff', company: 'Series B startup' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-3xl border border-slate-200 p-7">
                <p className="text-slate-700 leading-relaxed mb-6 italic text-base">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-black text-[#0a0520]">{t.name}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 10 — FAQ / Dark crimson (Linktree style)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#6b0f1a] py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-[64px] font-black text-[#ffb3c1] text-center leading-tight mb-14">
            Questions?<br />Answered.
          </h2>
          <div className="space-y-3">
            {[
              { q: 'Is MeetingIQ just another AI transcription tool?', a: 'No. Transcription tools record and summarize. MeetingIQ goes further — it understands business conversations, extracts structured intelligence (commitments, risks, buying signals, decisions), and executes follow-through automatically. It\'s the execution layer between your conversations and your business operations.' },
              { q: 'What meeting types does MeetingIQ support?', a: 'All of them. Sales calls, executive reviews, project standups, client meetings, board sessions, product reviews, investor updates — MeetingIQ adapts its intelligence extraction to the context and type of each meeting.' },
              { q: 'How does Company Memory work?', a: 'Every analyzed meeting is indexed into a searchable organizational memory. Ask questions in plain English across your entire history — "Why did we make this decision?" or "What did a client request?" — and get AI-reasoned answers with citations to specific meetings.' },
              { q: 'Do I need to record my meetings?', a: 'No. Paste a transcript from any source (Zoom, Teams, Google Meet, Otter, Fireflies) or type notes manually. MeetingIQ works from whatever content you provide. Audio recording is also available directly in the browser.' },
              { q: 'How is this different from Otter, Fireflies, or Notion AI?', a: 'Those tools give you text. MeetingIQ gives you execution. It identifies the owner behind every commitment, the severity of every risk, the signals behind every sales conversation — then helps you act on all of it.' },
              { q: 'Is my meeting data private and secure?', a: 'Yes. All your meetings are protected with row-level security — only you can access your data. We use enterprise-grade infrastructure. Your meetings are never used to train AI models.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel at any time from your settings. Your data remains accessible until the end of your billing period. No questions asked, no penalties.' },
              { q: 'What languages are supported?', a: 'MeetingIQ works with meeting content in English. AI analysis is performed in English. Multi-language support for transcription is on the roadmap.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-[#7d1424]/60 border border-white/10 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="font-bold text-[#ffb3c1] text-base pr-4">{faq.q}</span>
                  <span className="text-[#ffb3c1] shrink-0 text-2xl font-black group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-[#ffd5dc]/75 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FINAL CTA — Lime (matches Linktree energy)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#d4f84a] py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-[72px] font-black text-[#0a0520] leading-[0.95] tracking-tight mb-6">
            Stop losing what<br />matters in meetings.
          </h2>
          <p className="text-[#0a0520]/60 text-xl mb-10 font-medium leading-relaxed">
            MeetingIQ turns every business conversation into tracked decisions, committed actions, and executed follow-through.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0a0520] text-[#d4f84a] font-black px-10 py-4 rounded-full text-lg hover:bg-[#1a0a40] transition-colors">
              Get started free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto inline-flex items-center justify-center bg-white/50 text-[#0a0520] font-black px-10 py-4 rounded-full text-lg hover:bg-white/70 transition-colors">
              View pricing
            </Link>
          </div>
          <p className="text-[#0a0520]/40 text-sm mt-6 font-medium">Free plan · No credit card required · Set up in 2 minutes</p>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOOTER — Dark
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer className="bg-[#0a0520] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-xl bg-[#d4f84a] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-[#0a0520]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                </div>
                <span className="font-black text-white text-xl">MeetingIQ</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">AI Meeting Execution Platform. Turning business conversations into business results.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">
              <div>
                <p className="font-black text-slate-300 mb-4">Platform</p>
                <ul className="space-y-2.5 text-slate-500">
                  <li><Link href="#agents" className="hover:text-slate-300 transition-colors">AI Agents</Link></li>
                  <li><Link href="#memory" className="hover:text-slate-300 transition-colors">Company Memory</Link></li>
                  <li><Link href="#how" className="hover:text-slate-300 transition-colors">How it works</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-black text-slate-300 mb-4">Product</p>
                <ul className="space-y-2.5 text-slate-500">
                  <li><Link href="/pricing" className="hover:text-slate-300 transition-colors">Pricing</Link></li>
                  <li><Link href="/signup" className="hover:text-slate-300 transition-colors">Sign up</Link></li>
                  <li><Link href="/login" className="hover:text-slate-300 transition-colors">Log in</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-black text-slate-300 mb-4">Company</p>
                <ul className="space-y-2.5 text-slate-500">
                  <li><span className="cursor-default">meetingiq.online</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} MeetingIQ. All rights reserved.</p>
            <p className="text-xs text-slate-600">AI Meeting Execution Platform</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
