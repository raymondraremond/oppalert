import Link from 'next/link'
import SaveButton from './SaveButton'
import { Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface OpportunityCardProps {
  opportunity: any
  deadlineOverride?: string
  index?: number
}

export default function OpportunityCard({ opportunity, deadlineOverride, index = 0 }: OpportunityCardProps) {
  const cat = opportunity.cat || opportunity.category || 'other'
  
  const getDeadlineDisplay = (deadline: string, remaining: string) => {
    if (!deadline) return 'Open Deadline'
    const days = parseInt(remaining)
    if (!isNaN(days) && days > 0) return `${days} days left`
    if (days === 0) return 'Ends Today'
    if (days < 0) return 'Expired'
    return new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  // High-quality UNIQUE Unsplash imagery for every card
  const getImageUrl = (category: string, id: string) => {
    const keywords = {
      scholarship: 'university,library,student',
      job: 'office,technology,working',
      grant: 'funding,investment,startup',
      fellowship: 'collaboration,community,research',
      internship: 'apprentice,learning,office',
      startup: 'innovation,entrepreneur,laptop',
      other: 'abstract,network,technology'
    }
    const kw = (keywords as any)[category.toLowerCase()] || keywords.other
    return `https://images.unsplash.com/photo-${id.length > 10 ? id : '1521737711867-e3b97375f902'}?auto=format&fit=crop&w=800&q=80&sig=${id}-${index}`
  }

  // Use a fallback if id is not a standard unsplash id - but for "unique" requirement, 
  // we'll append a signature to a featured search if the opportunity doesn't have an image
  const imageUrl = opportunity.image_url || `https://source.unsplash.com/featured/1600x900?${(cat === 'other' ? 'technology' : cat)},modern,minimal&sig=${opportunity.id || index}`
  const deadlineText = deadlineOverride || getDeadlineDisplay(opportunity.deadline, opportunity.days_remaining)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="h-full"
    >
      <Link 
        href={`/opportunities/${opportunity.id}`}
        className="group flex flex-col bg-[#0D0F0B] border border-[#2E3530] rounded-[2rem] overflow-hidden hover:border-[#E8A020] transition-all duration-500 hover:shadow-[0_0_40px_rgba(232,160,32,0.1)] block h-full relative"
        style={{ textDecoration: 'none' }}
      >
        {/* Top Image Section */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
          <motion.img 
            src={imageUrl} 
            alt={opportunity.title} 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover"
          />
          {/* Floating Save Button */}
          <div className="absolute top-4 right-4 z-20" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <div className="w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-[#E8A020] hover:text-[#080A07] hover:border-[#E8A020] transition-colors shadow-lg">
               <SaveButton oppId={opportunity.id} oppTitle={opportunity.title} />
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
              {new Date(opportunity.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h3 className="font-inter text-xl md:text-2xl font-black text-white mb-3 leading-snug group-hover:text-[#E8A020] transition-colors line-clamp-2 tracking-tight">
            {opportunity.title}
          </h3>

          <p className="font-inter text-sm text-[#A0A59A] leading-relaxed line-clamp-2 mb-8 flex-grow">
            {opportunity.description || "Click to explore this exclusive opportunity tailored for top talent."}
          </p>

          {/* Footer Meta */}
          <div className="pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center text-[10px] font-black text-[#E8A020] uppercase shadow-inner">
                {opportunity.organization ? opportunity.organization.substring(0, 1) : 'O'}
              </div>
              <span className="text-[11px] font-bold text-white/60 truncate max-w-[120px]">
                {opportunity.organization || 'OppFetch Elite'}
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
    </motion.div>
  )
}
