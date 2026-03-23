'use client'
import { useState, useEffect } from 'react'

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

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      background: type === 'success' ? '#0F2E1C' : '#1A0808',
      border: `1px solid ${type === 'success'
        ? 'rgba(52,194,122,0.4)'
        : 'rgba(240,80,80,0.4)'}`,
      borderRadius: 10,
      padding: '12px 20px',
      fontSize: 14,
      fontWeight: 600,
      color: type === 'success' ? '#34C27A' : '#F05050',
      zIndex: 9999,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      {type === 'success' ? '✓' : '✗'} {message}
    </div>
  )
}
