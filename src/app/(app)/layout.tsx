import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar, MobileNav } from '@/components/layout/sidebar'
import { ToastProvider } from '@/components/ui/toast'
import type { Profile } from '@/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile && !profile.onboarding_completed) redirect('/onboarding')

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex w-60 shrink-0 flex-col">
          <Sidebar profile={profile as Profile} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile header */}
          <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
            <MobileNav profile={profile as Profile} />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
              </div>
              <span className="font-bold text-slate-900">MeetingIQ</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
