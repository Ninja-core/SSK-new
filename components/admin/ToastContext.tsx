'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type, title, message }: Omit<Toast, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
      setToasts((prev) => [...prev, { id, type, title, message }])
      setTimeout(() => {
        removeToast(id)
      }, 4200)
    },
    [removeToast]
  )

  const success = useCallback(
    (title: string, message?: string) => showToast({ type: 'success', title, message }),
    [showToast]
  )
  const error = useCallback(
    (title: string, message?: string) => showToast({ type: 'error', title, message }),
    [showToast]
  )
  const info = useCallback(
    (title: string, message?: string) => showToast({ type: 'info', title, message }),
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast container floating bottom-right */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-[#13321F] border-[#1F5A3A] text-[#FAF5EC]'
                : toast.type === 'error'
                ? 'bg-[#5C1D1D] border-[#8B2D2D] text-[#FFFDF8]'
                : 'bg-[#FFFDF7] border-[#E6DFCC] text-[#12372A]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="size-5 text-[#E8A33D]" />}
              {toast.type === 'error' && <AlertCircle className="size-5 text-rose-300" />}
              {toast.type === 'info' && <Info className="size-5 text-[#1F5A3A]" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold leading-snug">{toast.title}</h4>
              {toast.message && (
                <p className={`mt-0.5 text-xs ${toast.type === 'info' ? 'text-[#5B6A5F]' : 'opacity-85'}`}>
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-full p-1 opacity-70 hover:opacity-100 transition"
              aria-label="Dismiss toast"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
