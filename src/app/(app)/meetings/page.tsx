import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatRelative, MEETING_TYPE_LABELS, STATUS_COLORS, STATUS_LABELS, formatDuration } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus, Video, Search, Filter } from 'lucide-react'
import { MeetingsClient } from './meetings-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Meetings' }

export default async function MeetingsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; type?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const q = params.q || ''
  const status = params.status || ''
  const type = params.type || ''

  let query = supabase
    .from('meetings')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (type) query = query.eq('meeting_type', type)
  if (q) query = query.ilike('title', `%${q}%`)

  const { data: meetings } = await query.limit(50)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Meetings</h1>
        <Link href="/meetings/new">
          <Button><Plus className="h-4 w-4" />New Meeting</Button>
        </Link>
      </div>

      <MeetingsClient meetings={meetings || []} searchQuery={q} filterStatus={status} filterType={type} />
    </div>
  )
}
