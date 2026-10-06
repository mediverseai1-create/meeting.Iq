'use client'

import * as React from 'react'
import {
  Brain, Target, AlertTriangle, CheckCircle2, TrendingUp,
  MessageSquare, Lightbulb, ChevronDown, ChevronUp, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MeetingInsights } from '@/types'

interface Props {
  insights: MeetingInsights | null
  onGenerate: () => void
  generating: boolean
}

export function IntelligencePanel({ insights, onGenerate, generating }: Props) {
  if (!insights) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Brain className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-700">No intelligence extracted yet</p>
          <p className="text-sm text-slate-500 mt-1">Add notes or a transcript, then click Analyze to extract deep intelligence</p>
          <Button className="mt-4" onClick={onGenerate} loading={generating}>
            <Sparkles className="h-4 w-4" />
            Extract Intelligence
          </Button>
        </div>
      </div>
    )
  }

  const commitments = insights.commitments || []
  const risks = insights.risks || []
  const buyingSignals = insights.buying_signals || []
  const objections = insights.objections || []
  const openIssues = insights.open_issues || []
  const nextSteps = insights.next_steps || []
  const decisions = insights.decisions || []

  const hasIntelligence = commitments.length + risks.length + buyingSignals.length + objections.length + openIssues.length > 0

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      {/* Regenerate */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-slate-700">Meeting Intelligence</h2>
          {insights.meeting_sentiment && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              insights.meeting_sentiment === 'positive' ? 'bg-green-50 text-green-700' :
              insights.meeting_sentiment === 'negative' ? 'bg-red-50 text-red-700' :
              'bg-slate-100 text-slate-600'
            }`}>
              {insights.meeting_sentiment}
            </span>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={onGenerate} loading={generating}>
          <Sparkles className="h-3.5 w-3.5" />
          Re-analyze
        </Button>
      </div>

      {/* Executive summary */}
      {insights.executive_summary && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-indigo-800 uppercase tracking-wide mb-2">Executive Summary</h3>
          <p className="text-sm text-indigo-900">{insights.executive_summary}</p>
        </div>
      )}

      {!hasIntelligence && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          Deep intelligence fields not yet populated. Click Re-analyze to extract commitments, risks, and signals.
        </div>
      )}

      {/* Decisions */}
      {decisions.length > 0 && (
        <IntelligenceSection
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          title="Decisions Made"
          count={decisions.length}
          bg="bg-green-50"
          border="border-green-100"
          titleColor="text-green-900"
        >
          <ul className="space-y-2">
            {decisions.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700">{d}</span>
              </li>
            ))}
          </ul>
        </IntelligenceSection>
      )}

      {/* Commitments */}
      {commitments.length > 0 && (
        <IntelligenceSection
          icon={<Target className="h-4 w-4 text-violet-600" />}
          title="Commitments Tracked"
          count={commitments.length}
          bg="bg-violet-50"
          border="border-violet-100"
          titleColor="text-violet-900"
        >
          <div className="space-y-2.5">
            {commitments.map((c, i) => (
              <div key={i} className="bg-white rounded-lg border border-slate-200 p-3">
                <p className="text-sm text-slate-800 font-medium leading-snug">{c.text}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {c.owner && (
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {c.owner}
                    </span>
                  )}
                  {c.deadline && (
                    <span className="text-xs text-slate-500">Due {c.deadline}</span>
                  )}
                  <span className="text-xs text-violet-600 capitalize">{c.type}</span>
                </div>
              </div>
            ))}
          </div>
        </IntelligenceSection>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <IntelligenceSection
          icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
          title="Risks Identified"
          count={risks.length}
          bg="bg-orange-50"
          border="border-orange-100"
          titleColor="text-orange-900"
        >
          <div className="space-y-2">
            {risks.map((r, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg border border-slate-200 p-3">
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                  r.severity === 'high' ? 'bg-red-100 text-red-700' :
                  r.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {r.severity.toUpperCase()}
                </span>
                <div>
                  <p className="text-sm text-slate-800">{r.text}</p>
                  <p className="text-xs text-slate-400 capitalize mt-0.5">{r.category}</p>
                </div>
              </div>
            ))}
          </div>
        </IntelligenceSection>
      )}

      {/* Buying signals */}
      {buyingSignals.length > 0 && (
        <IntelligenceSection
          icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
          title="Buying Signals"
          count={buyingSignals.length}
          bg="bg-emerald-50"
          border="border-emerald-100"
          titleColor="text-emerald-900"
        >
          <div className="space-y-2">
            {buyingSignals.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white rounded-lg border border-slate-200 p-3">
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded capitalize shrink-0 mt-0.5">
                  {s.type}
                </span>
                <p className="text-sm text-slate-700 italic">&ldquo;{s.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </IntelligenceSection>
      )}

      {/* Objections */}
      {objections.length > 0 && (
        <IntelligenceSection
          icon={<MessageSquare className="h-4 w-4 text-blue-600" />}
          title="Objections & Concerns"
          count={objections.length}
          bg="bg-blue-50"
          border="border-blue-100"
          titleColor="text-blue-900"
        >
          <div className="space-y-2">
            {objections.map((o, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white rounded-lg border border-slate-200 p-3">
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded capitalize shrink-0 mt-0.5 ${
                  o.resolved ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {o.resolved ? 'resolved' : o.type}
                </span>
                <p className="text-sm text-slate-700">{o.text}</p>
              </div>
            ))}
          </div>
        </IntelligenceSection>
      )}

      {/* Open issues */}
      {openIssues.length > 0 && (
        <IntelligenceSection
          icon={<Lightbulb className="h-4 w-4 text-yellow-600" />}
          title="Open Issues"
          count={openIssues.length}
          bg="bg-yellow-50"
          border="border-yellow-100"
          titleColor="text-yellow-900"
        >
          <ul className="space-y-2">
            {openIssues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 bg-white rounded-lg border border-slate-200 p-3">
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                  issue.priority === 'high' ? 'bg-red-100 text-red-700' :
                  issue.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {issue.priority}
                </span>
                <p className="text-sm text-slate-700">{issue.text}</p>
              </li>
            ))}
          </ul>
        </IntelligenceSection>
      )}

      {/* Next steps */}
      {nextSteps.length > 0 && (
        <IntelligenceSection
          icon={<Sparkles className="h-4 w-4 text-indigo-600" />}
          title="AI Recommended Next Steps"
          count={nextSteps.length}
          bg="bg-indigo-50"
          border="border-indigo-100"
          titleColor="text-indigo-900"
        >
          <div className="space-y-2">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white rounded-lg border border-slate-200 p-3">
                <span className="text-indigo-400 font-bold text-sm shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="text-sm text-slate-800">{step.text}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {step.owner && <span className="text-xs text-slate-500">{step.owner}</span>}
                    {step.deadline && <span className="text-xs text-slate-400">· {step.deadline}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </IntelligenceSection>
      )}
    </div>
  )
}

function IntelligenceSection({
  icon, title, count, bg, border, titleColor, children,
}: {
  icon: React.ReactNode
  title: string
  count: number
  bg: string
  border: string
  titleColor: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(true)

  return (
    <div className={`rounded-xl border ${border} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 ${bg} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className={`text-sm font-semibold ${titleColor}`}>{title}</span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-white/60 ${titleColor}`}>{count}</span>
        </div>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
      </button>
      {open && <div className="p-4 bg-white">{children}</div>}
    </div>
  )
}
