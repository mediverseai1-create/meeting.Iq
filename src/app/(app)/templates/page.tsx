import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutTemplate } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Templates' }

const TYPE_ICONS: Record<string, string> = {
  sales: '💼', team: '👥', one_on_one: '🤝', client: '🏢',
  interview: '🎤', product: '📱', investor: '💰', general: '📋',
}

export default async function TemplatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: templates } = await supabase
    .from('meeting_templates')
    .select('*')
    .or(`is_system.eq.true,user_id.eq.${user.id}`)
    .order('name')

  const systemTemplates = templates?.filter((t) => t.is_system) || []
  const customTemplates = templates?.filter((t) => !t.is_system) || []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
          <p className="text-sm text-slate-500 mt-1">Meeting templates to guide your notes structure</p>
        </div>
      </div>

      <div className="space-y-6">
        {systemTemplates.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Standard Templates</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {systemTemplates.map((template) => {
                const sections = (template.template_structure as { sections?: string[] })?.sections || []
                return (
                  <Link
                    key={template.id}
                    href={`/meetings/new?template=${template.id}`}
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all group"
                  >
                    <div className="text-2xl mb-3">{TYPE_ICONS[template.meeting_type] || '📋'}</div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{template.name}</h3>
                    {template.description && (
                      <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                    )}
                    {sections.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {sections.slice(0, 4).map((s: string) => (
                          <span key={s} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{s}</span>
                        ))}
                        {sections.length > 4 && (
                          <span className="text-xs text-slate-400">+{sections.length - 4} more</span>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-indigo-600 mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Use this template →
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {customTemplates.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Your Templates</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {customTemplates.map((template) => (
                <Link
                  key={template.id}
                  href={`/meetings/new?template=${template.id}`}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  {template.description && <p className="text-xs text-slate-500 mt-1">{template.description}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {!templates?.length && (
          <div className="text-center py-16">
            <LayoutTemplate className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No templates found</p>
          </div>
        )}
      </div>
    </div>
  )
}
