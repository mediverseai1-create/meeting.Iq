'use client'

import * as React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cn, formatDate, PRIORITY_COLORS } from '@/lib/utils'
import { CheckSquare, Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ActionItem } from '@/types'

interface ItemWithMeeting extends ActionItem {
  meetings?: { id: string; title: string } | null
}

const TABS = ['all', 'open', 'in_progress', 'completed'] as const

export function ActionItemsClient({ items: initialItems }: { items: ItemWithMeeting[] }) {
  const [items, setItems] = React.useState(initialItems)
  const [tab, setTab] = React.useState<(typeof TABS)[number]>('open')
  const supabase = createClient()

  const filtered = tab === 'all' ? items : items.filter((i) => i.status === tab)

  async function toggleStatus(item: ItemWithMeeting) {
    const next = item.status === 'completed' ? 'open' : 'completed'
    await supabase.from('action_items').update({ status: next }).eq('id', item.id)
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: next as ActionItem['status'] } : i))
  }

  const counts = {
    all: items.length,
    open: items.filter((i) => i.status === 'open').length,
    in_progress: items.filter((i) => i.status === 'in_progress').length,
    completed: items.filter((i) => i.status === 'completed').length,
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            {t.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            <span className="ml-1.5 text-xs text-slate-400">({counts[t]})</span>
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No {tab === 'all' ? '' : tab + ' '}action items</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 bg-white rounded-lg border border-slate-200 px-4 py-3 hover:border-slate-300 transition-colors"
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
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {item.assignee && <span className="text-xs text-slate-500">{item.assignee}</span>}
                  {item.due_date && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />{formatDate(item.due_date)}
                    </span>
                  )}
                  {item.meetings && (
                    <Link href={`/meetings/${item.meetings.id}`} className="text-xs text-indigo-500 hover:underline">
                      {item.meetings.title}
                    </Link>
                  )}
                </div>
              </div>

              <span className={cn('text-xs px-2 py-0.5 rounded font-medium shrink-0', PRIORITY_COLORS[item.priority])}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
