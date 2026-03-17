'use client'
import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { opportunityService } from '@/lib/services/opportunity-service'
import { Opportunity } from '@/lib/types'
import OpportunityCard from '@/components/OpportunityCard'
import { getCategoryLabel } from '@/lib/utils'
import { CategoryIcon, MapPin, Calendar, Share2, Heart, Zap, ArrowRight, Check, Copy, ExternalLink, Loader2, ChevronLeft } from '@/lib/icons'

interface Props {
  params: { id: string }
}

export default function OpportunityDetailPage({ params }: Props) {
  const [opp, setOpp] = useState<Opportunity | null>(null)
  const [related, setRelated] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await opportunityService.getOne(params.id)
        if (data) {
          setOpp(data)
          const results = await opportunityService.searchAll({ category: data.cat })
          setRelated(results.filter(r => r.id !== data.id).slice(0, 3))
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="w-16 h-16 border-4 border-white/5 border-t-amber rounded-full animate-spin" />
        <p className="text-sm font-bold text-amber uppercase tracking-widest animate-pulse">Loading Opportunity...</p>
      </div>
    )
  }

  if (!opp) return notFound()

  const progressPct = Math.max(10, Math.min(95, 100 - (opp.days / 90) * 100))

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.share) {
        await navigator.share({
          title: opp.title,
          text: opp.desc,
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
        <Link href="/opportunities" className="inline-flex items-center gap-2 text-muted-dark hover:text-amber font-bold text-xs uppercase tracking-[0.2em] transition-all group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* ── LEFT COLUMN: CONTENT ── */}
        <div className="space-y-8 animate-fade-up animate-delay-100">
          {/* Main Hero Header */}
          <div className="glass-gradient border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[80px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:rotate-3 transition-transform">
                  <CategoryIcon cat={opp.cat} size={32} className="text-amber drop-shadow-glow-amber" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber uppercase tracking-widest mb-1">{opp.org}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="badge badge-blue">{getCategoryLabel(opp.cat)}</span>
                    <span className="badge badge-gray">{opp.fund}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="btn-ghost !bg-white/5 !border-white/10 hover:!bg-white/10 px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl gap-2 active:scale-95 transition-all self-start md:self-auto"
              >
                {shared ? <Check size={16} className="text-success" /> : <Share2 size={16} />}
                {shared ? 'Copied' : 'Share'}
              </button>
            </div>

            <h1 className="font-syne text-3xl md:text-5xl font-black text-[#F0EDE6] leading-tight mb-8">
              {opp.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Location', value: opp.loc, icon: <MapPin size={16} /> },
                { label: 'Closing Date', value: opp.deadline, icon: <Calendar size={16} /> },
                { label: 'Funding', value: opp.fund, icon: <Zap size={16} /> },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 border border-white/5 rounded-2xl p-4 group/item hover:border-amber/20 transition-all">
                  <div className="flex items-center gap-2 text-muted-dark mb-2">
                    {item.icon}
                    <span className="text-[10px] uppercase font-black tracking-widest">{item.label}</span>
                  </div>
                  <p className="text-sm font-bold text-[#F0EDE6] group-hover/item:text-amber transition-colors line-clamp-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Content */}
          <div className="space-y-6">
            {[
              { id: 'about', title: 'About the Opportunity', icon: <Globe size={20} />, content: opp.about, type: 'text' },
              { id: 'elig', title: 'Eligibility Requirements', icon: <Check size={20} />, content: opp.elig, type: 'list' },
              { id: 'benefits', title: 'Benefits & Funding', icon: <Coins size={20} />, content: opp.benefits, type: 'list' },
            ].map((section) => (
              <div key={section.id} className="glass-gradient border border-white/5 rounded-[2rem] p-8 md:p-10 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center text-amber shadow-inner group-hover:scale-110 transition-transform">
                    {section.icon}
                  </div>
                  <h2 className="font-syne text-xl font-black text-[#F0EDE6]">{section.title}</h2>
                </div>
                
                {section.type === 'text' ? (
                  <p className="text-subtle text-base leading-relaxed font-medium whitespace-pre-line">
                    {section.content as string}
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(section.content as string[]).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber/10 transition-all group/li">
                        <div className="mt-1 w-5 h-5 shrink-0 rounded-full bg-success/10 flex items-center justify-center text-success group-hover/li:bg-success group-hover/li:text-bg transition-colors">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <span className="text-sm text-subtle font-medium leading-relaxed group-hover/li:text-[#F0EDE6] transition-colors">{item}</span>
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
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Application Closes In</p>
            <div className="font-syne text-7xl font-black tracking-tighter mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-500">
              {opp.days}
            </div>
            <p className="text-sm font-black uppercase tracking-widest mb-8">Days Remaining</p>
            
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
          <div className="glass-gradient border border-white/10 rounded-[2.5rem] p-8 space-y-4">
            <a 
              href={opp.applyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary w-full py-5 px-8 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow-amber hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Apply Official
              <ExternalLink size={18} className="stroke-[2.5]" />
            </a>
            <button
              onClick={() => setSaved(!saved)}
              className={`w-full py-4 px-8 text-xs font-black uppercase tracking-widest rounded-2xl border transition-all flex items-center justify-center gap-3 ${
                saved 
                  ? 'bg-danger/10 border-danger/30 text-danger shadow-inner' 
                  : 'bg-white/5 border-white/10 text-muted-dark hover:bg-white/10 hover:text-white'
              }`}
            >
              <Heart size={18} className={saved ? 'fill-current' : ''} />
              {saved ? 'Bookmarked' : 'Save for Later'}
            </button>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="glass-gradient border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-dark mb-6">Details Summary</h4>
            <div className="space-y-4">
              {Object.entries(opp.quickinfo).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start group">
                  <span className="text-xs text-muted-dark font-medium">{key}</span>
                  <span className="text-xs text-subtle font-bold text-right max-w-[140px] group-hover:text-[#F0EDE6] transition-colors">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Upsell Small */}
          <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 text-center group overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:rotate-6 transition-transform">
              <Zap size={24} className="fill-current" />
            </div>
            <h4 className="font-syne font-black text-white mb-2">Want Instant Updates?</h4>
            <p className="text-xs text-subtle font-medium mb-6">Get premium alerts for this organization and related niches.</p>
            <Link href="/pricing" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline block">
              Upgrade to Premium →
            </Link>
          </div>
        </aside>
      </div>

      {/* ── RELATED SECTION ── */}
      {related.length > 0 && (
        <section className="mt-24 pt-20 border-t border-white/5">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-title text-left mb-4">
                Similar <span>Opportunities</span>
              </h2>
              <p className="text-subtle font-medium">Opportunities you might have missed in {getCategoryLabel(opp.cat)}.</p>
            </div>
            <Link href={`/opportunities?cat=${opp.cat}`} className="text-amber font-bold text-xs uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
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
