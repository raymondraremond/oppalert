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
import { getCategoryLabel, calculateDaysRemaining } from '@/lib/utils'
import { CategoryIcon, Globe, Coins, MapPin, Calendar, Share2, Zap, Check, ChevronLeft } from '@/lib/icons'

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
          if (!related.length) {
             setRelated(getRelated(params.id, res.data.cat || 'scholarship', 3))
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))

    if (typeof window !== 'undefined') {
      const views = parseInt(localStorage.getItem('oppViews') || '0')
      localStorage.setItem('oppViews', (views + 1).toString())
    }
  }, [params.id])

  if (isLoading && !opp) {
    return (
      <main className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-20">
        <div className="animate-pulse space-y-8">
          <div className="h-4 w-32 bg-[#1C2119] rounded-full" />
          <div className="h-64 bg-[#141710] border border-[#252D22] rounded-[2.5rem]" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <div className="h-96 bg-[#141710] border border-[#252D22] rounded-[2rem]" />
            <div className="h-96 bg-[#141710] border border-[#252D22] rounded-[2rem]" />
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
      <div className="mb-8 animate-fade-up">
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-[#555C50] hover:text-[#E8A020] font-bold text-xs uppercase tracking-[0.2em] transition-all group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-8 animate-fade-up">
          <div className="glass-gradient border border-[#252D22] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8A020]/5 blur-[80px] -z-10" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#1C2119] flex items-center justify-center border border-[#252D22] group-hover:rotate-3 transition-transform">
                  <CategoryIcon cat={cat} size={32} className="text-[#E8A020]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#E8A020] uppercase tracking-widest mb-1">{org}</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[#1C2119] rounded-full text-[10px] font-bold text-[#9A9C8E]">{getCategoryLabel(cat)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  setShared(true)
                  setTimeout(() => setShared(false), 2000)
                }}
                className="px-6 py-3 bg-[#1C2119] border border-[#252D22] text-[#9A9C8E] text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#222820] transition-all flex items-center gap-2"
              >
                {shared ? '✓ Copied' : <><Share2 size={16} /> Share</>}
              </button>
            </div>

            <h1 className="font-syne text-3xl md:text-5xl font-black text-[#EDE8DF] leading-tight mb-8">
              {title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Location', value: loc, icon: <MapPin size={16} /> },
                { label: 'Closing Date', value: deadlineStr, icon: <Calendar size={16} /> },
                { label: 'Funding', value: fund, icon: <Zap size={16} /> },
              ].map((item) => (
                <div key={item.label} className="bg-[#1C2119]/50 border border-[#252D22] rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-[#555C50] mb-2 text-[10px] uppercase font-black tracking-widest">
                    {item.icon} {item.label}
                  </div>
                  <p className="text-sm font-bold text-[#EDE8DF]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#141710] border border-[#252D22] rounded-[2rem] p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-[#E8A020]/10 flex items-center justify-center text-[#E8A020]"><Globe size={20} /></div>
                 <h2 className="font-syne text-xl font-black text-[#EDE8DF]">About</h2>
              </div>
              <p className="text-[#9A9C8E] text-base leading-relaxed whitespace-pre-line">{about}</p>
            </div>

            <div className="bg-[#141710] border border-[#252D22] rounded-[2rem] p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-[#E8A020]/10 flex items-center justify-center text-[#E8A020]"><Check size={20} /></div>
                 <h2 className="font-syne text-xl font-black text-[#EDE8DF]">Eligibility</h2>
              </div>
              <ul className="space-y-4">
                {elig.map((item, i) => (
                  <li key={i} className="flex gap-4 text-[#9A9C8E] text-sm font-medium">
                    <span className="text-[#E8A020] text-lg leading-none">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-[#E8A020] rounded-[2.5rem] p-8 text-[#080A07] text-center shadow-glow-amber">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">
              {days <= 0 ? 'Deadline Passed' : 'Closes In'}
            </p>
            <div className="font-syne text-7xl font-black tracking-tighter mb-2">{days <= 0 ? 0 : days}</div>
            <p className="text-sm font-black uppercase tracking-widest mb-8">Days Left</p>
            <div className="w-full bg-[#080A07]/10 h-2 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#080A07]" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="bg-[#141710] border border-[#252D22] rounded-[2.5rem] p-8 space-y-4">
            <ApplyButton applyUrl={applyUrl} oppId={params.id} disabled={days <= 0} />
            <SaveButton oppId={params.id} />
          </div>

          <AffiliateCard />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-24 pt-20 border-t border-[#252D22]">
          <h2 className="font-syne text-3xl font-black text-[#EDE8DF] mb-12">Similar <span className="text-[#E8A020]">Opportunities</span></h2>
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
