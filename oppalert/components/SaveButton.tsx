'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  oppId: string
  oppTitle?: string
}

export default function SaveButton({ oppId, oppTitle }: Props) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if already saved on mount
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const stored = localStorage.getItem('oppalert_user')
        if (!stored) return
        
        const token = localStorage.getItem('oppalert_token') || document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]
          
        if (!token) return

        const res = await fetch('/api/user/saved', {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        })
        if (!res.ok) return
        const data = await res.json()
        
        // Check if this opportunity is in saved list
        const isSaved = data?.some(
          (opp: any) => 
            opp.id === oppId || 
            opp.opportunity_id === oppId
        )
        setSaved(isSaved || false)
      } catch (e) {
        // Silent fail
      }
    }
    checkSaved()
  }, [oppId])

  const handleSave = async () => {
    // Check if logged in first
    const stored = localStorage.getItem('oppalert_user')
    if (!stored) {
      // Redirect to login
      localStorage.setItem('loginRedirect', window.location.pathname)
      router.push('/login?next=' + encodeURIComponent(window.location.pathname))
      return
    }

    const token = localStorage.getItem('oppalert_token') || document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]

    if (!token) {
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      if (saved) {
        // UNSAVE — DELETE request
        const res = await fetch('/api/user/saved', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oppId }),
        })
        if (res.ok) setSaved(false)
      } else {
        // SAVE — POST request
        const res = await fetch('/api/user/saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oppId }),
        })
        
        if (res.status === 403) {
          // Free user hit save limit
          router.push('/pricing?reason=save-limit')
          return
        }
        
        if (res.ok) setSaved(true)
      }
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      style={{
        width: '100%',
        padding: '11px',
        borderRadius: 10,
        border: saved ? '2px solid #E8A020' : '1px solid #252D22',
        background: saved ? 'rgba(232,160,32,0.1)' : 'transparent',
        color: saved ? '#E8A020' : '#9A9C8E',
        fontSize: 13,
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontFamily: 'inherit',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? 'Saving...' : saved ? '♥ Saved' : '♡ Save for Later'}
    </button>
  )
}
