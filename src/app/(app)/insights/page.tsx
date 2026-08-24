import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatRelative } from '@/lib/utils'
import { Lightbulb, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Insights' }

export default async function InsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: insights } = await supabase
    .from('meeting_insights')
    .select(`
      id, executive_summary, key_points, decisions, topics, generated_at,
      meetings(id, title, meeting_type)
    `)
    .eq('user_id', user.id)
    .order('generated_at', { ascending: false })
    .limit(30)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Insights</h1>
        <p className="text-sm text-slate-500 mt-1">AI-generated analysis from your meetings</p>
      </div>

      {!insights?.length ? (
        <div className="text-center py-16">
          <Lightbulb className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No insights yet</p>
          <p className="text-sm text-slate-400 mt-1">Write meeting notes and click Analyze to generate insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => {
            const meeting = Array.isArray(insight.meetings) ? insight.meetings[0] : insight.meetings as { id: string; title: string } | null
            const keyPoints = Array.isArray(insight.key_points) ? insight.key_points : []
            const decisions = Array.isArray(insight.decisions) ? insight.decisions : []
            return (
              <Link
                key={insight.id}
                href={meeting ? `/meetings/${meeting.id}` : '#'}
                className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-slate-900">{meeting?.title || 'Meeting'}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{formatRelative(insight.generated_at)}</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </div>
                </div>

                {insight.executive_summary && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{insight.executive_summary}</p>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  {keyPoints.length > 0 && <span>{keyPoints.length} key points</span>}
                  {decisions.length > 0 && <span className="text-green-600">{decisions.length} decisions</span>}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
