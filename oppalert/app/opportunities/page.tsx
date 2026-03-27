'use client'
import { useState, useEffect } from 'react'
import { opportunities as seedData } from '@/lib/data'
import OpportunityCard from '@/components/OpportunityCard'
import ScrollReveal from '@/components/ScrollReveal'
import { Search, Filter, SlidersHorizontal, LayoutGrid, List, ArrowDownWideNarrow } from 'lucide-react'

export default function OpportunitiesPage() {
  const [activeCat, setActiveCat] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const getFiltered = (cat: string, q: string) => {
    let filtered = cat === 'all' 
      ? seedData 
      : seedData.filter(o => (o.cat || o.category) === cat)
    
    if (q) {
      filtered = filtered.filter(o => 
        o.title.toLowerCase().includes(q.toLowerCase()) || 
        (o.org || o.organization || '').toLowerCase().includes(q.toLowerCase())
      )
    }
    return filtered
  }
  
  const [opps, setOpps] = useState<any[]>(getFiltered('all', ''))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const filtered = getFiltered(activeCat, searchQuery)
    setOpps(filtered)
    
    setLoading(true)
    const url = new URL('/api/opportunities', window.location.origin)
    if (activeCat !== 'all') url.searchParams.append('cat', activeCat)
    if (searchQuery) url.searchParams.append('q', searchQuery)

    fetch(url.toString())
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.data || [])
        if (items.length > 0) {
          // Merge or replace depending on your preference. 
          // For a redesign, we'll replace to ensure fresh data.
          setOpps(items)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeCat, searchQuery])

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'job', label: 'Remote Jobs' },
    { id: 'fellowship', label: 'Fellowships' },
    { id: 'grant', label: 'Grants' },
    { id: 'internship', label: 'Internships' },
    { id: 'startup', label: 'Startup Funding' },
  ]

  return (
    <main className="min-h-screen bg-bg">
      {/* Search-First Header */}
      <section className="relative pt-32 pb-20 px-6 bg-bg overflow-hidden border-b border-border/50">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent"></div>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-6xl text-primary mb-4 tracking-tight">
              Discover your next <span className="text-amber italic">opportunity</span>.
            </h1>
            <p className="text-muted max-w-2xl mx-auto font-medium text-lg">
              Browse thousands of verified scholarships, remote jobs, and grants across Africa.
            </p>
          </div>

          {/* Integrated Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative group p-2 bg-surface/60 backdrop-blur-2xl border border-glass-border rounded-full shadow-premium focus-within:border-amber/40 transition-all duration-500">
              <div className="flex items-center gap-4 px-6 relative z-10">
                <Search className="text-amber/70 group-focus-within:text-amber transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Search by role, company, or keyword..."
                  className="w-full bg-transparent border-none outline-none py-4 text-primary placeholder:text-muted/60 font-medium text-base md:text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src="/logo-icon.png" alt="OppAlert Icon" className="hidden" />
                <button className="hidden md:flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber to-amber-light text-[#080A07] font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-amber text-sm tracking-wide">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Filters and View Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 py-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full lg:max-w-4xl pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCat === cat.id 
                    ? 'bg-amber text-[#080A07] shadow-glow-amber' 
                    : 'bg-surface/50 text-muted border border-border hover:border-amber/40 hover:text-primary'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none cursor-pointer flex items-center justify-between lg:justify-start gap-3 px-5 py-3 bg-surface/50 border border-border hover:border-border2 rounded-xl text-xs font-bold text-primary transition-colors">
              <span className="text-muted">Sort by:</span>
              <span className="text-amber">Recent</span>
              <ArrowDownWideNarrow size={14} className="text-muted/60" />
            </div>
            <div className="flex items-center gap-1 p-1 bg-surface/50 border border-border rounded-xl">
              <button className="p-2.5 bg-amber text-[#080A07] rounded-lg shadow-sm"><LayoutGrid size={16} /></button>
              <button className="p-2.5 text-muted hover:text-primary transition-colors"><List size={16} /></button>
            </div>
          </div>
        </div>

        {/* Result count */}
        {!loading && (
          <div className="mb-10 flex items-center gap-4">
            <div className="text-sm font-semibold text-primary">
              Showing <span className="text-amber">{opps.length}</span> verified listings
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-border/80 to-transparent" />
          </div>
        )}

        {/* Grid */}
        {loading && opps.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-surface/30 border border-border rounded-3xl h-[420px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {opps.map((opp, index) => (
              <ScrollReveal key={opp.id} delay={index % 3 * 50}>
                <OpportunityCard opportunity={opp} />
              </ScrollReveal>
            ))}
          </div>
        )}
        
        {!loading && opps.length === 0 && (
          <div className="text-center py-32 bg-surface/10 border border-dashed border-border rounded-[3rem] mx-auto max-w-2xl">
            <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-8 text-amber/40">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">No results found</h3>
            <p className="text-muted text-sm mb-8">Try adjusting your search or category filters to find what you&apos;re looking for.</p>
            <button 
              onClick={() => { setActiveCat('all'); setSearchQuery(''); }}
              className="px-8 py-3 bg-surface border border-border rounded-xl text-amber font-black text-[10px] uppercase tracking-widest hover:bg-border transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination placeholder */}
        {!loading && opps.length > 0 && (
          <div className="mt-20 flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <button key={i} className={`w-10 h-10 rounded-xl border border-border flex items-center justify-center font-bold text-xs transition-all ${i === 1 ? 'bg-amber text-[#080A07] border-amber' : 'bg-surface/30 text-muted hover:border-amber/30'}`}>
                {i}
              </button>
            ))}
            <button className="px-4 h-10 rounded-xl border border-border bg-surface/30 text-muted font-bold text-xs hover:border-amber/30 transition-all">Next</button>
          </div>
        )}
      </div>
    </main>
  )
}
