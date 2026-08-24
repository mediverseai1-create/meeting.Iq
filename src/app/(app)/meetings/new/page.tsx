import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewMeetingForm } from './new-meeting-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Meeting' }

export default async function NewMeetingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: templates } = await supabase
    .from('meeting_templates')
    .select('*')
    .or(`is_system.eq.true,user_id.eq.${user.id}`)
    .order('name')

  const { data: folders } = await supabase
    .from('meeting_folders')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">New Meeting</h1>
        <p className="text-sm text-slate-500 mt-1">Set up your meeting workspace</p>
      </div>
      <NewMeetingForm templates={templates || []} folders={folders || []} />
    </div>
  )
}
