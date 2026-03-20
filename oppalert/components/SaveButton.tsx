'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SaveButton({ oppId }: { oppId: string }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('savedOpps') || '[]')
    setSaved(savedIds.includes(oppId))
  }, [oppId])

  const handleSave = async () => {
    const userStr = localStorage.getItem('oppalert_user')
    if (!userStr) {
      router.push('/login?next=/opportunities/' + oppId)
      return
    }

    const token = localStorage.getItem('oppalert_token') || ''

    setLoading(true)
    try {
      if (saved) {
        await fetch('/api/user/saved', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ oppId })
        })
        const savedIds = JSON.parse(localStorage.getItem('savedOpps') || '[]')
        localStorage.setItem('savedOpps', JSON.stringify(savedIds.filter((id: string) => id !== oppId)))
        setSaved(false)
      } else {
        const res = await fetch('/api/user/saved', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ oppId })
        })
        const data = await res.json()
        if (data.error && res.status === 403) {
          router.push('/pricing')
          return
        }
        const savedIds = JSON.parse(localStorage.getItem('savedOpps') || '[]')
        localStorage.setItem('savedOpps', JSON.stringify([...savedIds, oppId]))
        setSaved(true)
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
      className={`w-full py-4 px-8 text-xs font-black uppercase tracking-widest rounded-2xl border transition-all flex items-center justify-center gap-3 ${
        saved
          ? 'bg-amber/10 border-amber/30 text-amber shadow-inner'
          : 'text-muted hover:text-primary'
      }`}
      style={!saved ? {backgroundColor: 'var(--icon-bg)', borderColor: 'var(--glass-border)'} : undefined}
    >
      {loading ? '...' : saved ? '♥ Saved' : '♡ Save for Later'}
    </button>
  )
}
