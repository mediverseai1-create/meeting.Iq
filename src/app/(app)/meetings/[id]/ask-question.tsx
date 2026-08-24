'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare, Send } from 'lucide-react'

interface Props {
  rawNotes: string
  enhancedNotes: string
}

export function AskQuestion({ rawNotes, enhancedNotes }: Props) {
  const [question, setQuestion] = React.useState('')
  const [answer, setAnswer] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function ask() {
    if (!question.trim() || !rawNotes.trim()) return
    setLoading(true)
    setError(null)
    setAnswer(null)

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ask_question',
          question,
          notes: rawNotes + (enhancedNotes ? `\n\nEnhanced:\n${enhancedNotes}` : ''),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setAnswer(data.result)
      } else {
        setError(data.error || 'Failed to get answer')
      }
    } catch {
      setError('Failed to connect to AI')
    } finally {
      setLoading(false)
    }
  }

  if (!rawNotes.trim()) return null

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">Ask about this meeting</h3>
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder="What were the main decisions? Who is responsible for X?"
          className="flex-1 h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button size="sm" onClick={ask} loading={loading} disabled={!question.trim()}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>

      {answer && (
        <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap">
          {answer}
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  )
}
