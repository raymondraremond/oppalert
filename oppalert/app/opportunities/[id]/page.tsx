'use client'
import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOpportunity, getRelated } from '@/lib/data'
import { Opportunity } from '@/lib/types'
import OpportunityCard from '@/components/OpportunityCard'
import AffiliateCard from '@/components/AffiliateCard'
import SaveButton from '@/components/SaveButton'
import ApplyButton from '@/components/ApplyButton'
import AICareerAssistant from '@/components/AICareerAssistant'
import { getCategoryLabel, calculateDaysRemaining } from '@/lib/utils'
import { CategoryIcon, Globe, Coins, MapPin, Calendar, Share2, Zap, Check, ChevronLeft } from '@/lib/icons'
import ScrollReveal from '@/components/ScrollReveal'

interface Props {
  params: { id: string }
}

export default function OpportunityDetailPage({ params }: Props) {
  const [opp, setOpp] = useState<Opportunity | null>(null)
  const [related, setRelated] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    // Start with seed data immediately
    const seedOpp = getOpportunity(params.id)
    if (seedOpp) {
      setOpp(seedOpp)
      setRelated(getRelated(params.id, seedOpp.cat || 'scholarship', 3))
      setIsLoading(false)
    }

    // Try DB in background
    fetch('/api/opportunities/' + params.id)
      .then(r => r.json())
      .then(res => {
          if (res?.data?.id) {
            setOpp(res.data)
            setRelated(prev => {
              if (prev.length === 0) {
                return getRelated(params.id, res.data.cat || 'scholarship', 3)
              }
              return prev
            })
          }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))

    if (typeof window !== 'undefined') {
      const views = parseInt(localStorage.getItem('oppViews') || '0')
      localStorage.setItem('oppViews', (views + 1).toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  if (isLoading && !opp) {
    return (
      <main className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-20">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-32 bg-icon-bg rounded-full" />
          <div className="h-64 bg-bg2 border border-border rounded-[2.5rem]" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div className="h-96 bg-bg2 border border-border rounded-[2rem]" />
            <div className="h-96 bg-bg2 border border-border rounded-[2rem]" />
          </div>
        </div>
      </main>
    )
  }

  if (!opp && !isLoading) return notFound()
  if (!opp) return null

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

  return (
    <main className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-20">
      <div className="mb-8 overflow-hidden">
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-muted hover:text-emerald font-bold text-xs uppercase tracking-[0.2em] transition-all group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </Link>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-[2rem] mb-10 border border-border/50 group">
        <img
          src={opp.image || opp.image_url || `https://picsum.photos/seed/${opp.id}/1200/600`}
          alt={opp.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `https://picsum.photos/seed/${cat}/1200/600`
          }}
        />
        
        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        
        {/* Category badge on image */}
        <div className="absolute top-6 left-6 px-4 py-2 bg-bg/80 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-primary capitalize tracking-wide shadow-xl z-20">
          {cat}
        </div>

        {/* Floating save on image */}
        <div className="absolute top-6 right-6 z-20">
           <SaveButton oppId={params.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <div className="space-y-10">
          <ScrollReveal>
            <div className="bg-surface/30 border border-border/60 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/5 blur-[80px] -z-10" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-surface2 flex items-center justify-center border border-border group-hover:rotate-3 transition-transform shadow-inner">
                    <CategoryIcon cat={cat} size={40} className="text-emerald" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald uppercase tracking-widest mb-2">{org}</p>
                    <div className="flex gap-2">
                      <span className="px-4 py-1.5 bg-surface2 border border-border rounded-full text-[10px] font-black text-primary/80 uppercase tracking-widest flex items-center gap-2">
                        <CategoryIcon cat={cat} size={14} />
                        {getCategoryLabel(cat)}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    setShared(true)
                    setTimeout(() => setShared(false), 2000)
                  }}
                  className="px-6 py-3.5 bg-surface/50 border border-border text-primary text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-surface transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  {shared ? '✓ URL Copied' : <><Share2 size={16} /> Share Opportunity</>}
                </button>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary leading-tight mb-10 tracking-tight">
                {title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Location', value: loc, icon: <MapPin size={18} className="text-emerald" /> },
                  { label: 'Closing Date', value: deadlineStr, icon: <Calendar size={18} className="text-emerald" /> },
                  { label: 'Funding', value: fund, icon: <Zap size={18} className="text-emerald" /> },
                ].map((item) => (
                  <div key={item.label} className="bg-surface2/50 border border-border rounded-2xl p-5 hover:border-emerald/20 transition-colors group/item">
                    <div className="flex items-center gap-2 text-muted mb-3 text-[10px] uppercase font-black tracking-widest group-hover/item:text-emerald transition-colors">
                      {item.icon} {item.label}
                    </div>
                    <p className="text-sm font-bold text-primary flex-wrap">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            <ScrollReveal delay={100}>
              <div className="bg-surface/30 border border-border rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald shadow-inner"><Globe size={24} /></div>
                   <h2 className="font-serif text-2xl font-bold text-primary">About</h2>
                </div>
                <p className="text-muted text-lg leading-relaxed whitespace-pre-line font-serif italic text-primary/80 mb-8 border-l-4 border-emerald/20 pl-6">
                  {about}
                </p>
                <div className="h-px w-full bg-gradient-to-r from-border/50 to-transparent mb-8" />
                <p className="text-muted text-base leading-relaxed whitespace-pre-line">{desc}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="bg-surface/30 border border-border rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald shadow-inner"><Check size={24} /></div>
                   <h2 className="font-serif text-2xl font-bold text-primary">Eligibility</h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {elig.map((item, i) => (
                    <li key={i} className="flex gap-4 p-4 bg-surface2/40 border border-border/50 rounded-2xl text-muted text-sm font-medium hover:border-emerald/30 transition-colors">
                      <span className="text-emerald text-lg leading-none">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <aside className="space-y-8">
          <ScrollReveal delay={300}>
            <AICareerAssistant opportunityId={opp.id} oppTitle={title} />
          </ScrollReveal>

          <ScrollReveal delay={350}>
            <div className="bg-surface/30 border border-border rounded-[2.5rem] p-8 text-center backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-muted">
                {days <= 0 ? 'Deadline Passed' : 'Time Remaining'}
              </p>
              <div className="font-serif text-7xl font-bold tracking-tight mb-2 text-primary">
                {days <= 0 ? 0 : days}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-10 text-emerald">Days Left</p>
              <div className="w-full bg-surface2 h-2.5 rounded-full overflow-hidden mb-6 border border-border">
                <div 
                  className={`h-full bg-gradient-to-r from-emerald to-emerald-light transition-all duration-1000 ${days <= 3 && days > 0 ? 'animate-pulse' : ''}`} 
                  style={{ width: `${progressPct}%` }} 
                />
              </div>
              <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Application Status</div>
              <div className="font-bold text-primary text-sm mb-0">
                {days <= 0 ? (
                   <span className="text-danger">EXPIRED</span>
                ) : days <= 7 ? (
                   <span className="text-red-500">CLOSING SOON</span>
                ) : (
                   <span className="text-emerald text-xs">OPEN FOR APPLICATIONS</span>
                )}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="bg-surface/30 border border-border rounded-[2.5rem] p-8 space-y-4 backdrop-blur-sm">
              <ApplyButton applyUrl={applyUrl} oppId={params.id} disabled={days <= 0} />
              <div className="flex justify-center">
                <SaveButton oppId={params.id} />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <AffiliateCard />
          </ScrollReveal>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-32 pt-20 border-t border-border/50">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-12 tracking-tight">
            Similar <span className="text-emerald italic">Opportunities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((r) => (
              <OpportunityCard key={r.id} opportunity={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
