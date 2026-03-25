import Link from 'next/link'
import SaveButton from './SaveButton'
import { Clock } from 'lucide-react'

interface OpportunityCardProps {
  opportunity: any
  deadlineOverride?: string
}

export default function OpportunityCard({ opportunity, deadlineOverride }: OpportunityCardProps) {
  const cat = opportunity.cat || opportunity.category || 'other'
  
  const getDeadlineDisplay = (deadline: string, remaining: string) => {
    if (!deadline) return 'Open Deadline'
    const days = parseInt(remaining)
    if (!isNaN(days) && days > 0) return `${days} days left`
    if (days === 0) return 'Ends Today'
    if (days < 0) return 'Expired'
    return new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  // High-quality Unsplash fallbacks based on category to mirror the premium blog style
  const getImageUrl = (category: string) => {
    switch(category.toLowerCase()) {
      case 'scholarship': return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
      case 'job': return 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80'
      case 'grant': return 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80'
      case 'fellowship': return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
      case 'internship': return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
      case 'startup': return 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80'
      default: return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
    }
  }

  const imageUrl = opportunity.image_url || getImageUrl(cat)
  const deadlineText = deadlineOverride || getDeadlineDisplay(opportunity.deadline, opportunity.days_remaining)

  return (
    <Link 
      href={`/opportunities/${opportunity.id}`}
      className="group flex flex-col bg-[var(--bg)] border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-[#3A4238] transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 block h-full"
      style={{ textDecoration: 'none' }}
    >
      {/* Top Image Section */}
      <div className="relative h-[220px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[#080A07]/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
        <img 
          src={imageUrl} 
          alt={opportunity.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Floating Save Button */}
        <div className="absolute top-4 right-4 z-20" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <div className="w-10 h-10 rounded-2xl bg-[#080A07]/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-[#E8A020] hover:text-[#080A07] hover:border-[#E8A020] transition-colors shadow-lg">
             <SaveButton oppId={opportunity.id} oppTitle={opportunity.title} />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 flex flex-col flex-grow bg-[#080A07]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#E8A020]">
            {cat.replace('-', ' ')}
          </span>
          <span className="text-[#E8A020]/40 font-bold mx-1">›</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E8A020]/70">
            {new Date(opportunity.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <h3 className="font-syne text-xl md:text-2xl font-black text-white mb-3 leading-snug group-hover:text-[#E8A020] transition-colors line-clamp-2">
          {opportunity.title}
        </h3>

        <p className="text-sm text-subtle italic leading-relaxed line-clamp-2 mb-8 flex-grow">
          {opportunity.description || "Click to view more details about this incredible opportunity."}
        </p>

        {/* Footer Meta */}
        <div className="pt-5 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center text-[10px] font-black text-[#E8A020] uppercase shadow-inner">
              {opportunity.organization ? opportunity.organization.substring(0, 1) : 'O'}
            </div>
            <span className="text-[11px] font-bold text-white/70 truncate max-w-[120px]">
              {opportunity.organization || 'OppFetch Editorial'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/50 uppercase tracking-widest">
             <Clock size={12} />
             {deadlineText.replace(' left', '')}
          </div>
        </div>
      </div>
    </Link>
  )
}
