'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn, formatDateTime, formatDuration, MEETING_TYPE_LABELS, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import type { Meeting, MeetingNotes, Transcript, MeetingInsights, ActionItem, MeetingTemplate } from '@/types'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { RecordingCapture } from './recording-capture'
import { AskQuestion } from './ask-question'
import { FollowUpGenerator } from './follow-up-generator'
import {
  Mic, FileText, Lightbulb, CheckSquare, Users, Clock,
  Edit3, Save, Sparkles, Play, Square, ChevronRight, MoreHorizontal,
  AlertCircle, ArrowLeft, Share, Trash2,
} from 'lucide-react'
import Link from 'next/link'

type Tab = 'notes' | 'transcript' | 'insights' | 'actions' | 'followup'

interface Props {
  meeting: Meeting
  notes: MeetingNotes | null
  transcript: Transcript | null
  insights: MeetingInsights | null
  actionItems: ActionItem[]
  templates: MeetingTemplate[]
}

export function MeetingWorkspace({ meeting: initialMeeting, notes: initialNotes, transcript: initialTranscript, insights: initialInsights, actionItems: initialActionItems, templates }: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [meeting, setMeeting] = React.useState(initialMeeting)
  const [notes, setNotes] = React.useState(initialNotes)
  const [transcript, setTranscript] = React.useState(initialTranscript)
  const [insights, setInsights] = React.useState(initialInsights)
  const [actionItems, setActionItems] = React.useState(initialActionItems)
  const [tab, setTab] = React.useState<Tab>('notes')
  const [rawNotes, setRawNotes] = React.useState(initialNotes?.raw_notes || '')
  const [saving, setSaving] = React.useState(false)
  const [enhancing, setEnhancing] = React.useState(false)
  const [generating, setGenerating] = React.useState(false)
  const [editingTitle, setEditingTitle] = React.useState(false)
  const [titleValue, setTitleValue] = React.useState(meeting.title)

  const autoSaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-save notes
  React.useEffect(() => {
    if (rawNotes === (notes?.raw_notes || '')) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => saveNotes(rawNotes), 1500)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [rawNotes])

  async function saveNotes(text: string) {
    setSaving(true)
    if (notes?.id) {
      await supabase.from('meeting_notes').update({ raw_notes: text }).eq('id', notes.id)
    } else {
      const { data } = await supabase.from('meeting_notes').insert({
        meeting_id: meeting.id,
        user_id: meeting.user_id,
        raw_notes: text,
      }).select().single()
      if (data) setNotes(data)
    }
    setSaving(false)
  }

  async function enhanceNotes() {
    if (!rawNotes.trim()) {
      toast({ title: 'No notes to enhance', description: 'Write some notes first', variant: 'info' })
      return
    }
    setEnhancing(true)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enhance_notes',
          notes: rawNotes,
          transcript: transcript?.raw_transcript || '',
          meetingType: meeting.meeting_type,
          context: meeting.context || '',
        }),
      })
      const data = await res.json()
      if (data.success) {
        await supabase.from('meeting_notes').update({
          enhanced_notes: data.result,
          is_enhanced: true,
          enhanced_at: new Date().toISOString(),
        }).eq('id', notes?.id)
        setNotes((prev) => prev ? { ...prev, enhanced_notes: data.result, is_enhanced: true } : prev)
        toast({ title: 'Notes enhanced', variant: 'success' })
      } else {
        toast({ title: 'Enhancement failed', description: data.error, variant: 'error' })
      }
    } catch {
      toast({ title: 'Enhancement failed', description: 'Check your Gemini API configuration', variant: 'error' })
    } finally {
      setEnhancing(false)
    }
  }

  async function generateInsights() {
    if (!rawNotes.trim() && !transcript?.raw_transcript) {
      toast({ title: 'No content to analyze', description: 'Add notes or a transcript first', variant: 'info' })
      return
    }
    setGenerating(true)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generate_summary',
          notes: rawNotes,
          transcript: transcript?.raw_transcript || '',
          meetingTitle: meeting.title,
          meetingType: meeting.meeting_type,
          participants: meeting.participants,
        }),
      })
      const data = await res.json()
      if (data.success) {
        const ins = data.result
        const upsertData = {
          meeting_id: meeting.id,
          user_id: meeting.user_id,
          executive_summary: ins.executive_summary,
          key_points: ins.key_points,
          decisions: ins.decisions,
          open_questions: ins.open_questions,
          important_quotes: ins.important_quotes,
          topics: ins.topics,
          generated_at: new Date().toISOString(),
        }
        if (insights?.id) {
          await supabase.from('meeting_insights').update(upsertData).eq('id', insights.id)
        } else {
          const { data: newIns } = await supabase.from('meeting_insights').insert(upsertData).select().single()
          if (newIns) setInsights(newIns)
        }
        setInsights((prev) => prev ? { ...prev, ...upsertData } : upsertData as MeetingInsights)

        // Extract action items
        const actRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'extract_actions',
            notes: rawNotes,
            transcript: transcript?.raw_transcript || '',
          }),
        })
        const actData = await actRes.json()
        if (actData.success && actData.result?.length) {
          const items = actData.result.map((item: { title: string; assignee?: string; due_date?: string; priority: string }) => ({
            meeting_id: meeting.id,
            user_id: meeting.user_id,
            title: item.title,
            assignee: item.assignee || null,
            due_date: item.due_date || null,
            priority: item.priority || 'medium',
            status: 'open',
          }))
          const { data: newItems } = await supabase.from('action_items').insert(items).select()
          if (newItems) setActionItems((prev) => [...prev, ...newItems])
        }

        await supabase.from('meetings').update({ status: 'completed' }).eq('id', meeting.id)
        setMeeting((prev) => ({ ...prev, status: 'completed' }))
        setTab('insights')
        toast({ title: 'Analysis complete', variant: 'success' })
      } else {
        toast({ title: 'Analysis failed', description: data.error, variant: 'error' })
      }
    } catch {
      toast({ title: 'Analysis failed', description: 'Check your Gemini API configuration', variant: 'error' })
    } finally {
      setGenerating(false)
    }
  }

  async function updateTitle() {
    if (titleValue === meeting.title) { setEditingTitle(false); return }
    await supabase.from('meetings').update({ title: titleValue }).eq('id', meeting.id)
    setMeeting((prev) => ({ ...prev, title: titleValue }))
    setEditingTitle(false)
  }

  async function deleteMeeting() {
    if (!confirm('Delete this meeting and all its data? This cannot be undone.')) return
    await supabase.from('meetings').delete().eq('id', meeting.id)
    router.push('/meetings')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-start gap-4">
          <Link href="/meetings" className="mt-1 text-slate-400 hover:text-slate-600 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <input
                autoFocus
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={updateTitle}
                onKeyDown={(e) => e.key === 'Enter' && updateTitle()}
                className="text-xl font-bold text-slate-900 w-full border-b-2 border-indigo-400 outline-none bg-transparent"
              />
            ) : (
              <button onClick={() => setEditingTitle(true)} className="flex items-center gap-2 group text-left">
                <h1 className="text-xl font-bold text-slate-900 truncate">{meeting.title}</h1>
                <Edit3 className="h-4 w-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
              </button>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span>{MEETING_TYPE_LABELS[meeting.meeting_type] || 'General'}</span>
              {meeting.scheduled_at && <span>·  {formatDateTime(meeting.scheduled_at)}</span>}
              {meeting.participants.length > 0 && <span>· {meeting.participants.join(', ')}</span>}
              <span className={cn('px-2 py-0.5 rounded-full font-medium text-xs', STATUS_COLORS[meeting.status])}>
                {STATUS_LABELS[meeting.status]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="secondary"
              onClick={generateInsights}
              loading={generating}
              className="hidden sm:flex"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Analyze
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={deleteMeeting}
              title="Delete meeting"
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 -mb-4 overflow-x-auto">
          {[
            { id: 'notes' as Tab, label: 'Notes', icon: FileText },
            { id: 'transcript' as Tab, label: 'Transcript', icon: Mic },
            { id: 'insights' as Tab, label: 'Insights', icon: Lightbulb },
            { id: 'actions' as Tab, label: `Actions${actionItems.length ? ` (${actionItems.length})` : ''}`, icon: CheckSquare },
            { id: 'followup' as Tab, label: 'Follow-up', icon: Share },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 whitespace-nowrap transition-colors',
                tab === t.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'notes' && (
          <NotesTab
            rawNotes={rawNotes}
            setRawNotes={setRawNotes}
            enhancedNotes={notes?.enhanced_notes || null}
            isEnhanced={notes?.is_enhanced || false}
            saving={saving}
            enhancing={enhancing}
            onEnhance={enhanceNotes}
            onAnalyze={generateInsights}
            generating={generating}
            context={meeting.context}
          />
        )}
        {tab === 'transcript' && (
          <TranscriptTab
            transcript={transcript}
            meeting={meeting}
            onTranscriptUpdate={(t) => setTranscript(t)}
          />
        )}
        {tab === 'insights' && (
          <InsightsTab
            insights={insights}
            onGenerate={generateInsights}
            generating={generating}
          />
        )}
        {tab === 'actions' && (
          <ActionsTab
            actionItems={actionItems}
            meetingId={meeting.id}
            userId={meeting.user_id}
            onUpdate={setActionItems}
          />
        )}
        {tab === 'followup' && (
          <FollowUpGenerator
            meeting={meeting}
            notes={rawNotes}
            insights={insights}
            actionItems={actionItems}
          />
        )}
      </div>
    </div>
  )
}

// ---- Notes Tab ----
function NotesTab({
  rawNotes, setRawNotes, enhancedNotes, isEnhanced, saving, enhancing, onEnhance, onAnalyze, generating, context,
}: {
  rawNotes: string
  setRawNotes: (v: string) => void
  enhancedNotes: string | null
  isEnhanced: boolean
  saving: boolean
  enhancing: boolean
  onEnhance: () => void
  onAnalyze: () => void
  generating: boolean
  context: string | null
}) {
  const [showEnhanced, setShowEnhanced] = React.useState(false)

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      {context && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Context: </span>{context}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-700">
            {showEnhanced && isEnhanced ? 'Enhanced Notes' : 'Your Notes'}
          </h2>
          {isEnhanced && (
            <button
              onClick={() => setShowEnhanced(!showEnhanced)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {showEnhanced ? 'View original' : 'View enhanced'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saving && <span className="text-xs text-slate-400">Saving…</span>}
          {!saving && rawNotes && <span className="text-xs text-slate-300">Saved</span>}
          <Button size="sm" variant="outline" onClick={onEnhance} loading={enhancing} disabled={!rawNotes.trim()}>
            <Sparkles className="h-3.5 w-3.5" />
            Enhance with AI
          </Button>
          <Button size="sm" onClick={onAnalyze} loading={generating} disabled={!rawNotes.trim()}>
            <Lightbulb className="h-3.5 w-3.5" />
            Analyze
          </Button>
        </div>
      </div>

      {showEnhanced && isEnhanced && enhancedNotes ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 min-h-64">
          <div className="prose text-sm text-slate-700 whitespace-pre-wrap">{enhancedNotes}</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-64">
          <textarea
            className="notes-editor"
            style={{ minHeight: '400px' }}
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Start taking notes… Your notes are automatically saved as you type.

Use this space to:
• Capture key points and discussion items
• Note important decisions
• Record who said what
• List action items

The AI can enhance and analyze your notes when you're done."
          />
        </div>
      )}

      <AskQuestion rawNotes={rawNotes} enhancedNotes={enhancedNotes || ''} />
    </div>
  )
}

// ---- Transcript Tab ----
function TranscriptTab({
  transcript, meeting, onTranscriptUpdate,
}: {
  transcript: Transcript | null
  meeting: Meeting
  onTranscriptUpdate: (t: Transcript) => void
}) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <RecordingCapture
        meeting={meeting}
        transcript={transcript}
        onTranscriptUpdate={onTranscriptUpdate}
      />
    </div>
  )
}

// ---- Insights Tab ----
function InsightsTab({
  insights, onGenerate, generating,
}: {
  insights: MeetingInsights | null
  onGenerate: () => void
  generating: boolean
}) {
  if (!insights) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Lightbulb className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-700">No insights yet</p>
          <p className="text-sm text-slate-500 mt-1">Add notes or a transcript and click Analyze to generate insights</p>
          <Button className="mt-4" onClick={onGenerate} loading={generating}>
            <Sparkles className="h-4 w-4" />
            Generate Insights
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">AI-Generated Insights</h2>
        <Button size="sm" variant="outline" onClick={onGenerate} loading={generating}>
          <Sparkles className="h-3.5 w-3.5" />
          Regenerate
        </Button>
      </div>

      {insights.executive_summary && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-indigo-900 mb-2">Summary</h3>
          <p className="text-sm text-indigo-800">{insights.executive_summary}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {insights.key_points?.length > 0 && (
          <InsightSection title="Key Points" items={insights.key_points} color="slate" />
        )}
        {insights.decisions?.length > 0 && (
          <InsightSection title="Decisions Made" items={insights.decisions} color="green" />
        )}
        {insights.open_questions?.length > 0 && (
          <InsightSection title="Open Questions" items={insights.open_questions} color="yellow" />
        )}
        {insights.topics?.length > 0 && (
          <InsightSection title="Topics Covered" items={insights.topics} color="blue" />
        )}
      </div>
    </div>
  )
}

function InsightSection({ title, items, color }: { title: string; items: string[]; color: string }) {
  const colors = {
    slate: 'bg-white border-slate-200',
    green: 'bg-green-50 border-green-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    blue: 'bg-blue-50 border-blue-100',
  }
  return (
    <div className={cn('rounded-xl border p-4', colors[color as keyof typeof colors])}>
      <h3 className="text-sm font-semibold text-slate-800 mb-2">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-700 flex gap-2">
            <span className="text-slate-400 shrink-0">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---- Actions Tab ----
function ActionsTab({
  actionItems, meetingId, userId, onUpdate,
}: {
  actionItems: ActionItem[]
  meetingId: string
  userId: string
  onUpdate: (items: ActionItem[]) => void
}) {
  const { toast } = useToast()
  const supabase = createClient()
  const [adding, setAdding] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState('')

  async function toggleStatus(item: ActionItem) {
    const newStatus = item.status === 'completed' ? 'open' : 'completed'
    await supabase.from('action_items').update({ status: newStatus }).eq('id', item.id)
    onUpdate(actionItems.map((a) => a.id === item.id ? { ...a, status: newStatus as ActionItem['status'] } : a))
  }

  async function addItem() {
    if (!newTitle.trim()) return
    const { data } = await supabase.from('action_items').insert({
      meeting_id: meetingId,
      user_id: userId,
      title: newTitle.trim(),
      status: 'open',
      priority: 'medium',
    }).select().single()
    if (data) {
      onUpdate([...actionItems, data])
      setNewTitle('')
      setAdding(false)
    }
  }

  async function deleteItem(id: string) {
    await supabase.from('action_items').delete().eq('id', id)
    onUpdate(actionItems.filter((a) => a.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Action Items</h2>
        <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
          + Add item
        </Button>
      </div>

      {actionItems.length === 0 && !adding && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <CheckSquare className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No action items yet</p>
          <p className="text-xs text-slate-400 mt-1">Use Analyze to extract items from your notes</p>
        </div>
      )}

      <div className="space-y-2">
        {adding && (
          <div className="flex gap-2">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
              placeholder="Action item title…"
              className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button size="sm" onClick={addItem}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        )}

        {actionItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 bg-white rounded-lg border border-slate-200 px-4 py-3 group"
          >
            <button
              onClick={() => toggleStatus(item)}
              className={cn(
                'mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                item.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-indigo-400'
              )}
            >
              {item.status === 'completed' && (
                <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm text-slate-900', item.status === 'completed' && 'line-through text-slate-400')}>
                {item.title}
              </p>
              {(item.assignee || item.due_date) && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.assignee && <span>{item.assignee}</span>}
                  {item.assignee && item.due_date && <span> · </span>}
                  {item.due_date && <span>Due {item.due_date}</span>}
                </p>
              )}
            </div>
            <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', {
              'bg-gray-100 text-gray-600': item.priority === 'low',
              'bg-yellow-100 text-yellow-700': item.priority === 'medium',
              'bg-red-100 text-red-700': item.priority === 'high',
            })}>
              {item.priority}
            </span>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
