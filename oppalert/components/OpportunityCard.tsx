"use client"
import Link from "next/link"
import { getCategoryLabel } from "@/lib/utils"
import { MapPin } from "lucide-react"
import { CategoryIcon } from "@/lib/icons"

interface OpportunityCardProps {
  opportunity: any
  deadlineOverride?: string
}

export default function OpportunityCard({ opportunity, deadlineOverride }: OpportunityCardProps) {
  const cat = opportunity.cat || opportunity.category || 'other'
  const org = opportunity.org || opportunity.organization || 'Unknown Organization'
  const loc = opportunity.loc || opportunity.location || 'Remote / Unspecified'
  const cost = opportunity.cost || opportunity.funding_type || 'Free'

  const getDeadlineDisplay = (deadline: string | null, days: number | null): string => {
    if (deadlineOverride) return deadlineOverride
    
    // Use days_remaining from DB if available
    if (days !== null && days !== undefined) {
      if (days <= 0) return "Closed"
      if (days === 1) return "1 day left"
      return days + " days left"
    }
    // Fallback to calculating from deadline date
    if (!deadline) return "Open"
    const deadlineDate = new Date(deadline)
    if (isNaN(deadlineDate.getTime())) return "Open"
    const now = new Date()
    const diff = Math.floor(
      (deadlineDate.getTime() - now.getTime()) / 86400000
    )
    if (diff <= 0) return "Deadline passed"
    if (diff === 1) return "1 day left"
    return diff + " days left"
  }

  const deadlineText = getDeadlineDisplay(opportunity.deadline, opportunity.days_remaining)

  return (
    <Link 
      href={`/opportunities/${opportunity.id}`}
      className="block group h-full"
    >
      <div className="bg-bg2 border border-border rounded-[2rem] p-8 hover:border-[#E8A020]/50 hover:bg-surface transition-all flex flex-col h-full shadow-lg hover:shadow-[#E8A020]/5">
        <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 bg-bg rounded-full text-[10px] font-black uppercase text-muted border border-border flex flex-shrink-0 items-center gap-1.5">
            <CategoryIcon cat={cat} size={12} />
            {getCategoryLabel(cat)}
          </span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${deadlineText.includes("left") ? "text-[#E8A020]" : "text-subtle"}`}>
            {deadlineText}
          </span>
        </div>

        <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-[#E8A020] transition-colors line-clamp-2">
          {opportunity.title}
        </h3>

        <div className="flex items-center gap-2 mb-8">
          <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-[10px] font-bold text-muted border border-border flex-shrink-0">
            {org[0].toUpperCase()}
          </div>
          <span className="text-xs font-medium text-subtle truncate">{org}</span>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-subtle truncate max-w-[60%] flex items-center gap-1.5">
              <MapPin size={12} className="flex-shrink-0" />
              {loc}
            </span>
            <span className="text-[#34C27A] font-bold flex-shrink-0">
              {cost === "Free" || cost === "0" ? "FREE" : cost}
            </span>
          </div>
          <div className="w-full py-3 bg-surface text-primary text-center font-bold rounded-xl group-hover:bg-[#E8A020] group-hover:text-[#080A07] transition-all">
            View Details
          </div>
        </div>
      </div>
    </Link>
  )
}
