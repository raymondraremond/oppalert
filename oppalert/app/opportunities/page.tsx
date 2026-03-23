'use client'
import { useState, useEffect } from 'react'
import { opportunities as seedData } from '@/lib/data'
import OpportunityCard from '@/components/OpportunityCard'
import { Search } from 'lucide-react'

export default function OpportunitiesPage() {
  const [activeCat, setActiveCat] = useState('all')
  
  const getFiltered = (cat: string) => 
    cat === 'all' 
      ? seedData 
      : seedData.filter(o => (o.cat || o.category) === cat)
  
  const [opps, setOpps] = useState<any[]>(getFiltered('all'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Smooth transition from current to filtered seed data
    const filtered = getFiltered(activeCat)
    if (filtered.length > 0) {
      setOpps(filtered)
    }
    
    setLoading(true)
    fetch(activeCat === 'all' ? '/api/opportunities' : `/api/opportunities?cat=${activeCat}`)
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.data || [])
        if (items.length > 0) {
          setOpps(items)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeCat])

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
    <main className="min-h-screen bg-bg pt-10 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="font-syne text-4xl md:text-6xl font-black text-primary mb-4 tracking-tight">Explore Opportunities</h1>
          <p className="text-muted max-w-xl mx-auto italic font-medium">Discover handpicked opportunities curated specifically for the next generation of African leaders.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar mb-10 border-b border-border">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${
                activeCat === cat.id 
                  ? 'bg-amber text-[#080A07] shadow-glow-amber scale-105' 
                  : 'bg-bg2 text-muted border border-border hover:bg-surface hover:text-primary hover:border-subtle'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading && opps.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-bg2 border border-border rounded-[2rem] h-[400px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
            {opps.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
        
        {!loading && opps.length === 0 && (
          <div className="text-center py-32 glass-card rounded-[3rem] animate-fade-in mx-auto max-w-2xl">
            <div className="flex justify-center mb-6 text-amber opacity-40"><Search size={48} strokeWidth={1.5} /></div>
            <p className="text-subtle font-bold tracking-[0.2em] uppercase text-[10px]">No opportunities found in this category.</p>
            <button onClick={() => setActiveCat('all')} className="mt-8 text-amber font-black text-xs hover:underline uppercase">Reset Filters</button>
          </div>
        )}
      </div>
    </main>
  )
}
