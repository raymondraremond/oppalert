'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import OpportunityCardSkeleton from '@/components/OpportunityCardSkeleton'
import PremiumBanner from '@/components/PremiumBanner'
import { opportunityService } from '@/lib/services/opportunity-service'
import { Opportunity } from '@/lib/types'
import { Search, SlidersHorizontal, X, Loader2, ChevronDown } from 'lucide-react'

const categories = [
  { slug: 'all', label: 'All Opportunities', count: '2.4k+' },
  { slug: 'scholarship', label: 'Scholarships', count: '420' },
  { slug: 'job', label: 'Remote Jobs', count: '830' },
  { slug: 'fellowship', label: 'Fellowships', count: '185' },
  { slug: 'grant', label: 'Grants', count: '240' },
  { slug: 'internship', label: 'Internships', count: '310' },
  { slug: 'startup', label: 'Startup & VC', count: '92' },
]

const locations = ['Any Location', 'Remote', 'Africa (Across)', 'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'International']
const deadlines = ['Any Deadline', 'Closing Soon (< 7d)', 'This Month', 'Next 3 Months']
const fundingTypes = ['Any Funding', 'Fully Funded', 'Partial Funding', 'Paid Position', 'Financial Grant']

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

    // Always push closed (days=0) to the bottom
    result.sort((a, b) => {
      const aDays = a.days ?? 999
      const bDays = b.days ?? 999
      const aClosed = aDays === 0 ? 1 : 0
      const bClosed = bDays === 0 ? 1 : 0
      if (aClosed !== bClosed) return aClosed - bClosed

      // Then apply user sorting
      if (sortBy === 'deadline') return aDays - bDays
      if (sortBy === 'popular') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      return 0
    })

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

      {/* Filter Selects */}
      <div className="space-y-4">
        {[
          { label: 'Location', options: locations, state: activeLoc, setter: setActiveLoc },
          { label: 'Deadline', options: deadlines, state: activeDeadline, setter: setActiveDeadline },
          { label: 'Funding', options: fundingTypes, state: activeFunding, setter: setActiveFunding },
        ].map((filter) => (
          <div key={filter.label}>
            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted block mb-3">
              {filter.label}
            </label>
            <div className="relative">
              <select
                value={filter.state}
                onChange={(e) => filter.setter(parseInt(e.target.value))}
                className="w-full appearance-none border rounded-xl py-3 px-4 text-primary text-sm focus:outline-none transition-all font-medium cursor-pointer"
                style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--glass-border)'}}
              >
                {filter.options.map((opt, idx) => (
                  <option key={opt} value={idx} className="bg-bg text-primary">{opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
            </div>
          </div>
        ))}
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
                {isLoading ? 'Searching...' : `Found ${filtered.length} verified listings`}
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
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <OpportunityCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((opp) => (
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
                  We couldn&apos;t find any opportunities matching your current filters. Try broadening your search.
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

          {filtered.length > 0 && (
            <div className="pt-12 text-center">
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
