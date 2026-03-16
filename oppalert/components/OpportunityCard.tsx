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
              background: 'linear-gradient(135deg, #E8A020, #C87020)',
              color: '#0D0F0B',
              padding: '3px 10px',
              borderRadius: 100,
              fontSize: 10,
              fontWeight: 700,
              fontFamily: 'Syne, sans-serif',
              boxShadow: '0 2px 8px rgba(232,160,32,0.25)',
            }}
          >
            Featured
          </div>
        )}

        {/* Category Icon + title */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #222820, #1A1F15)',
            border: '1px solid #2E3530',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <CategoryIcon cat={opp.cat} size={20} style={{ color: '#E8A020' }} />
        </div>

        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            color: '#F0EDE6',
            lineHeight: 1.3,
            paddingRight: opp.featured ? 60 : 0,
          }}
        >
          {opp.title}
        </div>
        <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 3 }}>{opp.org}</div>

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
