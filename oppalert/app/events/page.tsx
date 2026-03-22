'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SAMPLE_EVENTS = [
  {
    id: 'sample-1',
    title: 'Data Science Bootcamp Lagos 2025',
    organizer_name: 'TechAfrica Hub',
    event_type: 'bootcamp',
    start_date: '2025-06-15T09:00:00Z',
    location: 'Lagos, Nigeria',
    is_online: false,
    max_capacity: 100,
    current_registrations: 55,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-data-science-bootcamp',
    description: 'Intensive 3-day bootcamp covering Python, Machine Learning, and Data Analysis.',
  },
  {
    id: 'sample-2',
    title: 'Remote Work Masterclass for Africans',
    organizer_name: 'AfriWork Community',
    event_type: 'workshop',
    start_date: '2025-06-20T14:00:00Z',
    location: 'Online',
    is_online: true,
    max_capacity: 500,
    current_registrations: 234,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-remote-work-masterclass',
    description: 'Learn how to land remote jobs paying in USD as an African professional.',
  },
  {
    id: 'sample-3',
    title: 'Startup Pitch Night Nairobi',
    organizer_name: 'Nairobi Tech Week',
    event_type: 'meetup',
    start_date: '2025-07-02T18:00:00Z',
    location: 'Nairobi, Kenya',
    is_online: false,
    max_capacity: 150,
    current_registrations: 89,
    is_paid: true,
    ticket_price: 2000,
    slug: 'sample-startup-pitch-night',
    description: 'Monthly pitch night where African startups present to investors and the community.',
  },
  {
    id: 'sample-4',
    title: 'AWS Cloud Computing Workshop',
    organizer_name: 'DevCommunity Africa',
    event_type: 'workshop',
    start_date: '2025-07-10T10:00:00Z',
    location: 'Online',
    is_online: true,
    max_capacity: 200,
    current_registrations: 67,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-aws-workshop',
    description: 'Hands-on AWS fundamentals for African developers getting cloud certified.',
  },
  {
    id: 'sample-5',
    title: 'Africa Tech Conference 2025',
    organizer_name: 'AfricaTech Foundation',
    event_type: 'conference',
    start_date: '2025-08-01T08:00:00Z',
    location: 'Accra, Ghana',
    is_online: false,
    max_capacity: 2000,
    current_registrations: 1200,
    is_paid: true,
    ticket_price: 15000,
    slug: 'sample-africa-tech-conference',
    description: 'The largest tech and innovation conference connecting African leaders globally.',
  },
  {
    id: 'sample-6',
    title: 'Mobile App Development Bootcamp',
    organizer_name: 'CodeCamp Nigeria',
    event_type: 'bootcamp',
    start_date: '2025-07-25T09:00:00Z',
    location: 'Abuja, Nigeria',
    is_online: false,
    max_capacity: 30,
    current_registrations: 23,
    is_paid: true,
    ticket_price: 25000,
    slug: 'sample-mobile-bootcamp',
    description: 'Learn React Native and Flutter. Build and deploy your first mobile app.',
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState(SAMPLE_EVENTS)
  const [filtered, setFiltered] = useState(SAMPLE_EVENTS)
  const [activeType, setActiveType] = useState('all')

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data)
          ? data
          : (data.data || [])
        if (items.length > 0) {
          setEvents(items)
          setFiltered(items)
        }
      })
      .catch(() => {})
  }, [])

  const handleFilter = (type: string) => {
    setActiveType(type)
    if (type === 'all') {
      setFiltered(events)
    } else {
      setFiltered(events.filter(e => e.event_type === type))
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bootcamp': return '#E8A020'
      case 'workshop': return '#4A9EE8'
      case 'webinar': return '#34C27A'
      case 'meetup': return '#8B5CF6'
      case 'conference': return '#F97316'
      case 'hackathon': return '#F05050'
      default: return '#9A9C8E'
    }
  }

  return (
    <main className="min-h-screen bg-[#080A07] pt-10 pb-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-syne text-4xl md:text-6xl font-black text-[#EDE8DF] mb-4">Events & Bootcamps</h1>
          <p className="text-[#9A9C8E] max-w-xl mx-auto text-lg">Level up your career with community-led learning and networking.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar mb-12 border-b border-[#252D22]">
          {['all', 'bootcamp', 'workshop', 'webinar', 'meetup', 'conference', 'hackathon'].map(type => (
            <button
              key={type}
              onClick={() => handleFilter(type)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeType === type 
                  ? 'bg-[#E8A020] text-[#080A07]' 
                  : 'bg-[#141710] text-[#9A9C8E] border border-[#252D22] hover:bg-[#222820]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {filtered.map(event => {
            const color = getTypeColor(event.event_type)
            const progress = (event.current_registrations / event.max_capacity) * 100
            return (
              <div key={event.id} className="bg-[#141710] border border-[#252D22] rounded-2xl p-5 flex flex-col gap-3 transition-all hover:translate-y-[-4px]" style={{ borderLeft: `4px solid ${color}` }}>
                <div className="flex justify-between items-start">
                  <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ background: `${color}20`, color: color }}>
                    {event.event_type}
                  </div>
                  <div className={`text-xs font-bold ${event.is_paid ? 'text-[#E8A020]' : 'text-[#34C27A]'}`}>
                    {event.is_paid ? `NGN ${event.ticket_price.toLocaleString()}` : 'Free'}
                  </div>
                </div>
                
                <h3 className="text-[15px] font-bold text-white line-clamp-2">{event.title}</h3>
                <div className="text-[12px] text-[#9A9C8E]">by {event.organizer_name}</div>
                
                <div className="mt-auto pt-3 space-y-2">
                  <div className="text-[13px] text-[#EDE8DF] flex items-center gap-2">
                    <span className="opacity-60">📅</span> {new Date(event.start_date).toLocaleDateString('en-NG', { year:'numeric', month:'long', day:'numeric' })}
                  </div>
                  <div className="text-[13px] text-[#EDE8DF] flex items-center gap-2">
                    <span className="opacity-60">{event.is_online ? '🌐' : '📍'}</span> {event.is_online ? 'Online' : event.location}
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-[#555C50] mb-1 uppercase">
                      <span>Registration</span>
                      <span>{event.current_registrations}/{event.max_capacity}</span>
                    </div>
                    <div className="h-1 bg-[#080A07] rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: color }} />
                    </div>
                  </div>

                  <Link href={`/events/${event.slug}`} className="block w-full py-3 bg-[#222820] text-[#EDE8DF] text-center text-xs font-black rounded-xl border border-[#252D22] hover:bg-[#E8A020] hover:text-[#080A07] transition-all mt-2">
                    View Event →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Banner */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 rounded-2xl border border-[rgba(232,160,32,0.3)] bg-gradient-to-br from-[#2A1E06] to-[#1A1208]">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-[#EDE8DF] mb-2">Are you an organizer?</h2>
            <p className="text-sm text-[#9A9C8E]">Create your event and reach thousands of African students and professionals</p>
          </div>
          <Link href="/organizer" className="px-8 py-4 bg-[#E8A020] text-[#090A07] rounded-xl font-bold transition-all hover:scale-105 whitespace-nowrap">
            Host an Event →
          </Link>
        </div>
      </div>
    </main>
  )
}
