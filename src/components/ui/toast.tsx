'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastVariant = 'default' | 'success' | 'error' | 'info'

interface ToastMessage {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextValue {
  toast: (opts: Omit<ToastMessage, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])

  const toast = React.useCallback((opts: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...opts, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast: t, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const icons = {
    default: null,
    success: <CheckCircle className="h-4 w-4 text-green-500" />,
    error: <AlertCircle className="h-4 w-4 text-red-500" />,
    info: <Info className="h-4 w-4 text-blue-500" />,
  }
  const border = {
    default: 'border-slate-200',
    success: 'border-green-200',
    error: 'border-red-200',
    info: 'border-blue-200',
  }

  return (
    <div className={cn('bg-white rounded-lg border shadow-lg p-3 flex items-start gap-3 animate-fade-in', border[t.variant || 'default'])}>
      {icons[t.variant || 'default']}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{t.title}</p>
        {t.description && <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>}
      </div>
      <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600 shrink-0">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
