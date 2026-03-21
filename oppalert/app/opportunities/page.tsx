"use client"
import { useState, useEffect } from "react"
import { opportunities as seedData } from "@/lib/data"
import OpportunityCard from "@/components/OpportunityCard"

export default function OpportunitiesPage() {
  const [activeCat, setActiveCat] = useState("all")
  
  // ALWAYS start with seed data - never empty
  const getFiltered = (cat: string) => 
    cat === "all" 
      ? seedData 
      : seedData.filter(o => o.cat === cat)
  
  const [opps, setOpps] = useState(getFiltered("all"))

  useEffect(() => {
    // Update local filter immediately
    setOpps(getFiltered(activeCat))
    
    // Try DB in background silently
    const fetchFromDB = async () => {
      try {
        const url = activeCat === "all"
          ? "/api/opportunities"
          : `/api/opportunities?cat=${activeCat}`
        const res = await fetch(url, {
          signal: AbortSignal.timeout(5000),
        })
        if (!res.ok) return
        const data = await res.json()
        const items = Array.isArray(data) 
          ? data 
          : (data.data || [])
        if (items.length > 0) setOpps(items)
      } catch {
        // Silent fail - keep seed data showing
      }
    }
    fetchFromDB()
  }, [activeCat])

  const categories = [
    { id: "all", label: "All Opportunities" },
    { id: "scholarship", label: "Scholarships" },
    { id: "job", label: "Remote Jobs" },
    { id: "fellowship", label: "Fellowships" },
    { id: "grant", label: "Grants" },
    { id: "internship", label: "Internships" },
    { id: "startup", label: "Startup Funding" },
  ]

  return (
    <main className="min-h-screen bg-[#080A07] pt-10 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="font-syne text-4xl md:text-6xl font-black text-[#EDE8DF] mb-4">Explore Opportunities</h1>
          <p className="text-[#9A9C8E] max-w-xl mx-auto">Find the perfect path for your next big break. Filter by category to see what fits you best.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar mb-10 border-b border-[#252D22]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCat === cat.id 
                  ? "bg-[#E8A020] text-[#080A07]" 
                  : "bg-[#141710] text-[#9A9C8E] border border-[#252D22] hover:bg-[#222820]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opps.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>

        {opps.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#EDE8DF]">No opportunities found</h3>
            <p className="text-[#9A9C8E]">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </main>
  )
}
