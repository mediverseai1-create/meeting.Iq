'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn, getInitials } from '@/lib/utils'
import type { Profile } from '@/types'
import {
  LayoutDashboard, Video, FileText, CheckSquare, Lightbulb,
  Search, LayoutTemplate, Settings, Plus, LogOut, ChevronDown,
  Mic,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Meetings', href: '/meetings', icon: Video },
  { label: 'Notes', href: '/notes', icon: FileText },
  { label: 'Action Items', href: '/action-items', icon: CheckSquare },
  { label: 'Insights', href: '/insights', icon: Lightbulb },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Templates', href: '/templates', icon: LayoutTemplate },
]

interface SidebarProps {
  profile: Profile | null
  onClose?: () => void
}

export function Sidebar({ profile, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = React.useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="h-7 w-7 rounded-md bg-indigo-600 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-lg leading-none">MeetingIQ</span>
        </Link>
      </div>

      {/* New meeting button */}
      <div className="px-3 py-3">
        <Link
          href="/meetings/new"
          onClick={onClose}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Meeting
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive(item.href)
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-3 space-y-1">
        <Link
          href="/settings"
          onClick={onClose}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname.startsWith('/settings')
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
          <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-700 shrink-0">
            {getInitials(profile?.full_name || profile?.email || '?')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            title="Sign out"
            className="text-slate-400 hover:text-slate-600 transition-colors ml-auto"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Mobile nav trigger
export function MobileNav({ profile }: { profile: Profile | null }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 shadow-xl">
            <Sidebar profile={profile} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
