'use client'
import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { opportunityService } from '@/lib/services/opportunity-service'
import { Opportunity } from '@/lib/types'
import OpportunityCard from '@/components/OpportunityCard'
import { getCategoryLabel } from '@/lib/utils'
import { CategoryIcon, MapPin, Calendar, Share2, Heart, Zap, ArrowRight, Check, Copy, ExternalLink, Loader2 } from '@/lib/icons'

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
          // For related, we search by category if possible
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <Loader2 className="animate-spin text-amber" size={48} />
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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 16 }}>
        <Link href="/opportunities" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 13, color: '#6A6B62', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color 0.15s' }}>
            ← Back to opportunities
          </span>
        </Link>
      </div>

      {/* ── HERO CARD ── */}
      <div
        className="animate-fade-up"
        style={{
          background: 'linear-gradient(145deg, #171A13, #141710)',
          border: '1px solid #2E3530',
          borderRadius: 20,
          padding: '2rem',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div
            style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #222820, #1A1F15)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #2E3530',
              flexShrink: 0,
            }}
          >
            <CategoryIcon cat={opp.cat} size={28} style={{ color: '#E8A020' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#6A6B62', marginBottom: 6 }}>{opp.org}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{getCategoryLabel(opp.cat)}</span>
              <span className="badge badge-gray">{opp.fund}</span>
              {opp.featured && <span className="badge badge-amber">Featured</span>}
            </div>
          </div>
          <button
            className="btn-ghost"
            style={{ padding: '7px 14px', fontSize: 13, gap: 6 }}
            onClick={handleShare}
          >
            {shared ? <Check size={14} /> : <Share2 size={14} />}
            {shared ? 'Copied!' : 'Share'}
          </button>
        </div>

        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          {opp.title}
        </h1>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { icon: <MapPin size={13} />, text: opp.loc },
            { icon: <Calendar size={13} />, text: `Deadline: ${opp.deadline}` },
            { icon: null, text: opp.fund },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#222820',
                border: '1px solid #2E3530',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                color: '#A8A89A',
              }}
            >
              {m.icon}
              {m.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div
        className="detail-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: 24,
        }}
      >
        {/* Content */}
        <div>
          {[
            { title: 'About this Opportunity', content: opp.about, type: 'text' as const },
            { title: 'Eligibility Requirements', content: opp.elig, type: 'list' as const },
            { title: 'Benefits & Compensation', content: opp.benefits, type: 'list' as const },
          ].map((section) => (
            <div
              key={section.title}
              style={{
                background: 'linear-gradient(145deg, #171A13, #141710)',
                border: '1px solid #2E3530',
                borderRadius: 14,
                padding: '1.5rem',
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {section.title}
              </h3>
              {section.type === 'text' ? (
                <p style={{ fontSize: 14, color: '#A8A89A', lineHeight: 1.8 }}>
                  {section.content as string}
                </p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {(section.content as string[]).map((item) => (
                    <li
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontSize: 14,
                        color: '#A8A89A',
                        padding: '6px 0',
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 18,
                          height: 18,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(232,160,32,0.12)',
                          marginTop: 2,
                        }}
                      >
                        <Check size={10} style={{ color: '#E8A020' }} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div>
          {/* Countdown */}
          <div
            style={{
              background: 'linear-gradient(135deg, #3D2E0A, #1A1208)',
              border: '1px solid #4A3510',
              borderRadius: 14,
              padding: '1.5rem',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#6A6B62',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Application closes in
            </div>
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 52,
                fontWeight: 800,
                color: '#E8A020',
                lineHeight: 1,
                textShadow: '0 0 30px rgba(232,160,32,0.2)',
              }}
            >
              {opp.days}
            </div>
            <div style={{ fontSize: 14, color: '#A8A89A', marginTop: 4 }}>days remaining</div>
            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  height: 4,
                  background: '#222820',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #E8A020, #C87020)',
                    borderRadius: 2,
                    width: `${progressPct}%`,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: '#6A6B62', marginTop: 6 }}>
                Deadline: {opp.deadline}
              </div>
            </div>
          </div>

          {/* Apply */}
          <div
            style={{
              background: 'linear-gradient(145deg, #171A13, #141710)',
              border: '1px solid #2E3530',
              borderRadius: 14,
              padding: '1.25rem',
              marginBottom: 16,
            }}
          >
            <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer">
              <button
                className="btn-primary"
                style={{ width: '100%', padding: 13, fontSize: 14, fontWeight: 700, gap: 6 }}
              >
                Apply Now
                <ExternalLink size={14} />
              </button>
            </a>
            <button
              className={saved ? 'btn-primary' : 'btn-ghost'}
              style={{
                width: '100%',
                marginTop: 8,
                padding: '10px',
                fontSize: 13,
                gap: 6,
              }}
              onClick={() => setSaved(!saved)}
            >
              <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved!' : 'Save for Later'}
            </button>
          </div>

          {/* Quick Info */}
          <div
            style={{
              background: 'linear-gradient(145deg, #171A13, #141710)',
              border: '1px solid #2E3530',
              borderRadius: 14,
              padding: '1.25rem',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#6A6B62',
                marginBottom: 12,
              }}
            >
              Quick Info
            </div>
            {Object.entries(opp.quickinfo).map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #1A1F15',
                  fontSize: 12,
                }}
              >
                <span style={{ color: '#6A6B62' }}>{k}</span>
                <span style={{ fontWeight: 500, maxWidth: 130, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Premium upsell */}
          <div
            style={{
              background: 'linear-gradient(135deg, #3D2E0A, #2A1A06)',
              border: '1px solid #4A3510',
              borderRadius: 14,
              padding: '1.25rem',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E8A020', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={14} />
              Premium Alert
            </div>
            <div style={{ fontSize: 12, color: '#A8A89A', lineHeight: 1.6, marginBottom: 12 }}>
              Get alerts for similar opportunities the moment they're posted.
            </div>
            <Link href="/pricing">
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '9px', fontSize: 12, gap: 4 }}
              >
                Upgrade to Premium
                <ArrowRight size={12} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── RELATED OPPORTUNITIES ── */}
      {related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 className="section-title" style={{ marginBottom: 20 }}>
            Similar <span>Opportunities</span>
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {related.map((r) => (
              <OpportunityCard key={r.id} opp={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
