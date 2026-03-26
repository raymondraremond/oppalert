import Link from 'next/link'
import SaveButton from './SaveButton'
import { Clock } from 'lucide-react'

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
    <div
      className="h-full"
      style={{
        animation: `fadeUp 0.6s ease both`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      <Link 
        href={`/opportunities/${opp.id}`}
        className="group flex flex-col bg-[#0D0F0B] border border-[#2E3530] rounded-[2rem] overflow-hidden hover:border-[#E8A020] transition-all duration-500 hover:shadow-[0_0_40px_rgba(232,160,32,0.1)] block h-full relative"
        style={{
          textDecoration: 'none',
          transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          willChange: 'transform',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.35)'
          e.currentTarget.style.borderColor = '#313D2C'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = '#2E3530'
        }}
      >
        {/* Top Image Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: 180,
          overflow: 'hidden',
          borderRadius: '2rem 2rem 0 0',
          background: '#1C2119',
        }}>
          <img
            src={opp.image || 
              `https://picsum.photos/seed/${opp.id}/800/400`}
            alt={opp.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s ease',
            }}
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails for any reason
              const target = e.target as HTMLImageElement
              target.src = 
                `https://picsum.photos/seed/${cat || 'opp'}/800/400`
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLImageElement
              target.style.transform = 'scale(1.04)'
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLImageElement
              target.style.transform = 'scale(1)'
            }}
          />
          
          {/* Category badge overlay on image */}
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(8,10,7,0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 100,
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 700,
            color: '#EDE8DF',
            textTransform: 'capitalize',
            letterSpacing: '0.3px',
            zIndex: 20
          }}>
            {cat}
          </div>
          
          {/* Featured badge if applicable */}
          {opp.is_featured && (
            <div style={{
              position: 'absolute',
              top: 12,
              right: 48, // Move left to make room for save button
              background: 
                'linear-gradient(135deg, #E8A020, #C87020)',
              borderRadius: 100,
              padding: '3px 10px',
              fontSize: 10,
              fontWeight: 800,
              color: '#090A07',
              letterSpacing: '0.5px',
              zIndex: 20
            }}>
              FEATURED
            </div>
          )}

          {/* Floating Save Button - Preserving existing functionality */}
          <div className="absolute top-3 right-3 z-30" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <div className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-[#E8A020] hover:text-[#080A07] hover:border-[#E8A020] transition-colors shadow-lg">
               <SaveButton oppId={opp.id} oppTitle={opp.title} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E8A020]">
              {cat.replace('-', ' ')}
            </span>
            <span className="text-white/20 font-bold mx-1">/</span>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              {new Date(opp.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h3 className="font-inter text-xl md:text-2xl font-black text-white mb-3 leading-snug group-hover:text-[#E8A020] transition-colors line-clamp-2 tracking-tight">
            {opp.title}
          </h3>

          <p className="font-inter text-sm text-[#A0A59A] leading-relaxed line-clamp-2 mb-8 flex-grow">
            {opp.description || opp.desc || "Click to explore this exclusive opportunity tailored for top talent."}
          </p>

          {/* Footer Meta */}
          <div className="pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center text-[10px] font-black text-[#E8A020] uppercase shadow-inner">
                {opp.organization || opp.org ? (opp.organization || opp.org).substring(0, 1) : 'O'}
              </div>
              <span className="text-[11px] font-bold text-white/60 truncate max-w-[120px]">
                {opp.organization || opp.org || 'OppFetch Elite'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-[#E8A020] uppercase tracking-widest">
               <Clock size={12} strokeWidth={3} />
               {deadlineText.replace(' left', '')}
            </div>
          </div>
        </div>

        {/* Hover Highlight Overlay */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E8A020]/20 rounded-[2rem] pointer-events-none transition-colors" />
      </Link>
    </div>
  )
}
