'use client'
import Link from 'next/link'
import type { Opportunity } from '@/lib/types'
import { getCategoryLabel, getCategoryBadge } from '@/lib/utils'
import { CategoryIcon, Clock, AlertCircle } from '@/lib/icons'

interface Props {
  opp: Opportunity
}

export default function OpportunityCard({ opp }: Props) {
  const isUrgent = opp.days <= 7
  const isSoon = opp.days > 7 && opp.days <= 14

  return (
    <Link href={`/opportunities/${opp.id}`} style={{ textDecoration: 'none' }}>
      <div className={`card-opp${opp.featured ? ' featured' : ''}`}>
        {/* Featured badge */}
        {opp.featured && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'linear-gradient(135deg, #F0B030, #D88030)',
              color: '#0D0F0B',
              padding: '4px 12px',
              borderRadius: 100,
              fontSize: 10,
              fontWeight: 800,
              fontFamily: 'Syne, sans-serif',
              boxShadow: '0 4px 12px rgba(232,160,32,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Featured
          </div>
        )}

        {/* Category Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(34, 40, 32, 0.8), rgba(26, 31, 21, 0.9))',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05), 0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          <CategoryIcon cat={opp.cat} size={22} style={{ color: '#E8A020', filter: 'drop-shadow(0 2px 4px rgba(232,160,32,0.3))' }} />
        </div>

        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 17,
            fontWeight: 800,
            color: '#F0EDE6',
            lineHeight: 1.3,
            paddingRight: opp.featured ? 60 : 0,
            marginBottom: 4,
            transition: 'color 0.2s ease'
          }}
          className="group-hover:text-amber"
        >
          {opp.title}
        </div>
        <div style={{ fontSize: 13, color: '#A8A89A', fontWeight: 500 }}>{opp.org}</div>

        {/* Description */}
        <p
          style={{
            fontSize: 13,
            color: '#A8A89A',
            lineHeight: 1.6,
            margin: '10px 0 14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {opp.desc}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className={`badge ${getCategoryBadge(opp.cat)}`}>
              {getCategoryLabel(opp.cat).split(' ').slice(1).join(' ') || opp.cat}
            </span>
            <span className="badge badge-gray">{opp.fund}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              color: isUrgent ? '#E05252' : isSoon ? '#E8A020' : '#6A6B62',
            }}
          >
            {isUrgent ? (
              <AlertCircle size={12} />
            ) : (
              <Clock size={12} />
            )}
            {opp.days}d left
          </div>
        </div>
      </div>
    </Link>
  )
}
