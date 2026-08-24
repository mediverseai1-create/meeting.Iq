import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  try {
    return format(parseISO(dateString), 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  try {
    return format(parseISO(dateString), 'MMM d, yyyy · h:mm a')
  } catch {
    return '—'
  }
}

export function formatRelative(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
  } catch {
    return '—'
  }
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '…'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const MEETING_TYPE_LABELS: Record<string, string> = {
  general: 'General',
  sales: 'Sales Call',
  team: 'Team Meeting',
  one_on_one: '1:1',
  client: 'Client Meeting',
  interview: 'Interview',
  product: 'Product Meeting',
  investor: 'Investor Meeting',
}

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}
