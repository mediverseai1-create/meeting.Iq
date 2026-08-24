import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ActionItemsClient } from './action-items-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Action Items' }

export default async function ActionItemsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('action_items')
    .select(`
      *,
      meetings(id, title)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Action Items</h1>
      </div>
      <ActionItemsClient items={items || []} />
    </div>
  )
}
