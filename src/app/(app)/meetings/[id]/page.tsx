import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { MeetingWorkspace } from './meeting-workspace'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('meetings').select('title').eq('id', id).single()
  return { title: data?.title || 'Meeting' }
}

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: meeting },
    { data: notes },
    { data: transcript },
    { data: insights },
    { data: actionItems },
    { data: templates },
  ] = await Promise.all([
    supabase.from('meetings').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('meeting_notes').select('*').eq('meeting_id', id).eq('user_id', user.id).single(),
    supabase.from('transcripts').select('*').eq('meeting_id', id).eq('user_id', user.id).maybeSingle(),
    supabase.from('meeting_insights').select('*').eq('meeting_id', id).eq('user_id', user.id).maybeSingle(),
    supabase.from('action_items').select('*').eq('meeting_id', id).eq('user_id', user.id).order('created_at'),
    supabase.from('meeting_templates').select('*').or('is_system.eq.true').order('name').limit(10),
  ])

  if (!meeting) notFound()

  return (
    <MeetingWorkspace
      meeting={meeting}
      notes={notes}
      transcript={transcript}
      insights={insights}
      actionItems={actionItems || []}
      templates={templates || []}
    />
  )
}
