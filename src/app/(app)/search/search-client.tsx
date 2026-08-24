'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Video, FileText, CheckSquare, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, MEETING_TYPE_LABELS, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'

interface Props {
  initialQuery: string
  meetings: Array<{ id: string; title: string; meeting_type: string; status: string; created_at: string }> | null
  notes: Array<{ id: string; raw_notes: string; enhanced_notes: string | null; updated_at: string; meetings: { id: string; title: string } | null }> | null
  actionItems: Array<{ id: string; title: string; status: string; priority: string; meetings: { id: string; title: string } | null }> | null
}

export function SearchClient({ initialQuery, meetings, notes, actionItems }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = React.useState(initialQuery)
  const [aiQuestion, setAiQuestion] = React.useState('')
  const [aiAnswer, setAiAnswer] = React.useState<string | null>(null)
  const [aiLoading, setAiLoading] = React.useState(false)

  function handleSearch() {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    router.push(`${pathname}?${params.toString()}`)
  }

  async function askAI() {
    if (!aiQuestion.trim()) return
    setAiLoading(true)
    setAiAnswer(null)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cross_meeting_query', question: aiQuestion }),
      })
      const data = await res.json()
      if (data.success) {
        setAiAnswer(data.result)
      } else {
        setAiAnswer(`Error: ${data.error}`)
      }
    } catch {
      setAiAnswer('Failed to connect to AI')
    } finally {
      setAiLoading(false)
    }
  }

  const hasResults = (meetings?.length || 0) + (notes?.length || 0) + (actionItems?.length || 0) > 0
  const searched = initialQuery.length > 0

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search meetings, notes, action items…"
            className="w-full pl-9 pr-3 h-10 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* AI cross-meeting search */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-indigo-900">Ask about your meetings</h3>
        </div>
        <p className="text-xs text-indigo-700 mb-3">Ask a question across all your meeting history</p>
        <div className="flex gap-2">
          <input
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAI()}
            placeholder="What have we discussed about project X? What were our recurring issues?"
            className="flex-1 h-9 px-3 rounded-lg border border-indigo-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button size="sm" onClick={askAI} loading={aiLoading} disabled={!aiQuestion.trim()}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        {aiAnswer && (
          <div className="mt-3 bg-white border border-indigo-100 rounded-lg p-3 text-sm text-slate-700 whitespace-pre-wrap">
            {aiAnswer}
          </div>
        )}
      </div>

      {/* Results */}
      {searched && !hasResults && (
        <div className="text-center py-10">
          <Search className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600">No results for &ldquo;{initialQuery}&rdquo;</p>
        </div>
      )}

      {!searched && (
        <div className="text-center py-10">
          <Search className="h-12 w-12 text-slate-200 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Type to search your meetings</p>
        </div>
      )}

      {meetings && meetings.length > 0 && (
        <ResultSection title="Meetings" icon={<Video className="h-4 w-4" />}>
          {meetings.map((m) => (
            <Link
              key={m.id}
              href={`/meetings/${m.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{m.title}</p>
                <p className="text-xs text-slate-500">{MEETING_TYPE_LABELS[m.meeting_type]}</p>
              </div>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_COLORS[m.status])}>
                {STATUS_LABELS[m.status]}
              </span>
            </Link>
          ))}
        </ResultSection>
      )}

      {notes && notes.length > 0 && (
        <ResultSection title="Notes" icon={<FileText className="h-4 w-4" />}>
          {notes.map((n) => {
            const meeting = Array.isArray(n.meetings) ? n.meetings[0] : n.meetings
            const preview = (n.enhanced_notes || n.raw_notes || '').slice(0, 150)
            return (
              <Link
                key={n.id}
                href={meeting ? `/meetings/${meeting.id}` : '#'}
                className="block px-4 py-3 hover:bg-slate-50 transition-colors rounded-lg"
              >
                <p className="text-sm font-medium text-slate-900">{meeting?.title || 'Untitled'}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{preview}</p>
              </Link>
            )
          })}
        </ResultSection>
      )}

      {actionItems && actionItems.length > 0 && (
        <ResultSection title="Action Items" icon={<CheckSquare className="h-4 w-4" />}>
          {actionItems.map((a) => {
            const meeting = Array.isArray(a.meetings) ? a.meetings[0] : a.meetings
            return (
              <Link
                key={a.id}
                href={meeting ? `/meetings/${meeting.id}` : '#'}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{a.title}</p>
                  {meeting && <p className="text-xs text-slate-500 mt-0.5">{meeting.title}</p>}
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded font-medium', {
                  'bg-gray-100 text-gray-600': a.priority === 'low',
                  'bg-yellow-100 text-yellow-700': a.priority === 'medium',
                  'bg-red-100 text-red-700': a.priority === 'high',
                })}>
                  {a.priority}
                </span>
              </Link>
            )
          })}
        </ResultSection>
      )}
    </div>
  )
}

function ResultSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 text-sm font-semibold text-slate-700">
        {icon}{title}
      </div>
      <div className="divide-y divide-slate-50">{children}</div>
    </div>
  )
}
