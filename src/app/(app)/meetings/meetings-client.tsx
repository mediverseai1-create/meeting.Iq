'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { formatRelative, MEETING_TYPE_LABELS, STATUS_COLORS, STATUS_LABELS, formatDuration, cn } from '@/lib/utils'
import type { Meeting } from '@/types'
import { Search, Video, Clock, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const STATUS_OPTS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const TYPE_OPTS = [
  { value: '', label: 'All types' },
  { value: 'general', label: 'General' },
  { value: 'sales', label: 'Sales Call' },
  { value: 'team', label: 'Team Meeting' },
  { value: 'one_on_one', label: '1:1' },
  { value: 'client', label: 'Client Meeting' },
  { value: 'interview', label: 'Interview' },
  { value: 'product', label: 'Product' },
  { value: 'investor', label: 'Investor' },
]

interface Props {
  meetings: Meeting[]
  searchQuery: string
  filterStatus: string
  filterType: string
}

export function MeetingsClient({ meetings, searchQuery, filterStatus, filterType }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [q, setQ] = React.useState(searchQuery)

  function updateSearch(newQ: string) {
    setQ(newQ)
    const params = new URLSearchParams()
    if (newQ) params.set('q', newQ)
    if (filterStatus) params.set('status', filterStatus)
    if (filterType) params.set('type', filterType)
    router.push(`${pathname}?${params.toString()}`)
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (key !== 'status' && filterStatus) params.set('status', filterStatus)
    if (key !== 'type' && filterType) params.set('type', filterType)
    if (value) params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search meetings…"
            className="w-full pl-9 pr-3 h-9 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={filterType}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {TYPE_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* List */}
      {meetings.length === 0 ? (
        <div className="text-center py-16">
          <Video className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No meetings found</p>
          <p className="text-sm text-slate-400 mt-1">
            {searchQuery || filterStatus || filterType ? 'Try adjusting your filters' : 'Create your first meeting to get started'}
          </p>
          <Link href="/meetings/new" className="mt-4 inline-block">
            <Button size="sm" variant="outline">New Meeting</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {meetings.map((meeting) => (
            <Link
              key={meeting.id}
              href={`/meetings/${meeting.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <Video className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{meeting.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {MEETING_TYPE_LABELS[meeting.meeting_type] || 'General'}
                  {meeting.duration_seconds ? ` · ${formatDuration(meeting.duration_seconds)}` : ''}
                  {' · '}{formatRelative(meeting.created_at)}
                </p>
              </div>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium shrink-0', STATUS_COLORS[meeting.status])}>
                {STATUS_LABELS[meeting.status]}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
