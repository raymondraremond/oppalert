"use client"
import Link from "next/link"
import { getCategoryLabel } from "@/lib/utils"

interface OpportunityCardProps {
  opportunity: any
  deadlineOverride?: string
}

export default function OpportunityCard({ opportunity, deadlineOverride }: OpportunityCardProps) {
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
    <div className="bg-[#141710] border border-[#252D22] rounded-[2rem] p-8 hover:border-[#E8A020]/50 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <span className="px-3 py-1 bg-[#080A07] rounded-full text-[10px] font-black uppercase text-[#9A9C8E] border border-[#252D22]">
          {getCategoryLabel(opportunity.cat)}
        </span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${deadlineText.includes("left") ? "text-[#E8A020]" : "text-[#555C50]"}`}>
          {deadlineText}
        </span>
      </div>

      <h3 className="text-xl font-bold text-[#EDE8DF] mb-4 group-hover:text-[#E8A020] transition-colors line-clamp-2">
        {opportunity.title}
      </h3>

      <div className="flex items-center gap-2 mb-8">
        <div className="w-6 h-6 rounded-full bg-[#222820] flex items-center justify-center text-[10px] font-bold text-[#9A9C8E] border border-[#252D22]">
          {opportunity.org?.[0] || "O"}
        </div>
        <span className="text-xs font-medium text-[#555C50] truncate">{opportunity.org}</span>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#555C50]">📍 {opportunity.loc}</span>
          <span className="text-[#34C27A] font-bold">{opportunity.cost === "Free" || opportunity.cost === "0" ? "FREE" : opportunity.cost}</span>
        </div>
        <Link 
          href={`/opportunities/${opportunity.id}`}
          className="block w-full py-3 bg-[#222820] text-[#EDE8DF] text-center font-bold rounded-xl group-hover:bg-[#E8A020] group-hover:text-[#080A07] transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
