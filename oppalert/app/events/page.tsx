"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import EventCard from "@/components/EventCard"

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  const categories = ["all", "bootcamp", "workshop", "webinar", "meetup", "conference", "hackathon"]

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const res = await fetch(`/api/events?type=${filter}`)
        const data = await res.json()
        setEvents(data.data || [])
      } catch (err) {
        console.error("Failed to fetch events:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [filter])

  return (
    <div className="min-h-screen bg-[#080A07] pt-20 pb-20">
      {/* HERO SECTION */}
      <section className="container mx-auto px-6 mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-[#EDE8DF] mb-4">
          Events & <span className="text-[#E8A020]">Bootcamps</span>
        </h1>
        <p className="text-lg text-[#9A9C8E] max-w-2xl mx-auto mb-8">
          Discover workshops, bootcamps, webinars and meetups near you.
          Level up your skills with community-led events.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/events/create" className="px-8 py-3 bg-[#E8A020] text-[#080A07] font-bold rounded-xl hover:bg-[#F0B040] transition-colors">
            Host an Event
          </Link>
          <Link href="/organizer" className="px-8 py-3 bg-[#141710] text-[#EDE8DF] border border-[#252D22] font-bold rounded-xl hover:bg-[#222820] transition-colors">
            Organizer Dashboard
          </Link>
        </div>
      </section>

      {/* FILTERS */}
      <section className="container mx-auto px-6 mb-10 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                filter === cat
                  ? "bg-[#E8A020] text-[#080A07]"
                  : "bg-[#141710] text-[#9A9C8E] border border-[#252D22] hover:border-[#E8A020]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="container mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] bg-[#141710] animate-pulse rounded-2xl border border-[#252D22]"></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#141710] rounded-3xl border border-[#252D22]">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-[#EDE8DF] mb-2">No events found</h2>
            <p className="text-[#9A9C8E] mb-8">Be the first to create one and grow your community!</p>
            <Link href="/organizer/create" className="px-8 py-3 bg-[#E8A020] text-[#080A07] font-bold rounded-xl hover:bg-[#F0B040] transition-colors">
              Create Your First Event
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
