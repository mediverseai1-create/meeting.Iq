import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SearchClient } from './search-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Search' }

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const q = params.q?.trim() || ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let meetings: any[] | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let notes: any[] | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let actionItems: any[] | null = null

  if (q) {
    const [meetingRes, notesRes, actionsRes] = await Promise.all([
      supabase
        .from('meetings')
        .select('id, title, meeting_type, status, created_at')
        .eq('user_id', user.id)
        .ilike('title', `%${q}%`)
        .limit(10),
      supabase
        .from('meeting_notes')
        .select(`id, raw_notes, enhanced_notes, updated_at, meetings(id, title)`)
        .eq('user_id', user.id)
        .or(`raw_notes.ilike.%${q}%,enhanced_notes.ilike.%${q}%`)
        .limit(10),
      supabase
        .from('action_items')
        .select(`id, title, status, priority, meetings(id, title)`)
        .eq('user_id', user.id)
        .ilike('title', `%${q}%`)
        .limit(10),
    ])
    meetings = meetingRes.data
    notes = notesRes.data
    actionItems = actionsRes.data
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Search</h1>
        <p className="text-sm text-slate-500 mt-1">Search across all your meetings, notes, and action items</p>
      </div>
      <SearchClient initialQuery={q} meetings={meetings} notes={notes} actionItems={actionItems} />
    </div>
  )
}
