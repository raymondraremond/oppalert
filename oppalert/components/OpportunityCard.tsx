'use client'
import Link from 'next/link'
import SaveButton from './SaveButton'
import { Clock, ExternalLink } from 'lucide-react'

interface OpportunityCardProps {
  opportunity: any
  deadlineOverride?: string
  index?: number
}

export default function OpportunityCard({ opportunity, deadlineOverride, index = 0 }: OpportunityCardProps) {
  const opp = opportunity
  const cat = opp.cat || opp.category || 'other'
  
  const getDeadlineDisplay = (deadline: string, remaining: string) => {
    if (!deadline) return 'Open Deadline'
    const days = parseInt(remaining)
    if (!isNaN(days) && days > 0) return `${days} days left`
    if (days === 0) return 'Ends Today'
    if (days < 0) return 'Expired'
    return new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const deadlineText = deadlineOverride || getDeadlineDisplay(opp.deadline, opp.days_remaining)

  return (
    <div className="h-full group">
      <Link 
        href={`/opportunities/${opp.id}`}
        className="flex flex-col h-full bg-surface/30 border border-border/60 rounded-[2.5rem] overflow-hidden backdrop-blur-md transition-all duration-500 hover:border-emerald/40 hover:shadow-2xl hover:shadow-emerald/5 active:scale-[0.98] relative"
      >
        {/* Top Image Section */}
        <div className="relative w-full h-52 overflow-hidden bg-surface2">
          <img
            src={opp.image || opp.image_url || `https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80`}
            alt={opp.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80`
            }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-60" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
              {cat}
            </span>
          </div>
          
          {/* Featured Badge */}
          {opp.is_featured && (
            <div className="absolute top-4 right-14 z-20">
              <span className="px-3 py-1.5 bg-emerald text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald/20">
                FEATURED
              </span>
            </div>
          )}

          {/* Save Button Overlay */}
          <div 
            className="absolute top-4 right-4 z-30" 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <div className="w-9 h-9 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-emerald hover:text-black hover:border-emerald transition-all duration-300 shadow-xl group/save">
               <SaveButton oppId={opp.id} oppTitle={opp.title} />
            </div>
          </div>

          {/* External Link Icon (on hover shadow) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px] pointer-events-none">
             <div className="w-12 h-12 rounded-full bg-emerald/90 text-black flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                <ExternalLink size={20} strokeWidth={3} />
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col flex-grow relative">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald">
              {cat.replace('-', ' ')}
            </span>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60">
              {new Date(opp.created_at || new Date()).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h3 className="font-extrabold text-xl md:text-2xl text-primary mb-4 leading-[1.3] tracking-tighter group-hover:text-emerald transition-colors line-clamp-2 font-syne italic">
            {opp.title}
          </h3>

          <p className="text-sm text-muted/70 leading-relaxed line-clamp-2 mb-8 flex-grow font-medium">
            {opp.description || opp.desc || "Click to explore this exclusive opportunity tailored for top talent."}
          </p>

          {/* Footer Meta */}
          <div className="pt-6 border-t border-border/40 flex justify-between items-center transition-colors group-hover:border-emerald/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface2 border border-border flex items-center justify-center text-[11px] font-black text-emerald uppercase shadow-inner group-hover:border-emerald/30 transition-colors">
                {opp.organization || opp.org ? (opp.organization || opp.org).substring(0, 1) : 'O'}
              </div>
              <span className="text-[12px] font-bold text-primary/80 truncate max-w-[110px] tracking-tight">
                {opp.organization || opp.org || 'OppFetch Elite'}
              </span>
            </div>

            {/* Deadline Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-sm ${
              deadlineText.includes('Expired') 
                ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                : deadlineText.includes('Today') || (parseInt(opp.days_remaining) <= 3)
                  ? 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'
                  : 'bg-emerald/10 border-emerald/20 text-emerald'
            }`}>
               <Clock size={12} strokeWidth={3} />
               {deadlineText}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
