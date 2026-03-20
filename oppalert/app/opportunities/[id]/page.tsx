'use client'
import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { opportunityService } from '@/lib/services/opportunity-service'
import { Opportunity } from '@/lib/types'
import OpportunityCard from '@/components/OpportunityCard'
import AffiliateCard from '@/components/AffiliateCard'
import { getCategoryLabel, calculateDaysRemaining } from '@/lib/utils'
import { CategoryIcon, Globe, Coins, MapPin, Calendar, Share2, Heart, Zap, ArrowRight, Check, Copy, ExternalLink, Loader2, ChevronLeft } from '@/lib/icons'

interface Props {
  params: { id: string }
}

export default function OpportunityDetailPage({ params }: Props) {
  const [opp, setOpp] = useState<Opportunity | null>(null)
  const [related, setRelated] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [shared, setShared] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('oppalert_user')) {
      setIsLoggedIn(true)
    }

    const views = parseInt(localStorage.getItem('oppViews') || '0')
    localStorage.setItem('oppViews', (views + 1).toString())

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await opportunityService.getOne(params.id)
        if (data) {
          setOpp(data)
          const results = await opportunityService.searchAll({ category: data.cat })
          setRelated(results.filter(r => r.id !== data.id).slice(0, 3))

          // Check if saved
          if (localStorage.getItem('oppalert_token')) {
            const savedRes = await fetch('/api/user/saved')
            if (savedRes.ok) {
              const savedData = await savedRes.json()
              setSaved(savedData.some((s: any) => s.id === params.id))
            }
          }
        } else {
          setOpp(null)
        }
      } catch (err) {
        console.error('Error fetching opportunity:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleToggleSave = async () => {
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }

    try {
      const method = saved ? 'DELETE' : 'POST'
      const res = await fetch('/api/user/saved', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oppId: params.id })
      })

      if (res.ok) {
        setSaved(!saved)
      } else {
        const errorData = await res.json()
        alert(errorData.error || 'Failed to update saved status')
      }
    } catch (err) {
      console.error('Error toggling save:', err)
      alert('Network error. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="w-16 h-16 border-4 border-[var(--border)] border-t-amber rounded-full animate-spin" />
        <p className="text-sm font-bold text-amber uppercase tracking-widest animate-pulse">Loading Opportunity...</p>
      </div>
    )
  }

  if (!opp) return notFound()

  const org = opp.organization || opp.org || 'Unknown Organization'
  const cat = opp.category || opp.cat || 'scholarship'
  const loc = opp.location || opp.loc || 'Remote/International'
  const desc = opp.description || opp.desc || ''
  const fund = opp.funding_type || opp.fund || 'Various Funding'
  const days = calculateDaysRemaining(opp.deadline)
  const title = opp.title || 'Untitled Opportunity'
  const about = opp.about || desc
  const elig = opp.elig || ['Open to all applicants who meet the basic requirements.']
  const benefits = opp.benefits || [fund]
  const applyUrl = opp.application_url || opp.applyUrl || '#'
  
  let deadlineStr = 'Rolling'
  if (opp.deadline) deadlineStr = new Date(opp.deadline).toLocaleDateString()
  
  const quickinfo = opp.quickinfo || {
    'Deadline': deadlineStr,
    'Location': loc,
    'Funding': fund
  }

  const progressPct = Math.max(10, Math.min(95, 100 - (days / 90) * 100))

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.share) {
        await navigator.share({
          title: title,
          text: desc,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <main className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-20">
      {/* Breadcrumb */}
      <div className="mb-8 animate-fade-up">
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-muted hover:text-amber font-bold text-xs uppercase tracking-[0.2em] transition-all group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* ── LEFT COLUMN: CONTENT ── */}
        <div className="space-y-8 animate-fade-up animate-delay-100">
          {/* Main Hero Header */}
          <div className="glass-gradient border rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group" style={{borderColor: 'var(--border)'}}>
            <div className="absolute top-0 right-0 w-64 h-64 blur-[80px] -z-10 group-hover:scale-150 transition-transform duration-1000" style={{backgroundColor: 'rgba(232, 160, 32, 0.05)'}} />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl icon-box flex items-center justify-center shadow-inner group-hover:rotate-3 transition-transform">
                  <CategoryIcon cat={cat} size={32} className="text-amber drop-shadow-glow-amber" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber uppercase tracking-widest mb-1">{org}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="badge badge-blue">{getCategoryLabel(cat)}</span>
                    <span className="badge badge-gray">{fund}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="btn-ghost px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl gap-2 active:scale-95 transition-all self-start md:self-auto"
              >
                {shared ? <Check size={16} className="text-success" /> : <Share2 size={16} />}
                {shared ? 'Copied' : 'Share'}
              </button>
            </div>

            <h1 className="font-syne text-3xl md:text-5xl font-black text-primary leading-tight mb-8">
              {title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Location', value: loc, icon: <MapPin size={16} /> },
                { label: 'Closing Date', value: deadlineStr, icon: <Calendar size={16} /> },
                { label: 'Funding', value: fund, icon: <Zap size={16} /> },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-4 group/item transition-all icon-box" style={{borderColor: 'var(--glass-border)'}}>
                  <div className="flex items-center gap-2 text-muted mb-2">
                    {item.icon}
                    <span className="text-[10px] uppercase font-black tracking-widest">{item.label}</span>
                  </div>
                  <p className="text-sm font-bold text-primary group-hover/item:text-amber transition-colors line-clamp-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Content */}
          <div className="space-y-6">
            {[
              { id: 'about', title: 'About the Opportunity', icon: <Globe size={20} />, content: about, type: 'text' },
              { id: 'elig', title: 'Eligibility Requirements', icon: <Check size={20} />, content: elig, type: 'list' },
              { id: 'benefits', title: 'Benefits & Funding', icon: <Coins size={20} />, content: benefits, type: 'list' },
            ].map((section) => (
              <div key={section.id} className="glass-gradient border rounded-[2rem] p-8 md:p-10 group" style={{borderColor: 'var(--border)'}}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-amber shadow-inner group-hover:scale-110 transition-transform" style={{backgroundColor: 'var(--amber-dim)'}}>
                    {section.icon}
                  </div>
                  <h2 className="font-syne text-xl font-black text-primary">{section.title}</h2>
                </div>
                
                {section.type === 'text' ? (
                  <p className="text-subtle text-base leading-relaxed font-medium whitespace-pre-line">
                    {section.content as string}
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(section.content as string[]).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl transition-all group/li" style={{backgroundColor: 'var(--icon-bg)', border: '1px solid var(--glass-border)'}}>
                        <div className="mt-1 w-5 h-5 shrink-0 rounded-full bg-success/10 flex items-center justify-center text-success group-hover/li:bg-success group-hover/li:text-bg transition-colors">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <span className="text-sm text-subtle font-medium leading-relaxed group-hover/li:text-primary transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: SIDEBAR ── */}
        <aside className="space-y-6 animate-fade-up animate-delay-200">
          {/* Deadline Countdown */}
          <div className="bg-amber-gradient rounded-[2.5rem] p-8 text-bg text-center shadow-glow-amber relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 blur-3xl rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">
              {days === 0 ? 'This Opportunity Has' : 'Application Closes In'}
            </p>
            <div className="font-syne text-7xl font-black tracking-tighter mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
              {days}
            </div>
            <p className="text-sm font-black uppercase tracking-widest mb-8">
              {days === 0 ? 'Closed' : 'Days Remaining'}
            </p>
            
            <div className="space-y-3">
              <div className="h-2 bg-bg/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-bg shadow-glow-amber" 
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-[10px] font-bold opacity-60">Status: High Competition Expected</p>
            </div>
          </div>

          {/* Action Card */}
          <div className="glass-gradient border rounded-[2.5rem] p-8 space-y-4" style={{borderColor: 'var(--border)'}}>
            {isLoggedIn ? (
              <a 
                href={days === 0 ? '#' : applyUrl} 
                target={days === 0 ? '_self' : '_blank'} 
                rel="noopener noreferrer"
                className={`btn-primary w-full py-5 px-8 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow-amber hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
                  days === 0 ? 'opacity-50 pointer-events-none grayscale' : ''
                }`}
              >
                {days === 0 ? 'Application Closed' : 'Apply Official'}
                {days > 0 && <ExternalLink size={18} className="stroke-[2.5]" />}
              </a>
            ) : (
              <Link
                href="/login"
                className={`btn-primary w-full py-5 px-8 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow-amber hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
                  days === 0 ? 'opacity-50 pointer-events-none grayscale' : ''
                }`}
              >
                {days === 0 ? 'Application Closed' : 'Login to Apply'}
                {days > 0 && <ExternalLink size={18} className="stroke-[2.5]" />}
              </Link>
            )}
            <button
              onClick={handleToggleSave}
              className={`w-full py-4 px-8 text-xs font-black uppercase tracking-widest rounded-2xl border transition-all flex items-center justify-center gap-3 ${
                saved 
                  ? 'bg-danger/10 border-danger/30 text-danger shadow-inner' 
                  : 'text-muted hover:text-primary'
              }`}
              style={!saved ? {backgroundColor: 'var(--icon-bg)', borderColor: 'var(--glass-border)'} : undefined}
            >
              <Heart size={18} className={saved ? 'fill-current' : ''} />
              {saved ? 'Bookmarked' : 'Save for Later'}
            </button>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="glass-gradient border rounded-[2.5rem] p-8" style={{borderColor: 'var(--border)'}}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6">Details Summary</h4>
            <div className="space-y-4">
              {Object.entries(quickinfo).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start group">
                  <span className="text-xs text-muted font-medium">{key}</span>
                  <span className="text-xs text-subtle font-bold text-right max-w-[140px] group-hover:text-primary transition-colors">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <AffiliateCard />

          {/* Premium Upsell Small */}
          <div className="rounded-[2.5rem] p-8 text-center group overflow-hidden relative" style={{backgroundColor: 'var(--icon-bg)', border: '1px solid var(--border)'}}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{backgroundColor: 'var(--icon-bg)'}} />
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:rotate-6 transition-transform" style={{backgroundColor: 'var(--icon-bg)', border: '1px solid var(--glass-border)'}}>
              <Zap size={24} className="fill-current" />
            </div>
            <h4 className="font-syne font-black text-primary mb-2">Want Instant Updates?</h4>
            <p className="text-xs text-subtle font-medium mb-6">Get premium alerts for this organization and related niches.</p>
            <Link href="/pricing" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline block">
              Upgrade to Premium →
            </Link>
          </div>
        </aside>
      </div>

      {/* ── RELATED SECTION ── */}
      {related.length > 0 && (
        <section className="mt-24 pt-20 border-t" style={{borderColor: 'var(--border)'}}>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-title text-left mb-4">
                Similar <span>Opportunities</span>
              </h2>
              <p className="text-subtle font-medium">Opportunities you might have missed in {getCategoryLabel(cat)}.</p>
            </div>
            <Link href={`/opportunities?cat=${cat}`} className="text-amber font-bold text-xs uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((r) => (
              <OpportunityCard key={r.id} opp={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
