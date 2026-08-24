import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatRelative, formatDate, MEETING_TYPE_LABELS, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart2, Calendar, CheckSquare, Clock, Plus, Video } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString()

  const [
    { data: profile },
    { data: recentMeetings, count: totalMeetings },
    { count: meetingsThisMonth },
    { data: openActionItems, count: openActionCount },
    { data: subscription },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, company').eq('id', user.id).single(),
    supabase.from('meetings').select('*', { count: 'exact' }).eq('user_id', user.id).eq('is_archived', false).order('created_at', { ascending: false }).limit(5),
    supabase.from('meetings').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', startOfMonth),
    supabase.from('action_items').select('*', { count: 'exact' }).eq('user_id', user.id).in('status', ['open', 'in_progress']).order('created_at', { ascending: false }).limit(5),
    supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
  ])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const plan = (subscription?.plan || 'free') as string
  const planLabel = { free: 'Free', starter: 'Starter', pro: 'Pro' }[plan] || 'Free'

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting()}{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Here&apos;s your meeting overview</p>
        </div>
        <Link href="/meetings/new">
          <Button size="md">
            <Plus className="h-4 w-4" />
            New Meeting
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Meetings this month"
          value={meetingsThisMonth || 0}
          icon={<Calendar className="h-5 w-5 text-indigo-500" />}
          color="indigo"
        />
        <StatCard
          label="Total meetings"
          value={totalMeetings || 0}
          icon={<Video className="h-5 w-5 text-blue-500" />}
          color="blue"
        />
        <StatCard
          label="Open action items"
          value={openActionCount || 0}
          icon={<CheckSquare className="h-5 w-5 text-orange-500" />}
          color="orange"
        />
        <StatCard
          label="Current plan"
          value={planLabel}
          icon={<BarChart2 className="h-5 w-5 text-green-500" />}
          color="green"
          isText
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Meetings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Meetings</CardTitle>
                <Link href="/meetings" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!recentMeetings?.length ? (
                <div className="px-6 py-8 text-center">
                  <Video className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No meetings yet</p>
                  <Link href="/meetings/new" className="mt-3 inline-block">
                    <Button size="sm" variant="outline">Start your first meeting</Button>
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {recentMeetings.map((meeting) => (
                    <li key={meeting.id}>
                      <Link href={`/meetings/${meeting.id}`} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{meeting.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {MEETING_TYPE_LABELS[meeting.meeting_type] || 'General'} · {formatRelative(meeting.created_at)}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[meeting.status]}`}>
                          {STATUS_LABELS[meeting.status]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Open Actions</CardTitle>
                <Link href="/action-items" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!openActionItems?.length ? (
                <div className="px-6 py-8 text-center">
                  <CheckSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No open actions</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {openActionItems.map((item) => (
                    <li key={item.id} className="px-6 py-3">
                      <p className="text-sm text-slate-900 leading-snug">{item.title}</p>
                      {item.due_date && (
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />{formatDate(item.due_date)}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Upgrade banner for free */}
          {plan === 'free' && (
            <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-indigo-900">Upgrade to Starter</p>
              <p className="text-xs text-indigo-700 mt-1">Get 50 meetings/mo, 600 min transcription, and full AI.</p>
              <Link href="/pricing" className="mt-3 inline-block">
                <Button size="sm" className="w-full">View plans</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label, value, icon, color, isText,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  color: string
  isText?: boolean
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold text-slate-900 ${isText ? 'text-lg' : ''}`}>{value}</p>
    </Card>
  )
}
