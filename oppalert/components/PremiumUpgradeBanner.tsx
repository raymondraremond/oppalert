'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PremiumUpgradeBanner() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  
  useEffect(() => {
    // Check if already dismissed today
    const dismissedAt = localStorage.getItem('bannerDismissed')
    if (dismissedAt) {
      const hoursSince = (Date.now() - parseInt(dismissedAt)) 
        / (1000 * 60 * 60)
      if (hoursSince < 24) { setDismissed(true); return }
    }
    
    // Track opportunity views
    const views = parseInt(
      localStorage.getItem('oppViews') || '0'
    )
    if (views >= 3) setShow(true)
  }, [])
  
  if (!show || dismissed) return null
  
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #1A1208, #141710)',
      border: '1px solid rgba(232,160,32,0.3)',
      borderRadius: 16, padding: '1.25rem 1.5rem',
      display: 'flex', alignItems: 'center',
      gap: 20, zIndex: 500,
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      maxWidth: 520, width: '90%',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 13, fontWeight: 700,
          color: '#E8A020', marginBottom: 4,
          fontFamily: 'var(--font-syne), sans-serif',
        }}>
          ⚡ You are viewing a lot of opportunities
        </div>
        <div style={{ fontSize: 12, color: '#9A9C8E' }}>
          Get instant alerts and never miss a deadline. 
          Only ₦1,500/month.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <Link href="/pricing">
          <button style={{
            background: '#E8A020', border: 'none',
            borderRadius: 8, padding: '8px 16px',
            fontSize: 12, fontWeight: 700,
            color: '#090A07', cursor: 'pointer',
            fontFamily: 'var(--font-syne), sans-serif',
          }}>
            Upgrade →
          </button>
        </Link>
        <button onClick={() => {
          setDismissed(true)
          localStorage.setItem('bannerDismissed', Date.now().toString())
        }} style={{
          background: 'transparent',
          border: '1px solid #2E3530',
          borderRadius: 8, padding: '8px 12px',
          fontSize: 12, color: '#555C50',
          cursor: 'pointer',
        }}>
          Later
        </button>
      </div>
    </div>
  )
}
