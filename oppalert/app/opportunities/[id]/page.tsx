import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getOpportunity, getRelated } from '@/lib/data'
import OpportunityCard from '@/components/OpportunityCard'
import { getCategoryLabel } from '@/lib/utils'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const opp = getOpportunity(params.id)
  if (!opp) return {}

  return {
    title: `${opp.title} — ${opp.org} | OppAlert`,
    description: opp.desc,
    openGraph: {
      title: `${opp.title} | OppAlert`,
      description: opp.desc,
      type: 'article',
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': opp.cat === 'job' ? 'JobPosting' : 'EducationalOccupationalProgram',
        name: opp.title,
        description: opp.desc,
        hiringOrganization: { '@type': 'Organization', name: opp.org },
        applicationDeadline: opp.deadline,
        jobLocation: { '@type': 'Place', name: opp.loc },
        employmentType: opp.fund,
      }),
    },
  }
}

export default function OpportunityDetailPage({ params }: Props) {
  const opp = getOpportunity(params.id)
  if (!opp) notFound()

  const related = getRelated(params.id, opp.cat)
  const progressPct = Math.max(10, Math.min(95, 100 - (opp.days / 90) * 100))

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 16 }}>
        <Link href="/opportunities" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 13, color: '#6A6B62', cursor: 'pointer' }}>
            ← Back to opportunities
          </span>
        </Link>
      </div>

      {/* ── HERO CARD ── */}
      <div
        style={{
          background: '#141710',
          border: '1px solid #2E3530',
          borderRadius: 16,
          padding: '2rem',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div
            style={{
              width: 60,
              height: 60,
              background: '#222820',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              border: '1px solid #2E3530',
              flexShrink: 0,
            }}
          >
            {opp.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#6A6B62', marginBottom: 6 }}>{opp.org}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-blue">{getCategoryLabel(opp.cat)}</span>
              <span className="badge badge-gray">{opp.fund}</span>
              {opp.featured && <span className="badge badge-amber">Featured</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }}>
              Share
            </button>
          </div>
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
            `📍 ${opp.loc}`,
            `📅 Deadline: ${opp.deadline}`,
            opp.fund,
          ].map((m) => (
            <div
              key={m}
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
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div
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
                background: '#141710',
                border: '1px solid #2E3530',
                borderRadius: 12,
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
                        gap: 8,
                        fontSize: 14,
                        color: '#A8A89A',
                        padding: '5px 0',
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ color: '#E8A020', fontWeight: 700, marginTop: 2 }}>›</span>
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
              borderRadius: 12,
              padding: '1.25rem',
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
                    background: '#E8A020',
                    borderRadius: 2,
                    width: `${progressPct}%`,
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
              background: '#141710',
              border: '1px solid #2E3530',
              borderRadius: 12,
              padding: '1.25rem',
              marginBottom: 16,
            }}
          >
            <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer">
              <button
                className="btn-primary"
                style={{ width: '100%', padding: 12, fontSize: 14, fontWeight: 700 }}
              >
                Apply Now →
              </button>
            </a>
            <button
              className="btn-ghost"
              style={{ width: '100%', marginTop: 8, padding: '9px', fontSize: 13 }}
            >
              ♡ Save for Later
            </button>
          </div>

          {/* Quick Info */}
          <div
            style={{
              background: '#141710',
              border: '1px solid #2E3530',
              borderRadius: 12,
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
                  padding: '7px 0',
                  borderBottom: '1px solid #2E3530',
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
              background: '#3D2E0A',
              border: '1px solid #4A3510',
              borderRadius: 12,
              padding: '1.25rem',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E8A020', marginBottom: 6 }}>
              ⚡ Premium Alert
            </div>
            <div style={{ fontSize: 12, color: '#A8A89A', lineHeight: 1.6, marginBottom: 12 }}>
              Get alerts for similar opportunities the moment they're posted.
            </div>
            <Link href="/pricing">
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '8px', fontSize: 12 }}
              >
                Upgrade to Premium
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
