'use client'
import Link from 'next/link'
import type { Opportunity } from '@/lib/types'
import { getCategoryLabel, getCategoryBadge, calculateDaysRemaining } from '@/lib/utils'
import { CategoryIcon, Clock, AlertCircle, ArrowUpRight } from '@/lib/icons'

interface Props {
  opp: Opportunity
}

export default function OpportunityCard({ opp }: Props) {
  // Handle dual schema (DB vs mock data)
  const days = calculateDaysRemaining(opp.deadline)
  const org = opp.organization || opp.org || 'Unknown Organization'
  const cat = opp.category || opp.cat || 'scholarship'
  const desc = opp.description || opp.desc || ''
  const fund = opp.funding_type || opp.fund || 'Various Funding'
  const isFeatured = opp.is_featured || opp.featured || false
  const isSponsored = opp.sponsored || false
  const sponsoredBy = opp.sponsoredBy || 'Partner'

  const isUrgent = days <= 7
  const isSoon = days > 7 && days <= 14

  return (
    <Link href={`/opportunities/${opp.id}`} className="group block h-full animate-fade-up">
      <div className={`card-opp h-full flex flex-col relative`} style={isFeatured ? {borderColor: 'rgba(232, 160, 32, 0.2)', boxShadow: '0 0 20px rgba(232, 160, 32, 0.05)'} : undefined}>
        {isFeatured && (
          <>
            {/* Gold left accent */}
            <div style={{
              position: 'absolute', left: 0, top: 0,
              bottom: 0, width: 3,
              background: 'linear-gradient(180deg, #E8A020, #C87020)',
              borderRadius: '16px 0 0 16px',
            }} />
            
            {/* Featured badge */}
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'linear-gradient(135deg, #E8A020, #C87020)',
              color: '#090A07', padding: '2px 9px',
              borderRadius: 100, fontSize: 9,
              fontWeight: 800, letterSpacing: '0.8px',
              fontFamily: 'var(--font-syne), sans-serif',
              zIndex: 10,
            }}>
              FEATURED
            </div>
          </>
        )}

        {/* Header Icon */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-xl icon-box flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
            <CategoryIcon cat={cat} size={22} className="text-amber drop-shadow-glow-amber" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-amber">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-syne text-lg font-extrabold text-primary leading-snug mb-2 group-hover:text-amber transition-colors line-clamp-2">
            {opp.title}
          </h3>
          <p className="text-[13px] text-muted font-medium mb-1">{org}</p>
          {isSponsored && (
            <div style={{
              fontSize: 9, color: '#555C50',
              marginTop: 2, marginBottom: 8, letterSpacing: '0.3px',
            }}>
              Promoted by {sponsoredBy}
            </div>
          )}
          <p className="text-[13px] text-subtle leading-relaxed line-clamp-2 mb-6 mt-3">
            {desc}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t flex justify-between items-center gap-4" style={{borderColor: 'var(--glass-border)'}}>
          <div className="flex gap-2 flex-wrap">
            <span className={`badge ${getCategoryBadge(cat)}`}>
              {getCategoryLabel(cat).split(' ').slice(1).join(' ') || cat}
            </span>
            <span className="badge badge-gray truncate max-w-[120px]" title={fund}>{fund}</span>
          </div>
          
          <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider shrink-0 ${
            isUrgent ? 'text-danger' : isSoon ? 'text-amber' : 'text-subtle'
          }`}>
            {days === 0 ? <AlertCircle size={14} /> : isUrgent ? <AlertCircle size={14} /> : <Clock size={14} />}
            {days === 0 ? 'Closed' : `${days}d Left`}
          </div>
        </div>
        
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{backgroundColor: 'rgba(232, 160, 32, 0.03)'}} />
      </div>
    </Link>
  )
}
