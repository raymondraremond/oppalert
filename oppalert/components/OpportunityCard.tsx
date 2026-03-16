import Link from 'next/link'
import type { Opportunity } from '@/lib/types'
import { getCategoryLabel } from '@/lib/utils'

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
              padding: '2px 9px',
              borderRadius: 100,
              fontSize: 10,
              fontWeight: 700,
              fontFamily: 'Syne, sans-serif',
            }}
          >
            Featured
          </div>
        )}

        {/* Logo + title */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: '#222820',
            border: '1px solid #2E3530',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            marginBottom: 12,
          }}
        >
          {opp.icon}
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
            <span className="badge badge-blue">{getCategoryLabel(opp.cat).split(' ').slice(1).join(' ') || opp.cat}</span>
            <span className="badge badge-gray">{opp.fund}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: isUrgent ? '#E05252' : isSoon ? '#E8A020' : '#6A6B62',
            }}
          >
            {isUrgent ? '🔴' : '⏰'} {opp.days}d left
          </div>
        </div>
      </div>
    </Link>
  )
}
