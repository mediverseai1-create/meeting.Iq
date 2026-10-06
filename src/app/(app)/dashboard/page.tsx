import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatRelative, MEETING_TYPE_LABELS, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Brain, CheckCircle2, AlertTriangle, Target, Plus, Video,
  Clock, ArrowRight, Zap, TrendingUp,
} from 'lucide-react'
import type { Metadata } from 'next'
import type { Commitment, Risk } from '@/types'

export const metadata: Metadata = { title: 'Intelligence Overview' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: profile },
    { data: recentMeetings, count: totalMeetings },
    { count: meetingsThisMonth },
    { data: openActionItems, count: openActionCount },
    { data: subscription },
    { data: recentInsights },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, company').eq('id', user.id).single(),
    supabase.from('meetings').select('*', { count: 'exact' }).eq('user_id', user.id).eq('is_archived', false).order('created_at', { ascending: false }).limit(5),
    supabase.from('meetings').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', startOfMonth),
    supabase.from('action_items').select('*', { count: 'exact' }).eq('user_id', user.id).in('status', ['open', 'in_progress']).order('due_date', { ascending: true, nullsFirst: false }).limit(6),
    supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
    supabase.from('meeting_insights').select('commitments, risks, decisions, executive_summary, meeting_id').eq('user_id', user.id).gte('created_at', oneWeekAgo).order('created_at', { ascending: false }).limit(10),
  ])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const plan = (subscription?.plan || 'free') as string

  // Aggregate intelligence across recent meetings
  const allCommitments: (Commitment & { meeting_id: string })[] = []
  const allRisks: (Risk & { meeting_id: string })[] = []
  let totalDecisions = 0

  for (const ins of recentInsights || []) {
    const commitments = (ins.commitments as Commitment[] | null) || []
    const risks = (ins.risks as Risk[] | null) || []
    const decisions = (ins.decisions as string[] | null) || []
    commitments.forEach((c) => allCommitments.push({ ...c, meeting_id: ins.meeting_id }))
    risks.forEach((r) => allRisks.push({ ...r, meeting_id: ins.meeting_id }))
    totalDecisions += decisions.length
  }

  const highRisks = allRisks.filter((r) => r.severity === 'high')
  const pendingCommitments = allCommitments.slice(0, 4)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting()}{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {profile?.company ? `${profile.company} · ` : ''}Intelligence overview
          </p>
        </div>
        <Link href="/meetings/new">
          <Button size="md">
            <Plus className="h-4 w-4" />
            New Meeting
          </Button>
        </Link>
      </div>

      {/* Intelligence stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Open Actions</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{openActionCount || 0}</p>
          <p className="text-xs text-slate-400 mt-1">pending completion</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Commitments (7d)</span>
            <Target className="h-4 w-4 text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{allCommitments.length}</p>
          <p className="text-xs text-slate-400 mt-1">tracked this week</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Risks Flagged (7d)</span>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{allRisks.length}</p>
          {highRisks.length > 0 && <p className="text-xs text-red-500 mt-1">{highRisks.length} high severity</p>}
          {highRisks.length === 0 && <p className="text-xs text-slate-400 mt-1">across all meetings</p>}
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 font-medium">Decisions (7d)</span>
            <Brain className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalDecisions}</p>
          <p className="text-xs text-slate-400 mt-1">logged this week</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent meetings */}
        <div className="lg:col-span-2 space-y-4">
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
                      <Link href={`/meetings/${meeting.id}`} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors">
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

          {/* Risks panel */}
          {highRisks.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <CardTitle>High-Priority Risks</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-slate-100">
                  {highRisks.slice(0, 3).map((risk, i) => (
                    <li key={i} className="px-6 py-3 flex items-start gap-3">
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded mt-0.5 shrink-0">HIGH</span>
                      <div>
                        <p className="text-sm text-slate-900">{risk.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5 capitalize">{risk.category}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Commitments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-violet-500" />
                  <CardTitle>Recent Commitments</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingCommitments.length === 0 ? (
                <div className="px-6 py-6 text-center">
                  <Target className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No commitments yet</p>
                  <p className="text-xs text-slate-400 mt-1">Run AI analysis on a meeting</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {pendingCommitments.map((c, i) => (
                    <li key={i} className="px-5 py-3">
                      <p className="text-sm text-slate-900 leading-snug">{c.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {c.owner && <span className="text-xs text-slate-500">{c.owner}</span>}
                        {c.deadline && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />{c.deadline}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Open actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Open Actions</CardTitle>
                <Link href="/action-items" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!openActionItems?.length ? (
                <div className="px-6 py-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">All clear</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {openActionItems.slice(0, 4).map((item) => (
                    <li key={item.id} className="px-5 py-3">
                      <p className="text-sm text-slate-900 leading-snug">{item.title}</p>
                      {item.due_date && (
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />{new Date(item.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Memory query CTA */}
          <Link href="/memory" className="block bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-4 hover:border-indigo-200 transition-colors group">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <Brain className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-900">Company Memory</p>
                <p className="text-xs text-indigo-700 mt-1">Ask anything about your meeting history in natural language.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-indigo-400 mt-1 ml-auto group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
          </Link>

          {/* Upgrade for free plan */}
          {plan === 'free' && (
            <div className="bg-slate-900 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <p className="text-sm font-semibold text-white">Unlock the full agent suite</p>
              </div>
              <p className="text-xs text-slate-400 mb-3">Commitment tracking, risk intelligence, and company memory require Starter or Pro.</p>
              <Link href="/pricing">
                <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Upgrade plan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
