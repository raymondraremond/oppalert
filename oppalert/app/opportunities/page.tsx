'use client'
import { useState, useEffect } from 'react'
import { opportunities as seedData } from '@/lib/data'
import OpportunityCard from '@/components/OpportunityCard'

export default function OpportunitiesPage() {
  const [activeCat, setActiveCat] = useState('all')
  
  const getFiltered = (cat: string) => 
    cat === 'all' 
      ? seedData 
      : seedData.filter(o => o.cat === cat)
  
  const [opps, setOpps] = useState<any[]>(getFiltered('all'))

  useEffect(() => {
    setOpps(getFiltered(activeCat))
    
    fetch(activeCat === 'all' ? '/api/opportunities' : `/api/opportunities?cat=${activeCat}`)
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.data || [])
        if (items.length > 0) setOpps(items)
      })
      .catch(() => {})
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
    <main className="min-h-screen bg-[#080A07] pt-10 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="font-syne text-4xl md:text-6xl font-black text-[#EDE8DF] mb-4">Explore Opportunities</h1>
          <p className="text-[#9A9C8E] max-w-xl mx-auto">Discover handpicked opportunities curated specifically for the next generation of African leaders.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar mb-10 border-b border-[#252D22]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCat === cat.id 
                  ? 'bg-[#E8A020] text-[#080A07]' 
                  : 'bg-[#141710] text-[#9A9C8E] border border-[#252D22] hover:bg-[#222820]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opps.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </div>
    </main>
  )
}
