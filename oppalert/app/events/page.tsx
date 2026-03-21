"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const sampleEvents = [
  {
    id: "s1",
    title: "Data Science Bootcamp Lagos 2025",
    organizer: "TechAfrica Hub",
    type: "bootcamp",
    date: "April 15, 2025",
    location: "Lagos, Nigeria",
    isOnline: false,
    spots: 45,
    maxSpots: 100,
    price: 0,
    tags: ["Python", "Machine Learning", "Data"],
    color: "#E8A020",
  },
  {
    id: "s2",
    title: "Remote Work Masterclass",
    organizer: "AfriWork Community",
    type: "workshop",
    date: "April 20, 2025",
    location: "Online",
    isOnline: true,
    spots: 234,
    maxSpots: 500,
    price: 0,
    tags: ["Remote Work", "Productivity", "Career"],
    color: "#4A9EE8",
  },
  {
    id: "s3",
    title: "Startup Pitch Night Nairobi",
    organizer: "Nairobi Tech Week",
    type: "meetup",
    date: "May 2, 2025",
    location: "Nairobi, Kenya",
    isOnline: false,
    spots: 89,
    maxSpots: 150,
    price: 2000,
    tags: ["Startups", "Pitching", "Networking"],
    color: "#8B5CF6",
  },
  {
    id: "s4",
    title: "Cloud Computing Workshop",
    organizer: "DevCommunity Africa",
    type: "workshop",
    date: "May 10, 2025",
    location: "Online",
    isOnline: true,
    spots: 67,
    maxSpots: 200,
    price: 0,
    tags: ["AWS", "Cloud", "DevOps"],
    color: "#34C27A",
  },
  {
    id: "s5",
    title: "Africa Tech Conference 2025",
    organizer: "AfricaTech Foundation",
    type: "conference",
    date: "June 1-3, 2025",
    location: "Accra, Ghana",
    isOnline: false,
    spots: 1200,
    maxSpots: 2000,
    price: 15000,
    tags: ["Technology", "Innovation", "Africa"],
    color: "#F97316",
  },
  {
    id: "s6",
    title: "Mobile App Development Bootcamp",
    organizer: "CodeCamp Nigeria",
    type: "bootcamp",
    date: "May 25, 2025",
    location: "Abuja, Nigeria",
    isOnline: false,
    spots: 23,
    maxSpots: 30,
    price: 25000,
    tags: ["React Native", "Flutter", "Mobile"],
    color: "#E8A020",
  },
]

