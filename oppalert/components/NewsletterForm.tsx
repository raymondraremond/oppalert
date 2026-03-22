'use client'
import { useState } from 'react'
import { Check, Send, PartyPopper } from 'lucide-react'
import { CategoryIcon } from '@/lib/icons'

export default function NewsletterForm() {
  const [step, setStep] = useState<'email' | 'prefs' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [prefs, setPrefs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'job', label: 'Remote Jobs' },
    { id: 'fellowship', label: 'Fellowships' },
    { id: 'grant', label: 'Grants' },
    { id: 'startup', label: 'Startup Funding' },
  ]

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStep('prefs')
  }

  const handleTogglePref = (id: string) => {
    setPrefs(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSubmitPrefs = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferences: prefs }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }
      setStep('done')
    } catch (err: any) {
      console.error('Newsletter error:', err)
      alert(err.message || 'Error subscribing. Please check your Resend API keys in .env')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="animate-fade-up bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 shadow-premium max-w-md mx-auto">
        <div style={{ textAlign: 'center' }}>
          <div className="flex justify-center mb-2 text-[#E8A020]"><PartyPopper size={32} /></div>
          <div style={{
            fontSize: 14, fontWeight: 700,
            color: '#34C27A', marginBottom: 6,
          }}>
            {"You're in! Check your inbox."}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>
            Share with a friend who needs this
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <a href="https://twitter.com/intent/tweet?text=Just%20found%20OppAlert%20-%20free%20platform%20for%20African%20students%20to%20find%20scholarships%20and%20remote%20jobs%20oppalert.vercel.app"
               target="_blank" rel="noopener noreferrer"
               style={{ textDecoration: 'none', flex: 1 }}>
              <button style={{
                width: '100%', padding: '8px',
                background: '#1a1a2e',
                border: '1px solid #2E3530',
                borderRadius: 8, fontSize: 12,
                color: 'var(--primary)', cursor: 'pointer',
              }}>
                Share on X/Twitter
              </button>
            </a>
            <a href="https://wa.me/?text=Found%20this%20free%20platform%20for%20scholarships%20and%20remote%20jobs%20for%20Africans%20oppalert.vercel.app"
               target="_blank" rel="noopener noreferrer"
               style={{ textDecoration: 'none', flex: 1 }}>
              <button style={{
                width: '100%', padding: '8px',
                background: '#0F2E1C',
                border: '1px solid #1A3D2A',
                borderRadius: 8, fontSize: 12,
                color: '#34C27A', cursor: 'pointer',
              }}>
                Share on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'prefs') {
    return (
      <div className="animate-fade-up bg-[var(--glass)] border border-[var(--border)] rounded-2xl p-6 shadow-premium max-w-md mx-auto">
        <h3 className="text-primary font-syne font-bold text-lg mb-2 text-center">What are you looking for?</h3>
        <p className="text-subtle text-xs mb-4 text-center">We will only send you relevant opportunities.</p>
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleTogglePref(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                prefs.includes(cat.id) 
                  ? 'bg-amber text-bg shadow-glow-amber' 
                  : 'bg-[var(--icon-bg)] text-muted border border-[var(--glass-border)]'
              }`}
            >
              <CategoryIcon cat={cat.id as any} size={14} />
              {cat.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSubmitPrefs}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-amber-gradient font-syne font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-glow-amber disabled:opacity-50 text-[#0D0F0B]"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
          ) : (
            'Complete Setup →'
          )}
        </button>
      </div>
    )
  }

  return (
    <form className="relative group max-w-md mx-auto" onSubmit={handleSubmitEmail}>
      <div className="rounded-full border flex items-stretch p-1.5 transition-all duration-300 shadow-premium" style={{backgroundColor: 'var(--glass)', borderColor: 'var(--border)'}}>
        <input
          type="email"
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 bg-transparent border-none px-5 py-3 text-primary text-sm focus:outline-none placeholder:text-subtle font-medium"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 rounded-full bg-amber-gradient font-syne font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-glow-amber disabled:opacity-50 disabled:cursor-not-allowed"
          style={{color: '#0D0F0B'}}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
          ) : (
            <>
              <Send size={14} className="stroke-[2.5]" />
              Subscribe
            </>
          )}
        </button>
      </div>
    </form>
  )
}
