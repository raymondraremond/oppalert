'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

export default function Toast({
  message,
  type = 'success',
  onClose,
}: {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const typeConfig = {
    success: {
      bg: 'bg-emerald/10',
      border: 'border-emerald/40',
      text: 'text-emerald',
      icon: <CheckCircle size={18} />,
      glow: 'shadow-emerald/10'
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/40',
      text: 'text-red-500',
      icon: <XCircle size={18} />,
      glow: 'shadow-red-500/10'
    }
  }

  const config = typeConfig[type]

  return (
    <div className={`fixed top-12 right-6 z-[9999] animate-fade-down`}>
      <div className={`
        ${config.bg} ${config.border} ${config.text} ${config.glow}
        backdrop-blur-xl border-2 rounded-2xl px-6 py-4 flex items-center gap-4 
        shadow-2xl font-bold text-sm tracking-wide
      `}>
        <div className="flex-shrink-0 animate-pulse-soft">
          {config.icon}
        </div>
        <p className="opacity-90">{message}</p>
        <button 
          onClick={onClose}
          className="ml-4 hover:opacity-50 transition-opacity p-1"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
