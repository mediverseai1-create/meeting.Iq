import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatRelative } from '@/lib/utils'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Notes' }

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notes } = await supabase
    .from('meeting_notes')
    .select(`
      id, raw_notes, enhanced_notes, is_enhanced, created_at, updated_at,
      meetings(id, title, meeting_type, status)
    `)
    .eq('user_id', user.id)
    .not('raw_notes', 'eq', '')
    .order('updated_at', { ascending: false })
    .limit(50)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Notes</h1>
        <Link href="/meetings/new">
          <Button size="sm"><Plus className="h-4 w-4" />New Meeting</Button>
        </Link>
      </div>

      {!notes?.length ? (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No notes yet</p>
          <p className="text-sm text-slate-400 mt-1">Notes appear here after you write them in a meeting</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {notes.map((note) => {
            const meeting = Array.isArray(note.meetings) ? note.meetings[0] : note.meetings as { id: string; title: string } | null
            const preview = (note.enhanced_notes || note.raw_notes || '').slice(0, 200)
            return (
              <Link
                key={note.id}
                href={meeting ? `/meetings/${meeting.id}` : '#'}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">{meeting?.title || 'Untitled Meeting'}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {note.is_enhanced && (
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">Enhanced</span>
                    )}
                    <span className="text-xs text-slate-400">{formatRelative(note.updated_at)}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{preview || 'Empty notes'}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
