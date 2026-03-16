import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import PremiumBanner from '@/components/PremiumBanner'
import { opportunityService } from '@/lib/services/opportunity-service'
import { Opportunity } from '@/lib/types'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'

const categories = [
  { slug: 'all', label: 'All', count: '2,408' },
  { slug: 'scholarship', label: 'Scholarships', count: '420' },
  { slug: 'job', label: 'Remote Jobs', count: '830' },
  { slug: 'fellowship', label: 'Fellowships', count: '185' },
  { slug: 'grant', label: 'Grants', count: '240' },
  { slug: 'internship', label: 'Internships', count: '310' },
  { slug: 'startup', label: 'Startup Funding', count: '92' },
]

const locations = ['All Locations', 'Remote / Online', 'Nigeria', 'Ghana', 'Kenya', 'International']
const deadlines = ['Any deadline', 'Closing in 7 days', 'Within 30 days', 'Within 3 months']
const fundingTypes = ['All Types', 'Fully Funded', 'Partial Funding', 'Paid Position', 'Equity / Funding']

export default function OpportunitiesPage() {
  const [activeCat, setActiveCat] = useState('all')
  const [activeLoc, setActiveLoc] = useState(0)
  const [activeDeadline, setActiveDeadline] = useState(0)
  const [activeFunding, setActiveFunding] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOpps = async () => {
      setIsLoading(true)
      try {
        const results = await opportunityService.searchAll({
          category: activeCat === 'all' ? undefined : activeCat as any,
          keyword: searchQuery,
          location: activeLoc > 0 ? locations[activeLoc] : undefined
        })
        setAllOpportunities(results)
      } catch (err) {
        console.error('Failed to fetch opportunities:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Debounce search
    const timer = setTimeout(fetchOpps, 500)
    return () => clearTimeout(timer)
  }, [activeCat, searchQuery, activeLoc])

  const filtered = useMemo(() => {
    let result = [...allOpportunities]

    // Deadline filter
    if (activeDeadline === 1) result = result.filter((o) => o.days <= 7)
    else if (activeDeadline === 2) result = result.filter((o) => o.days <= 30)
    else if (activeDeadline === 3) result = result.filter((o) => o.days <= 90)

    // Funding filter
    if (activeFunding > 0) {
      const fundName = fundingTypes[activeFunding]
      result = result.filter((o) => o.fund === fundName)
    }

    // Sorting
    if (sortBy === 'deadline') result = [...result].sort((a, b) => a.days - b.days)
    else if (sortBy === 'popular') result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

    return result
  }, [allOpportunities, activeDeadline, activeFunding, sortBy])

  const clearFilters = () => {
    setActiveCat('all')
    setActiveLoc(0)
    setActiveDeadline(0)
    setActiveFunding(0)
    setSearchQuery('')
    setSortBy('latest')
  }

  const hasFilters = activeCat !== 'all' || activeLoc > 0 || activeDeadline > 0 || activeFunding > 0 || searchQuery.trim()

  const filterSidebar = (
    <>
      {/* Search */}
      <div style={{ marginBottom: 20, position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6A6B62' }} />
        <input
          className="input"
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: 36 }}
        />
      </div>

      {/* Category */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#6A6B62', marginBottom: 10, textTransform: 'uppercase' }}>
          Category
        </div>
        {categories.map((c) => (
          <div
            key={c.slug}
            className={`filter-item${activeCat === c.slug ? ' active' : ''}`}
            onClick={() => setActiveCat(c.slug)}
          >
            <span>{c.label}</span>
            <span style={{ fontSize: 11, background: activeCat === c.slug ? 'rgba(232,160,32,0.15)' : '#2A3028', padding: '1px 6px', borderRadius: 100, color: activeCat === c.slug ? '#E8A020' : '#A8A89A' }}>
              {c.count}
            </span>
          </div>
        ))}
      </div>

      {/* Location */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#6A6B62', marginBottom: 10, textTransform: 'uppercase' }}>
          Location
        </div>
        {locations.map((l, i) => (
          <div key={l} className={`filter-item${activeLoc === i ? ' active' : ''}`} onClick={() => setActiveLoc(i)}>
            {l}
          </div>
        ))}
      </div>

      {/* Deadline */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#6A6B62', marginBottom: 10, textTransform: 'uppercase' }}>
          Deadline
        </div>
        {deadlines.map((d, i) => (
          <div key={d} className={`filter-item${activeDeadline === i ? ' active' : ''}`} onClick={() => setActiveDeadline(i)}>
            {d}
          </div>
        ))}
      </div>

      {/* Funding */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#6A6B62', marginBottom: 10, textTransform: 'uppercase' }}>
          Funding Type
        </div>
        {fundingTypes.map((f, i) => (
          <div key={f} className={`filter-item${activeFunding === i ? ' active' : ''}`} onClick={() => setActiveFunding(i)}>
            {f}
          </div>
        ))}
      </div>

      {hasFilters && (
        <button className="btn-ghost" style={{ width: '100%', fontSize: 12, padding: '7px', gap: 6 }} onClick={clearFilters}>
          <X size={13} />
          Clear all filters
        </button>
      )}
    </>
  )

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: 24,
        minHeight: 'calc(100vh - 70px)',
      }}
      className="opps-layout"
    >
      {/* ── SIDEBAR (Desktop) ── */}
      <aside
        className="sidebar-desktop"
        style={{
          padding: '24px 0',
          position: 'sticky',
          top: 70,
          height: 'calc(100vh - 70px)',
          overflowY: 'auto',
        }}
      >
        {filterSidebar}
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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Mobile filter toggle */}
            <button
              className="btn-ghost mobile-filters"
              style={{ padding: '7px 12px', fontSize: 12, gap: 6 }}
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <select
              className="input"
              style={{ width: 'auto', padding: '7px 12px', fontSize: 12 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest first</option>
              <option value="deadline">Deadline soon</option>
              <option value="popular">Most popular</option>
            </select>
          </div>
        </div>

        {/* Mobile filters panel */}
        {showMobileFilters && (
          <div
            className="mobile-filters animate-fade-up"
            style={{
              background: '#141710',
              border: '1px solid #2E3530',
              borderRadius: 12,
              padding: '1rem',
              marginBottom: 16,
            }}
          >
            {filterSidebar}
          </div>
        )}

        <PremiumBanner />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
            minHeight: '400px',
            position: 'relative'
          }}
        >
          {isLoading ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 className="animate-spin text-amber" size={48} />
            </div>
          ) : (
            filtered.map((opp: Opportunity) => (
              <OpportunityCard key={opp.id} opp={opp} />
            ))
          )}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              <Search size={48} style={{ color: '#3A4238', margin: '0 auto' }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No opportunities found</div>
            <p style={{ fontSize: 14, color: '#6A6B62', marginBottom: 20 }}>
              Try adjusting your filters or search query.
            </p>
            <button className="btn-ghost" style={{ padding: '10px 24px', fontSize: 14 }} onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn-ghost" style={{ padding: '10px 24px', fontSize: 14 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to Top
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
