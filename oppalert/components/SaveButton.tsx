'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

interface Props {
  oppId: string
  oppTitle?: string
  variant?: 'compact' | 'full'
}

export default function SaveButton({ oppId, oppTitle, variant = 'full' }: Props) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if already saved on mount
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const stored = localStorage.getItem('user')
        if (!stored) return
        
        const userData = JSON.parse(stored)
        const token = userData.token || document.cookie
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

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const stored = localStorage.getItem('user')
    if (!stored) {
      localStorage.setItem('loginRedirect', window.location.pathname)
      router.push('/login?next=' + encodeURIComponent(window.location.pathname))
      return
    }

    const userData = JSON.parse(stored)
    const token = userData.token || document.cookie
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
        const res = await fetch('/api/user/saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oppId }),
        })
        
        if (res.status === 403) {
          const data = await res.json()
          if (data.upgrade) {
            router.push('/pricing?reason=save-limit')
            return
          }
        }
        
        if (res.ok) setSaved(true)
      }
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'compact') {
      return (
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center justify-center transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-75'}`}
          title={saved ? 'Remove from Saved' : 'Save for Later'}
        >
          <Heart 
            size={18} 
            className={`transition-all duration-500 ${saved ? 'fill-emerald text-emerald scale-110' : 'text-white group-hover/save:text-emerald'}`} 
            strokeWidth={saved ? 0 : 2.5}
          />
        </button>
      )
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`w-full py-4 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${
        saved 
          ? 'bg-emerald/10 border-emerald text-emerald shadow-lg shadow-emerald/10' 
          : 'bg-surface2/50 border-border text-muted hover:border-emerald hover:text-primary'
      } ${loading ? 'opacity-70 cursor-wait' : ''}`}
    >
      <Heart 
        size={16} 
        className={`transition-transform duration-500 ${saved ? 'fill-emerald text-emerald scale-110' : ''}`} 
        strokeWidth={saved ? 0 : 2.5}
      />
      {loading ? 'Processing...' : saved ? 'In your Collection' : 'Save for Later'}
    </button>
  )
}
