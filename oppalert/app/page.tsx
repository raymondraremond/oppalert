"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { opportunities as seedData } from "@/lib/data"
import OpportunityCard from "@/components/OpportunityCard"

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
  }
]

export default function HomePage() {
  const [featured, setFeatured] = useState(seedData.slice(0, 6))

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/opportunities?limit=6")
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) setFeatured(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchFeatured()
  }, [])

  const categories = [
    { name: "Scholarships", icon: "🎓", slug: "scholarship" },
    { name: "Remote Jobs", icon: "💼", slug: "job" },
    { name: "Fellowships", icon: "🤝", slug: "fellowship" },
    { name: "Grants", icon: "💰", slug: "grant" },
    { name: "Internships", icon: "🌱", slug: "internship" },
    { name: "Startup Funding", icon: "🚀", slug: "startup" }
  ]

  return (
    <main className="min-h-screen bg-[#080A07]">
      {/* HERO */}
      <section className="pt-20 pb-24 px-6 text-center border-b border-[#252D22]">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-syne text-5xl md:text-7xl font-black text-[#EDE8DF] mb-6 tracking-tighter leading-tight">
            The Hub for African <span className="text-[#E8A020]">Excellence.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#9A9C8E] mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover verified scholarships, remote jobs, fellowships, and grants curated specifically for the next generation of African leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/opportunities" className="px-10 py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:scale-105 transition-all">
              Browse Opportunities
            </Link>
            <Link href="/register" className="px-10 py-4 bg-[#141710] text-[#EDE8DF] border border-[#252D22] font-black rounded-2xl hover:bg-[#222820] transition-all">
              Join Free Community
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 px-6 container mx-auto">
        <h2 className="font-syne text-3xl font-black text-[#EDE8DF] mb-12 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/opportunities?cat=${cat.slug}`} className="p-6 bg-[#141710] border border-[#252D22] rounded-3xl hover:border-[#E8A020] transition-all text-center">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <div className="font-bold text-[#EDE8DF] text-sm">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20 px-6 bg-[#0D0F0B]">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-syne text-3xl font-black text-[#EDE8DF] mb-2">Featured Opportunities</h2>
              <p className="text-[#9A9C8E]">Handpicked high-impact opportunities closing soon.</p>
            </div>
            <Link href="/opportunities" className="text-[#E8A020] font-bold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="py-24 px-6 border-t border-[#252D22]">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-syne text-3xl font-black text-[#EDE8DF] mb-2">Upcoming Events & Bootcamps</h2>
              <p className="text-[#9A9C8E]">Level up with community-led workshops and meetups.</p>
            </div>
            <Link href="/events" className="text-[#E8A020] font-bold hover:underline">View All Events →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleEvents.map((event) => (
              <div key={event.id} className="bg-[#141710] border border-[#252D22] rounded-[2rem] p-8 hover:border-[#E8A020]/50 transition-all group" style={{ borderLeft: `4px solid ${event.color}` }}>
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-[#080A07] rounded-full text-[10px] font-black uppercase text-[#9A9C8E] border border-[#252D22]">
                    {event.type}
                  </span>
                  <span className="text-[#E8A020] text-xs font-bold">{event.price === 0 ? "FREE" : `₦${event.price.toLocaleString()}`}</span>
                </div>
                <h3 className="text-xl font-bold text-[#EDE8DF] mb-4 group-hover:text-[#E8A020] transition-colors">{event.title}</h3>
                <div className="space-y-2 mb-8">
                  <div className="text-sm text-[#9A9C8E] flex items-center gap-2">📅 {event.date}</div>
                  <div className="text-sm text-[#9A9C8E] flex items-center gap-2">{event.isOnline ? "🌐 Online" : `📍 ${event.location}`}</div>
                </div>
                <div className="w-full bg-[#080A07] rounded-full h-1.5 mb-4 overflow-hidden">
                  <div className="bg-[#E8A020] h-full" style={{ width: `${(event.spots / event.maxSpots) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#555C50] uppercase mb-6">
                  <span>Registration</span>
                  <span>{event.spots}/{event.maxSpots} Booked</span>
                </div>
                <Link href="/events" className="block w-full py-3 bg-[#222820] text-[#EDE8DF] text-center font-bold rounded-xl group-hover:bg-[#E8A020] group-hover:text-[#080A07] transition-all">
                  Register Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center bg-[#E8A020]">
        <h2 className="font-syne text-4xl font-black text-[#080A07] mb-6">Ready to find your next opportunity?</h2>
        <p className="text-[#080A07] opacity-80 mb-10 text-lg max-w-xl mx-auto font-medium">Join thousands of students and professionals receiving weekly alerts.</p>
        <Link href="/register" className="px-12 py-5 bg-[#080A07] text-[#EDE8DF] font-black rounded-2xl hover:scale-105 transition-all inline-block">
          Create Free Account →
        </Link>
      </section>
    </main>
  )
}
