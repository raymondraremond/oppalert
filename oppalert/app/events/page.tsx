"use client";
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { Calendar, MapPin, Globe, ArrowRight, Sparkles } from 'lucide-react'

const sampleEvents = [
  {
    id: 'sample-1',
    title: 'Data Science Bootcamp Lagos 2025',
    description: 'Master data science in 12 weeks with industry experts.',
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
    description: 'Learn how to land high-paying remote roles internationally.',
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
    description: 'Network with VCs and founders in the heart of Kenya.',
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
  {
    id: 'sample-4',
    title: 'Full Stack Web Dev Workshop',
    description: 'Build and deploy a full-featured app using Next.js.',
    organizer_name: 'DevFlow Africa',
    event_type: 'workshop',
    start_date: '2025-05-10T10:00:00Z',
    location: 'Accra, Ghana',
    is_online: false,
    max_capacity: 80,
    current_registrations: 42,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-web-dev-workshop',
    color: '#E8A020',
  },
  {
    id: 'sample-5',
    title: 'Fintech Careers Webinar',
    description: 'Discover the future of finance and how to break in.',
    organizer_name: 'MoneyNext Africa',
    event_type: 'webinar',
    start_date: '2025-05-15T16:00:00Z',
    location: 'Online',
    is_online: true,
    max_capacity: 1000,
    current_registrations: 567,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-fintech-webinar',
    color: '#4A9EE8',
  },
  {
    id: 'sample-6',
    title: 'AI and Robotics Hackathon',
    description: '48 hours of building the future of African automation.',
    organizer_name: 'RoboQuest Africa',
    event_type: 'hackathon',
    start_date: '2025-06-05T08:00:00Z',
    location: 'Kigali, Rwanda',
    is_online: false,
    max_capacity: 120,
    current_registrations: 66,
    is_paid: true,
    ticket_price: 5000,
    slug: 'sample-ai-hackathon',
    color: '#8B5CF6',
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState(sampleEvents)
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        if (res.ok) {
          const data = await res.json()
          if (data.data && data.data.length > 0) {
            setEvents([...data.data, ...sampleEvents])
          }
        }
      } catch (err) {
        console.error('Fetch error:', err)
      }
    }
    fetchEvents()
  }, [])

  const filteredEvents = typeFilter === 'all' 
    ? events 
    : events.filter(e => e.event_type === typeFilter)

  return (
    <div className="min-h-screen bg-bg pb-32">
      {/* Hero bar */}
      <section className="relative pt-32 pb-20 px-6 bg-bg overflow-hidden border-b border-border/50">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent"></div>
        <div className="absolute top-[-10%] right-1/4 w-[500px] h-[500px] bg-emerald/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute top-[-20%] left-1/4 w-[600px] h-[600px] bg-amber/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight" style={{ animation: 'fadeUp 0.6s ease both' }}>
            {"Next-Gen "}<span className="text-amber italic">Events.</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed font-medium" style={{ animation: 'fadeUp 0.6s ease both', animationDelay: '150ms' }}>
            Discover workshops, webinars, and meetups designed to accelerate 
            your professional growth in Africa.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex justify-center mb-16">
          <div className="stagger-children flex gap-3 overflow-x-auto pb-4 no-scrollbar max-w-full">
            {['all', 'bootcamp', 'workshop', 'webinar', 'meetup', 'hackathon'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                style={{ animation: 'fadeUp 0.5s ease both' }}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  typeFilter === type
                    ? 'bg-amber border border-amber text-[#080A07] shadow-glow-amber scale-[1.02]'
                    : 'bg-surface/50 border border-border text-muted hover:border-amber/40 hover:text-primary'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredEvents.map((event, idx) => (
            <ScrollReveal key={event.id} delay={idx * 80}>
              <div 
                className="bg-surface/30 border border-border backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 group flex flex-col hover:border-amber/40 hover:shadow-glow-amber h-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: event.color || 'var(--amber)' }} />
                
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1.5 bg-surface2 rounded-md text-[10px] font-black uppercase text-primary/80 border border-border">
                    {event.event_type}
                  </span>
                  <span className={`text-xs font-black tracking-widest px-3 py-1.5 rounded-full border ${
                    event.is_paid 
                      ? 'bg-amber/10 text-amber border-amber/20' 
                      : 'bg-emerald/10 text-emerald border-emerald/20'
                  }`}>
                    {event.is_paid ? `NGN ${Number(event.ticket_price).toLocaleString()}` : 'FREE'}
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl font-bold text-primary mb-3 group-hover:text-amber transition-colors line-clamp-2 tracking-tight">
                  {event.title}
                </h3>
                
                <p className="text-muted font-sans text-sm mb-8 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="text-[11px] font-bold text-muted flex items-center gap-3 uppercase tracking-wider">
                    <Calendar size={16} className="text-amber" />
                    {new Date(event.start_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="text-[11px] font-bold text-muted flex items-center gap-3 uppercase tracking-wider bg-surface/50 p-2.5 rounded-lg border border-border/50">
                    {event.is_online ? <Globe size={16} className="text-info" /> : <MapPin size={16} className="text-danger" />}
                    {event.is_online ? 'Online Session' : event.location}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-border/50">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Capacity</span>
                    <span className="text-xs font-black text-primary">{event.current_registrations} / {event.max_capacity || '\u221E'} <span className="text-muted/60 font-medium">Booked</span></span>
                  </div>
                  <div className="w-full bg-surface2 rounded-full h-2 mb-8 overflow-hidden border border-border/50">
                    <div 
                      className="h-full bg-gradient-to-r from-amber to-amber-light transition-all duration-1000" 
                      style={{ width: `${Math.min((event.current_registrations / (event.max_capacity || 100)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <Link 
                    href={`/events/${event.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-surface text-primary border border-border font-bold rounded-xl hover:bg-amber hover:text-[#080A07] hover:border-amber transition-all uppercase text-xs tracking-widest active:scale-[0.98]"
                  >
                    View & Register <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
