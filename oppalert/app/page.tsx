'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { opportunities as seedData } from '@/lib/data'
import OpportunityCard from '@/components/OpportunityCard'
import { GraduationCap, Briefcase, Users, Coins, Leaf, Rocket, Calendar, Globe, MapPin, ArrowRight } from 'lucide-react'

const sampleEvents = [
  {
    id: 'sample-1',
    title: 'Data Science Bootcamp Lagos 2025',
    organizer_name: 'TechAfrica Hub',
    event_type: 'bootcamp',
    start_date: '2025-04-15T09:00:00Z',
    location: 'Lagos, Nigeria',
    is_online: false,
    max_capacity: 100,
    current_registrations: 55,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-data-science-bootcamp',
    color: '#E8A020',
  },
  {
    id: 'sample-2',
    title: 'Remote Work Masterclass for Africans',
    organizer_name: 'AfriWork Community',
    event_type: 'workshop',
    start_date: '2025-04-20T14:00:00Z',
    location: 'Online',
    is_online: true,
    max_capacity: 500,
    current_registrations: 234,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-remote-work-masterclass',
    color: '#4A9EE8',
  },
  {
    id: 'sample-3',
    title: 'Startup Pitch Night Nairobi',
    organizer_name: 'Nairobi Tech Week',
    event_type: 'meetup',
    start_date: '2025-05-02T18:00:00Z',
    location: 'Nairobi, Kenya',
    is_online: false,
    max_capacity: 150,
    current_registrations: 89,
    is_paid: true,
    ticket_price: 2000,
    slug: 'sample-startup-pitch-night',
    color: '#8B5CF6',
  },
]

export default function HomePage() {
  const [featured, setFeatured] = useState(seedData.filter(o => o.is_featured))

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/opportunities?limit=6')
        if (res.ok) {
          const result = await res.json()
          if (result && (result.data || Array.isArray(result))) {
            const data = Array.isArray(result) ? result : result.data
            if (data && data.length > 0) setFeatured(data)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchFeatured()
  }, [])

  const getDeadlineText = (opp: any): string => {
    const days = parseInt(opp.days_remaining)
    if (!isNaN(days) && days > 0) {
      if (days === 1) return "1 day left"
      if (days < 30) return days + " days left"
      return Math.ceil(days / 30) + " months left"
    }
    return "Open"
  }

  const categories = [
    { name: 'Scholarships', icon: <GraduationCap size={32} className="mx-auto" />, slug: 'scholarship' },
    { name: 'Remote Jobs', icon: <Briefcase size={32} className="mx-auto" />, slug: 'job' },
    { name: 'Fellowships', icon: <Users size={32} className="mx-auto" />, slug: 'fellowship' },
    { name: 'Grants', icon: <Coins size={32} className="mx-auto" />, slug: 'grant' },
    { name: 'Internships', icon: <Leaf size={32} className="mx-auto" />, slug: 'internship' },
    { name: 'Startup Funding', icon: <Rocket size={32} className="mx-auto" />, slug: 'startup' },
  ]

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="pt-24 pb-32 px-6 text-center border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-syne text-5xl md:text-7xl font-black text-primary mb-6 tracking-tighter leading-tight">
            The Hub for African <span className="text-amber">Excellence.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover verified scholarships, remote jobs, fellowships, and grants curated specifically for the next generation of African leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/opportunities" className="px-10 py-4 bg-amber text-[#080A07] font-black rounded-2xl hover:scale-105 transition-all shadow-glow-amber">
              Browse Opportunities
            </Link>
            <Link href="/register" className="px-10 py-4 bg-bg2 text-primary border border-border font-black rounded-2xl hover:bg-surface transition-all">
              Join Free Community
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 container mx-auto">
        <h2 className="font-syne text-3xl font-black text-primary mb-12 text-center">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/opportunities?cat=${cat.slug}`} className="p-6 bg-bg2 border border-border rounded-3xl hover:border-amber transition-all text-center group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <div className="font-bold text-primary text-sm">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-6 bg-[var(--bg2)] border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-transparent pointer-events-none opacity-[0.03] select-none" style={{ backgroundImage: 'radial-gradient(var(--amber) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-syne text-3xl md:text-4xl font-black text-primary mb-3">Featured <span className="text-amber">Opportunities</span></h2>
              <p className="text-muted text-lg max-w-xl">Handpicked high-impact opportunities closing soon across Africa.</p>
            </div>
            <Link href="/opportunities" className="text-amber font-black uppercase tracking-widest text-xs hover:opacity-80 transition-opacity flex items-center gap-2">
              View All Opportunities <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} deadlineOverride={getDeadlineText(opp)} />
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-syne text-3xl font-black text-primary mb-2">Upcoming Events & Bootcamps</h2>
              <p className="text-muted">Level up with community-led workshops and meetups.</p>
            </div>
            <Link href="/events" className="text-[#E8A020] font-bold hover:underline">View All Events →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleEvents.map((event) => (
              <div key={event.id} className="bg-bg2 border border-border rounded-[2rem] p-8 hover:border-amber/50 transition-all group" style={{ borderLeft: `4px solid ${event.color}` }}>
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-bg rounded-full text-[10px] font-black uppercase text-muted border border-border">
                    {event.event_type}
                  </span>
                  <span className="text-amber text-xs font-bold">{event.is_paid ? `NGN ${event.ticket_price.toLocaleString()}` : 'FREE'}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-amber transition-colors line-clamp-2">{event.title}</h3>
                <div className="space-y-3 mb-8">
                  <div className="text-sm text-muted flex items-center gap-2"><Calendar size={16} /> {new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-sm text-muted flex items-center gap-2">{event.is_online ? <><Globe size={16} /> Online</> : <><MapPin size={16} /> {event.location}</>}</div>
                </div>
                <div className="w-full bg-bg rounded-full h-1.5 mb-4 overflow-hidden">
                  <div className="h-full" style={{ width: `${(event.current_registrations / event.max_capacity) * 100}%`, backgroundColor: event.color }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-subtle uppercase mb-8">
                  <span>Registration</span>
                  <span>{event.current_registrations}/{event.max_capacity} Booked</span>
                </div>
                <Link href={`/events/${event.slug}`} className="block w-full py-3 bg-surface text-primary text-center font-black rounded-xl group-hover:bg-amber group-hover:text-[#080A07] transition-all">
                  Register Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center bg-amber shadow-[0_-20px_50px_rgba(192,112,16,0.1)]">
        <h2 className="font-syne text-4xl font-black text-[#080A07] mb-6">Ready to find your next opportunity?</h2>
        <p className="text-[#080A07] opacity-80 mb-10 text-lg max-w-xl mx-auto font-medium">Join thousands of students and professionals receiving weekly alerts.</p>
        <Link href="/register" className="px-12 py-5 bg-bg text-primary font-black rounded-2xl hover:scale-105 transition-all inline-block shadow-2xl">
          Create Free Account →
        </Link>
      </section>
    </main>
  )
}