export default function EventsPage() {
  const [activeType, setActiveType] = useState("all")
  const [events, setEvents] = useState(sampleEvents)

  useEffect(() => {
    if (activeType === "all") {
      setEvents(sampleEvents)
    } else {
      setEvents(sampleEvents.filter(e => e.type === activeType))
    }
  }, [activeType])

  const types = ["all", "bootcamp", "workshop", "webinar", "meetup", "conference", "hackathon"]

  return (
    <main className="min-h-screen bg-[#080A07] pb-24">
      {/* HERO */}
      <section className="pt-24 pb-32 px-6 relative overflow-hidden border-b border-[#252D22]">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#EDE8DF 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="font-syne text-5xl md:text-7xl font-black text-[#EDE8DF] mb-6 tracking-tighter">Events & <span className="text-[#E8A020]">Bootcamps</span></h1>
          <p className="text-xl text-[#9A9C8E] max-w-2xl mx-auto mb-12 leading-relaxed">
            Level up your skills with community-led bootcamps, workshops, and meetups across Africa. Join the conversation and grow your network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/organizer" className="px-10 py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:scale-105 transition-all">
              Host an Event
            </Link>
            <button onClick={() => document.getElementById("grid")?.scrollIntoView({ behavior: "smooth" })} className="px-10 py-4 bg-transparent text-[#EDE8DF] border border-[#252D22] font-black rounded-2xl hover:bg-[#141710] transition-all">
              Browse Events
            </button>
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-6">
            <span className="px-4 py-2 bg-[#141710] border border-[#252D22] rounded-full text-xs font-bold text-[#9A9C8E]">🔥 45+ Bootcamps</span>
            <span className="px-4 py-2 bg-[#141710] border border-[#252D22] rounded-full text-xs font-bold text-[#9A9C8E]">📅 38+ Events</span>
            <span className="px-4 py-2 bg-[#141710] border border-[#252D22] rounded-full text-xs font-bold text-[#9A9C8E]">🌍 12 Countries</span>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="sticky top-[60px] z-40 bg-[#080A07]/80 backdrop-blur-xl border-b border-[#252D22] py-4">
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar flex gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeType === t ? "bg-[#E8A020] text-[#080A07]" : "bg-[#141710] text-[#9A9C8E] border border-[#252D22] hover:bg-[#222820]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section id="grid" className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-[#141710] border border-[#252D22] rounded-[2rem] p-8 hover:border-[#E8A020]/50 transition-all group flex flex-col" style={{ borderLeft: `4px solid ${event.color}` }}>
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: `${event.color}20`, color: event.color }}>
                  {event.type}
                </span>
                <span className="text-[#EDE8DF] text-xs font-bold">{event.price === 0 ? "FREE" : `₦${event.price.toLocaleString()}`}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#EDE8DF] mb-2 group-hover:text-[#E8A020] transition-colors">{event.title}</h3>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-[#222820] flex items-center justify-center text-[10px] font-bold text-[#9A9C8E] border border-[#252D22]">
                  {event.organizer[0]}
                </div>
                <span className="text-xs font-medium text-[#555C50]">by {event.organizer}</span>
              </div>
              <div className="space-y-3 mb-8">
                <div className="text-sm text-[#9A9C8E] flex items-center gap-3">
                  <span className="opacity-50">📅</span> {event.date}
                </div>
                <div className="text-sm text-[#9A9C8E] flex items-center gap-3">
                  <span className="opacity-50">{event.isOnline ? "🌐" : "📍"}</span> {event.isOnline ? "Online" : event.location}
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="w-full bg-[#080A07] rounded-full h-1.5 mb-4 overflow-hidden">
                  <div className="h-full transition-all duration-1000" style={{ width: `${(event.spots / event.maxSpots) * 100}%`, backgroundColor: event.color }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-[#555C50] uppercase mb-8">
                  <span>Capacity</span>
                  <span>{event.spots}/{event.maxSpots} Booked</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {event.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold text-[#555C50] border border-[#252D22] px-2 py-1 rounded-md uppercase">#{tag}</span>
                  ))}
                </div>
                <button className="w-full py-4 bg-[#222820] text-[#EDE8DF] font-black rounded-2xl group-hover:bg-[#E8A020] group-hover:text-[#080A07] transition-all">
                  Register Now →
                </button>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="py-32 text-center bg-[#141710] border border-[#252D22] rounded-[3rem]">
            <div className="text-6xl mb-6 opacity-20">📅</div>
            <h3 className="text-2xl font-bold text-[#EDE8DF] mb-2">No {activeType} events found yet</h3>
            <p className="text-[#9A9C8E] mb-10">Be the first to host an event for this category!</p>
            <Link href="/organizer" className="px-10 py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl inline-block">
              Host an Event
            </Link>
          </div>
        )}
      </section>

      {/* ORGANIZER BANNER */}
      <section className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-[#E8A020] to-[#C87020] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-glow-amber">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="font-syne text-4xl md:text-5xl font-black text-[#080A07] mb-6">Are you an organizer?</h2>
            <p className="text-[#080A07] text-xl font-medium mb-12 max-w-2xl mx-auto opacity-90">
              OppAlert gives you the tools to create, manage, and grow your community events. Reach thousands of professionals across Africa.
            </p>
            <Link href="/organizer" className="px-12 py-5 bg-[#080A07] text-[#EDE8DF] font-black rounded-2xl hover:scale-105 transition-all inline-block shadow-2xl">
              Host an Event Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
