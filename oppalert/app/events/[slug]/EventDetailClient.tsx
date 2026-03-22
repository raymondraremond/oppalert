"use client"
import Link from "next/link"
import { formatEventDate, formatEventTime, getSpotsRemaining } from "@/lib/slugify"
import OrganizerBadge from "@/components/OrganizerBadge"
import ShareEventButtons from "@/components/ShareEventButtons"
import EventRegistrationCount from "@/components/EventRegistrationCount"

export default function EventDetailClient({ event }: { event: any }) {
  const eventUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20">
      <div className="container mx-auto px-6">
        <Link href="/events" className="text-muted hover:text-primary transition-colors mb-8 inline-block">
          ← All Events
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* MAIN CONTENT */}
          <div className="flex-1">
            <div className="mb-6">
              <span className={`event-badge event-badge-${event.event_type} mb-4`}>
                {event.event_type}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-primary mb-6 leading-tight">
                {event.title}
              </h1>
              
              <div className="p-4 bg-bg2 border border-border rounded-2xl mb-8">
                <OrganizerBadge 
                  name={event.organization_name || event.organizer_name} 
                  verified={event.organizer_verified}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div className="p-5 bg-bg2 border border-border rounded-2xl">
                  <div className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-2">Date & Time</div>
                  <div className="text-primary font-bold">{formatEventDate(event.start_date)}</div>
                  <div className="text-muted text-sm">{formatEventTime(event.start_date)}</div>
                </div>
                <div className="p-5 bg-bg2 border border-border rounded-2xl">
                  <div className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-2">Location</div>
                  <div className="text-primary font-bold">{event.is_online ? "🌐 Online" : `📍 ${event.location}`}</div>
                  <div className="text-muted text-sm">{event.is_online ? "Join from anywhere" : "In-person event"}</div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-bold text-primary mb-4">About this event</h3>
                <div className="text-muted whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </div>
              </div>
              
              {event.tags && event.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {event.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-surface text-muted text-xs rounded-lg border border-border">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[380px]">
            <div className="sticky top-24 space-y-6">
              {/* REGISTRATION CARD */}
              <div className="p-6 bg-bg2 border border-border rounded-3xl shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-1">Price</div>
                    <div className="text-2xl font-black text-[#E8A020]">
                      {event.is_paid ? `₦${Number(event.ticket_price).toLocaleString()}` : "FREE"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-1">Status</div>
                    <div className="text-xs font-bold text-[#34C27A]">Open</div>
                  </div>
                </div>

                <div className="mb-6">
                  <EventRegistrationCount 
                    current={event.current_registrations} 
                    max={event.max_capacity} 
                  />
                  <div className="mt-2 text-[11px] text-subtle font-medium italic">
                    {getSpotsRemaining(event.max_capacity, event.current_registrations)}
                  </div>
                </div>

                {event.registration_deadline && (
                  <div className="mb-6 p-3 bg-[#F05050]/5 border border-[#F05050]/10 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-[#F05050] uppercase tracking-wider">
                      Deadline: {new Date(event.registration_deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <Link 
                  href={`/events/${event.slug}/register`}
                  className="w-full py-4 bg-[#E8A020] text-[#080A07] font-black rounded-xl text-center block hover:bg-[#F0B040] transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-4"
                >
                  Register Now →
                </Link>

                <div className="pt-6 border-t border-border">
                  <div className="text-subtle text-[10px] font-bold uppercase tracking-widest mb-4 text-center">Share with friends</div>
                  <ShareEventButtons 
                    eventTitle={event.title} 
                    eventUrl={eventUrl} 
                  />
                </div>
              </div>

              {/* ORGANIZER BRIEF */}
              <div className="p-6 bg-bg2 border border-border rounded-3xl">
                <h4 className="text-primary font-bold mb-3">About the Organizer</h4>
                <p className="text-muted text-sm mb-4 line-clamp-3">
                  {event.organizer_bio || "Dedicated to creating impactful learning experiences for the African community."}
                </p>
                {event.organizer_website && (
                  <a 
                    href={event.organizer_website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#E8A020] text-sm font-bold hover:underline"
                  >
                    Visit Website ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
