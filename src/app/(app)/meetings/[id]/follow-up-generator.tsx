'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Copy, Check } from 'lucide-react'
import type { Meeting, MeetingInsights, ActionItem } from '@/types'

interface Props {
  meeting: Meeting
  notes: string
  insights: MeetingInsights | null
  actionItems: ActionItem[]
}

export function FollowUpGenerator({ meeting, notes, insights, actionItems }: Props) {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<{ email: string; recap: string } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState<'email' | 'recap' | null>(null)

  async function generate() {
    if (!notes.trim() && !insights) {
      setError('Add notes or generate insights first')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generate_followup',
          notes,
          meetingTitle: meeting.title,
          participants: meeting.participants,
          decisions: insights?.decisions || [],
          actionItems: actionItems.map((a) => ({ title: a.title, assignee: a.assignee })),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.result)
      } else {
        setError(data.error || 'Generation failed')
      }
    } catch {
      setError('Failed to connect to AI')
    } finally {
      setLoading(false)
    }
  }

  function copyText(text: string, type: 'email' | 'recap') {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Follow-up Content</h2>
        <Button size="sm" onClick={generate} loading={loading}>
          <Sparkles className="h-3.5 w-3.5" />
          Generate Follow-up
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</div>
      )}

      {!result && !loading && !error && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Sparkles className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Generate follow-up email and meeting recap</p>
          <p className="text-xs text-slate-400 mt-1">Based on your meeting notes and analysis</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Follow-up Email</h3>
              <Button size="sm" variant="ghost" onClick={() => copyText(result.email, 'email')}>
                {copied === 'email' ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === 'email' ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
              {result.email}
            </pre>
          </div>

          {result.recap && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Meeting Recap</h3>
                <Button size="sm" variant="ghost" onClick={() => copyText(result.recap, 'recap')}>
                  {copied === 'recap' ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === 'recap' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{result.recap}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
