import Link from "next/link"
import { formatEventDate, getSpotsRemaining } from "@/lib/slugify"
import OrganizerBadge from "./OrganizerBadge"

export default function EventCard({ event }: { event: any }) {
  const typeColors: Record<string, string> = {
    bootcamp: "border-t-[#E8A020]",
    workshop: "border-t-[#4A9EE8]",
    webinar: "border-t-[#34C27A]",
    meetup: "border-t-[#8B5CF6]",
    conference: "border-t-[#F97316]",
    hackathon: "border-t-[#F05050]",
  }

  const borderClass = typeColors[event.event_type] || "border-t-gray-500"

  return (
    <Link href={`/events/${event.slug}`} className={`event-card border-t-4 ${borderClass}`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`event-badge event-badge-${event.event_type}`}>
            {event.event_type}
          </span>
          <span className="text-[11px] font-bold text-white bg-black/20 px-2 py-1 rounded">
            {event.is_paid ? `₦${Number(event.ticket_price).toLocaleString()}` : "FREE"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 min-h-[3.5rem]">
          {event.title}
        </h3>

        <div className="mb-4">
          <OrganizerBadge 
            name={event.organization_name || event.organizer_name} 
            verified={event.organizer_verified} 
            size="sm"
          />
        </div>

        <div className="space-y-2 text-[13px] text-muted">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{formatEventDate(event.start_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{event.is_online ? "🌐" : "📍"}</span>
            <span className="truncate">
              {event.is_online ? "Online" : event.location}
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>👥</span>
            <span className={event.max_capacity && (event.max_capacity - event.current_registrations <= 10) ? "text-[#E8A020]" : ""}>
              {getSpotsRemaining(event.max_capacity, event.current_registrations)}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <div className="w-full py-2.5 rounded-lg bg-surface border border-border text-primary text-center text-sm font-bold group-hover:bg-[#E8A020] group-hover:text-[#080A07] transition-colors">
            View Event
          </div>
        </div>
      </div>
    </Link>
  )
}
