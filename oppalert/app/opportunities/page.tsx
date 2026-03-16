import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import PremiumBanner from '@/components/PremiumBanner'
import { opportunities } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Opportunities | OppAlert',
  description: 'Search scholarships, remote jobs, fellowships, grants and more for Africa.',
}

const categories = [
  { slug: 'all', label: 'All', count: '2,408' },
  { slug: 'scholarship', label: '🎓 Scholarships', count: '420' },
  { slug: 'job', label: '💼 Remote Jobs', count: '830' },
  { slug: 'fellowship', label: '🌍 Fellowships', count: '185' },
  { slug: 'grant', label: '💰 Grants', count: '240' },
  { slug: 'internship', label: '🔬 Internships', count: '310' },
  { slug: 'startup', label: '🚀 Startup Funding', count: '92' },
]

const locations = ['All Locations', 'Remote / Online', 'Nigeria', 'Ghana', 'Kenya', 'International']
const deadlines = ['Any deadline', 'Closing in 7 days', 'Within 30 days', 'Within 3 months']
const fundingTypes = ['All Types', 'Fully Funded', 'Partial Funding', 'Paid Position', 'Equity / Funding']

export default function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { cat?: string; loc?: string }
}) {
  const activeCat = searchParams.cat || 'all'
  const filtered =
    activeCat === 'all' ? opportunities : opportunities.filter((o) => o.cat === activeCat)

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: 24,
        minHeight: 'calc(100vh - 60px)',
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          padding: '24px 0',
          position: 'sticky',
          top: 60,
          height: 'calc(100vh - 60px)',
          overflowY: 'auto',
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input className="input" placeholder="Search opportunities..." />
        </div>

        {/* Category */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: '#6A6B62',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}
          >
            Category
          </div>
          {categories.map((c) => (
            <Link key={c.slug} href={`/opportunities?cat=${c.slug}`} style={{ textDecoration: 'none' }}>
              <div className={`filter-item${activeCat === c.slug ? ' active' : ''}`}>
                <span>{c.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    background: '#2A3028',
                    padding: '1px 6px',
                    borderRadius: 100,
                    color: '#A8A89A',
                  }}
                >
                  {c.count}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Location */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: '#6A6B62',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}
          >
            Location
          </div>
          {locations.map((l, i) => (
            <div key={l} className={`filter-item${i === 0 ? ' active' : ''}`}>
              {l}
            </div>
          ))}
        </div>

        {/* Deadline */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: '#6A6B62',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}
          >
            Deadline
          </div>
          {deadlines.map((d, i) => (
            <div key={d} className={`filter-item${i === 0 ? ' active' : ''}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Funding */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: '#6A6B62',
              marginBottom: 10,
              textTransform: 'uppercase',
            }}
          >
            Funding Type
          </div>
          {fundingTypes.map((f, i) => (
            <div key={f} className={`filter-item${i === 0 ? ' active' : ''}`}>
              {f}
            </div>
          ))}
        </div>

        <Link href="/opportunities">
          <button className="btn-ghost" style={{ width: '100%', fontSize: 12, padding: '7px' }}>
            Clear all filters
          </button>
        </Link>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: '24px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700 }}>
            All Opportunities{' '}
            <span style={{ fontSize: 13, color: '#6A6B62', fontWeight: 400 }}>
              ({filtered.length} results)
            </span>
          </h1>
          <select
            className="input"
            style={{ width: 'auto', padding: '7px 12px', fontSize: 12 }}
          >
            <option>Latest first</option>
            <option>Deadline soon</option>
            <option>Most popular</option>
          </select>
        </div>

        <PremiumBanner />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="btn-ghost" style={{ padding: '10px 24px', fontSize: 14 }}>
            Load More Opportunities
          </button>
        </div>
      </div>
    </div>
  )
}
