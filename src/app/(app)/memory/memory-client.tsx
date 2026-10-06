'use client'

import * as React from 'react'
import { Brain, Search, ArrowRight, Loader2, Video, Clock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXAMPLE_QUERIES = [
  'Why did we decide not to launch the enterprise tier?',
  'What did our key client request in recent meetings?',
  'Who committed to delivering the revised proposal?',
  'What risks did we identify in the infrastructure project?',
  'What buying signals came up in sales meetings this month?',
  'What are our most common unresolved issues?',
]

interface QueryResult {
  answer: string
  query: string
  ts: number
}

export function MemoryClient() {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState<QueryResult[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  async function runQuery(q: string) {
    const trimmed = q.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cross_meeting_query', question: trimmed }),
      })
      const data = await res.json()
      if (data.success) {
        setResults((prev) => [{ answer: data.result, query: trimmed, ts: Date.now() }, ...prev])
        setQuery('')
      } else {
        setError(data.error || 'Query failed')
      }
    } catch {
      setError('Failed to query company memory. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      runQuery(query)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Brain className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Company Memory</h1>
            <p className="text-sm text-slate-500">Ask anything across your entire meeting history</p>
          </div>
        </div>
      </div>

      {/* Query input */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <textarea
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your meetings…

Examples:
• Why did we decide not to launch the enterprise feature?
• What did Acme Corp request in the last three meetings?
• Who committed to delivering the revised proposal?"
          className="w-full px-5 pt-4 pb-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none bg-transparent leading-relaxed"
          rows={5}
        />
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">⌘ Enter to search</span>
          <Button
            size="sm"
            onClick={() => runQuery(query)}
            loading={loading}
            disabled={!query.trim()}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            Search Memory
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Example queries */}
      {results.length === 0 && !loading && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Example questions</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => { setQuery(q); inputRef.current?.focus() }}
                className="text-left text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex items-start gap-2 group"
              >
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0 group-hover:text-indigo-500" />
                <span className="leading-snug">{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, i) => (
            <div key={result.ts} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Query */}
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-slate-700">{result.query}</p>
              </div>
              {/* Answer */}
              <div className="px-5 py-4">
                <div className="flex items-start gap-2.5">
                  <Brain className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {result.answer}
                  </div>
                </div>
              </div>
              <div className="px-5 py-2 border-t border-slate-50 flex items-center gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(result.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {i === 0 && (
                  <button
                    onClick={() => { setQuery(result.query + ' — tell me more'); inputRef.current?.focus() }}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Ask follow-up
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1.5"
          >
            <Video className="h-3.5 w-3.5" />
            Start a new query
          </button>
        </div>
      )}

      {/* How it works */}
      {results.length === 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">How Company Memory works</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">1</span> MeetingIQ reads across all your analyzed meetings</li>
            <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">2</span> AI reasons across notes, transcripts, decisions, and summaries</li>
            <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">3</span> You get specific answers referencing which meetings contain the information</li>
          </ul>
          <p className="text-xs text-slate-400 mt-3">The more meetings you analyze, the more powerful memory becomes.</p>
        </div>
      )}
    </div>
  )
}
