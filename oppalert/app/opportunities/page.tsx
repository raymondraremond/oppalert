'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import PremiumBanner from '@/components/PremiumBanner'
import { opportunities as seedData } from '@/lib/data'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'

const categories = [
  { slug: 'all', label: 'All Opportunities', count: '2.4k+' },
  { slug: 'scholarship', label: 'Scholarships', count: '420' },
  { slug: 'job', label: 'Remote Jobs', count: '830' },
  { slug: 'fellowship', label: 'Fellowships', count: '185' },
  { slug: 'grant', label: 'Grants', count: '240' },
  { slug: 'internship', label: 'Internships', count: '310' },
  { slug: 'startup', label: 'Startup & VC', count: '92' },
  { slug: 'bootcamp', label: '💻 Bootcamps', count: '45' },
  { slug: 'event', label: '🎪 Events', count: '38' },
]

const locations = ['All', 'Remote', 'Nigeria', 'Ghana', 'Kenya', 'International']
const deadlines = ['Any', '7 days', '30 days', '90 days']
const fundingTypes = ['All', 'Fully Funded', 'Partial', 'Paid', 'Equity']

export default function OpportunitiesPage() {
  const [activeCat, setActiveCat] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [fundingFilter, setFundingFilter] = useState('all')
  const [deadlineFilter, setDeadlineFilter] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [displayCount, setDisplayCount] = useState(12)

  // CRITICAL: Filter seed data synchronously — never empty, never loading
  const getFiltered = () => {
    let filtered = [...seedData]

    // Category filter
    if (activeCat !== 'all') {
      filtered = filtered.filter(o => o.cat === activeCat)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(o =>
        o.title.toLowerCase().includes(q) ||
        (o.org || '').toLowerCase().includes(q) ||
        (o.desc || '').toLowerCase().includes(q)
      )
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(o =>
        (o.loc || '').toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    // Funding filter
    if (fundingFilter !== 'all') {
      filtered = filtered.filter(o =>
        (o.fund || '').toLowerCase().includes(fundingFilter.toLowerCase())
      )
    }

    // Deadline filter
    if (deadlineFilter === '7') {
      filtered = filtered.filter(o => (o.days || 30) <= 7)
    } else if (deadlineFilter === '30') {
      filtered = filtered.filter(o => (o.days || 30) <= 30)
    } else if (deadlineFilter === '90') {
      filtered = filtered.filter(o => (o.days || 30) <= 90)
    }

    // Sort
    if (sortBy === 'deadline') {
      filtered.sort((a, b) => (a.days || 30) - (b.days || 30))
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return filtered
  }

  const [opps, setOpps] = useState(getFiltered())

  // Update when filters change + try DB in background
  useEffect(() => {
    setOpps(getFiltered())
    setDisplayCount(12)

    // Try DB in background silently
    const cat = activeCat !== 'all' ? '?cat=' + activeCat : ''
    fetch('/api/opportunities' + cat)
      .then(r => r.json())
      .then(res => {
        if (res?.data?.length > 0) {
          const dbOpps = res.data;
          // Keep seed bootcamps/events so they always appear even if DB lacks them
          const seedOppsToKeep = getFiltered().filter(s => 
            ['bootcamp', 'event'].includes(s.cat) && 
            !dbOpps.some((dbItem: any) => dbItem.title === s.title)
          );
          
          let merged = [...dbOpps, ...seedOppsToKeep];
          
          if (sortBy === 'deadline') {
            merged.sort((a, b) => (a.days || 30) - (b.days || 30));
          } else if (sortBy === 'popular') {
            merged.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          }
          setOpps(merged);
        }
      })
      .catch(() => {})
  }, [activeCat, searchQuery, locationFilter, fundingFilter, deadlineFilter, sortBy])

  const clearFilters = () => {
    setActiveCat('all')
    setSearchQuery('')
    setLocationFilter('all')
    setFundingFilter('all')
    setDeadlineFilter('all')
    setSortBy('latest')
  }

  const hasFilters = activeCat !== 'all' || locationFilter !== 'all' || fundingFilter !== 'all' || deadlineFilter !== 'all' || searchQuery.trim()

  const displayedOpps = opps.slice(0, displayCount)

  const filterSidebar = (
    <div className="space-y-8 animate-fade-up">
      {/* Search Input */}
      <div>
        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted block mb-3">
          Keyword Search
        </label>
        <div className="relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-amber transition-colors" />
          <input
            type="text"
            placeholder="Scholarships, jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-xl py-3 pl-11 pr-4 text-primary text-sm focus:outline-none transition-all font-medium"
            style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)'}}
          />
        </div>
      </div>

      {/* Category List */}
      <div>
        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted block mb-4">
          Categories
        </label>
        <div className="space-y-1">
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActiveCat(c.slug)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group ${
                activeCat === c.slug
                  ? 'bg-amber/10 text-amber font-bold border border-amber/20'
                  : 'text-subtle hover:bg-[var(--input-bg)] hover:text-primary'
              }`}
            >
              <span className="text-sm">{c.label}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeCat === c.slug ? 'bg-amber/20 text-amber' : 'bg-[var(--icon-bg)] text-muted'
              }`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted block mb-3">
          Location
        </label>
        <div className="relative">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full appearance-none border rounded-xl py-3 px-4 text-primary text-sm focus:outline-none transition-all font-medium cursor-pointer"
            style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)'}}
          >
            {locations.map((loc) => (
              <option key={loc} value={loc === 'All' ? 'all' : loc} className="bg-bg text-primary">{loc}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
        </div>
      </div>

      {/* Deadline Filter */}
      <div>
        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted block mb-3">
          Deadline
        </label>
        <div className="relative">
          <select
            value={deadlineFilter}
            onChange={(e) => setDeadlineFilter(e.target.value)}
            className="w-full appearance-none border rounded-xl py-3 px-4 text-primary text-sm focus:outline-none transition-all font-medium cursor-pointer"
            style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)'}}
          >
            <option value="all" className="bg-bg text-primary">Any Deadline</option>
            <option value="7" className="bg-bg text-primary">Within 7 days</option>
            <option value="30" className="bg-bg text-primary">Within 30 days</option>
            <option value="90" className="bg-bg text-primary">Within 90 days</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
        </div>
      </div>

      {/* Funding Filter */}
      <div>
        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted block mb-3">
          Funding
        </label>
        <div className="relative">
          <select
            value={fundingFilter}
            onChange={(e) => setFundingFilter(e.target.value)}
            className="w-full appearance-none border rounded-xl py-3 px-4 text-primary text-sm focus:outline-none transition-all font-medium cursor-pointer"
            style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)'}}
          >
            {fundingTypes.map((ft) => (
              <option key={ft} value={ft === 'All' ? 'all' : ft.toLowerCase()} className="bg-bg text-primary">{ft}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
        </div>
      </div>

      {hasFilters && (
        <button
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border hover:text-danger text-muted text-xs font-bold uppercase tracking-widest transition-all"
          style={{borderColor: 'var(--glass-border)'}}
          onClick={clearFilters}
        >
          <X size={14} />
          Clear All
        </button>
      )}
    </div>
  )

  return (
    <main className="min-h-screen pt-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 pb-20">
        {/* ── SIDEBAR (Desktop) ── */}
        <aside className="hidden lg:block sticky top-28 self-start h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-hide">
          {filterSidebar}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <section className="space-y-8 animate-fade-up animate-delay-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b" style={{borderColor: 'var(--border)'}}>
            <div>
              <h1 className="font-syne text-3xl font-black text-primary mb-1">
                Browse <span className="text-amber">Opportunities</span>
              </h1>
              <p className="text-sm text-subtle font-medium">
                {opps.length} results found
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile filter toggle */}
              <button
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold text-primary transition-all"
                style={{backgroundColor: 'var(--icon-bg)', borderColor: 'var(--glass-border)'}}
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border rounded-xl py-2.5 pl-4 pr-10 text-primary text-sm focus:outline-none transition-all font-bold cursor-pointer"
                  style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)'}}
                >
                  <option value="latest" className="bg-bg">Latest First</option>
                  <option value="deadline" className="bg-bg">Deadline Soon</option>
                  <option value="popular" className="bg-bg">Most Popular</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle pointer-events-none group-focus-within:rotate-180 transition-transform" />
              </div>
            </div>
          </div>

          {/* Mobile filters panel */}
          {showMobileFilters && (
            <div className="lg:hidden glass-gradient border rounded-2xl p-6 shadow-premium" style={{borderColor: 'var(--border)'}}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-syne font-bold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-subtle hover:text-primary">
                  <X size={20} />
                </button>
              </div>
              {filterSidebar}
            </div>
          )}

          <PremiumBanner />

          {/* Opportunities Grid */}
          <div className="relative min-h-[400px]">
            {displayedOpps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedOpps.map((opp: any) => (
                  <OpportunityCard key={opp.id} opp={opp} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center glass-gradient border rounded-[3rem]" style={{borderColor: 'var(--border)'}}>
                <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 rotate-12" style={{backgroundColor: 'var(--icon-bg)'}}>
                  <Search size={48} className="text-muted -rotate-12" />
                </div>
                <h3 className="font-syne text-2xl font-black text-primary mb-4">No Matches Found</h3>
                <p className="text-subtle max-w-sm mb-10 font-medium">
                  We could not find any opportunities matching your current filters. Try broadening your search.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary px-10 py-4 rounded-2xl shadow-glow-amber font-black uppercase tracking-widest text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Load More */}
          {displayCount < opps.length && (
            <div className="pt-8 text-center">
              <button
                onClick={() => setDisplayCount(prev => prev + 12)}
                className="btn-ghost px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Load More ({opps.length - displayCount} remaining)
              </button>
            </div>
          )}

          {displayedOpps.length > 0 && (
            <div className="pt-4 text-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-muted hover:text-amber font-bold text-xs uppercase tracking-[0.2em] transition-all group"
              >
                Back to Top
                <ChevronDown size={14} className="group-hover:-translate-y-1 rotate-180 transition-transform" />
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
