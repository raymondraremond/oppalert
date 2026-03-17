'use client'
import Link from 'next/link'
import type { Opportunity } from '@/lib/types'
import { getCategoryLabel, getCategoryBadge } from '@/lib/utils'
import { CategoryIcon, Clock, AlertCircle, ArrowUpRight } from '@/lib/icons'

interface Props {
  opp: Opportunity
}

export default function OpportunityCard({ opp }: Props) {
  // Handle dual schema (DB vs mock data)
  const days = opp.days_remaining ?? opp.days ?? 30
  const org = opp.organization || opp.org || 'Unknown Organization'
  const cat = opp.category || opp.cat || 'scholarship'
  const desc = opp.description || opp.desc || ''
  const fund = opp.funding_type || opp.fund || 'Various Funding'
  const isFeatured = opp.is_featured || opp.featured || false

  const isUrgent = days <= 7
  const isSoon = days > 7 && days <= 14

  return (
    <Link href={`/opportunities/${opp.id}`} className="group block h-full animate-fade-up">
      <div className={`card-opp h-full flex flex-col ${isFeatured ? 'border-amber/20 ring-1 ring-amber/5' : ''}`}>
        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-amber-gradient text-bg text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-glow-amber">
              Featured
            </div>
          </div>
        )}

        {/* Header Icon */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
            <CategoryIcon cat={cat} size={22} className="text-amber drop-shadow-glow-amber" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-amber">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-syne text-lg font-extrabold text-[#F0EDE6] leading-snug mb-2 group-hover:text-amber transition-colors line-clamp-2">
            {opp.title}
          </h3>
          <p className="text-[13px] text-muted font-medium mb-4">{org}</p>
          <p className="text-[13px] text-subtle leading-relaxed line-clamp-2 mb-6">
            {desc}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            <span className={`badge ${getCategoryBadge(cat)}`}>
              {getCategoryLabel(cat).split(' ').slice(1).join(' ') || cat}
            </span>
            <span className="badge badge-gray truncate max-w-[120px]" title={fund}>{fund}</span>
          </div>
          
          <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider shrink-0 ${
            isUrgent ? 'text-danger' : isSoon ? 'text-amber' : 'text-subtle'
          }`}>
            {isUrgent ? <AlertCircle size={14} /> : <Clock size={14} />}
            {days}d Left
          </div>
        </div>
        
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </Link>
  )
}
