'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
  {
    id: 'sample-4',
    title: 'AWS Cloud Computing Workshop',
    organizer_name: 'DevCommunity Africa',
    event_type: 'workshop',
    start_date: '2025-05-10T10:00:00Z',
    location: 'Online',
    is_online: true,
    max_capacity: 200,
    current_registrations: 67,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-aws-workshop',
    color: '#34C27A',
  },
  {
    id: 'sample-5',
    title: 'Africa Tech Conference 2025',
    organizer_name: 'AfricaTech Foundation',
    event_type: 'conference',
    start_date: '2025-06-01T08:00:00Z',
    location: 'Accra, Ghana',
    is_online: false,
    max_capacity: 2000,
    current_registrations: 1200,
    is_paid: true,
    ticket_price: 15000,
    slug: 'sample-africa-tech-conference',
    color: '#F97316',
  },
  {
    id: 'sample-6',
    title: 'Mobile App Development Bootcamp',
    organizer_name: 'CodeCamp Nigeria',
    event_type: 'bootcamp',
    start_date: '2025-05-25T09:00:00Z',
    location: 'Abuja, Nigeria',
    is_online: false,
    max_capacity: 30,
    current_registrations: 23,
    is_paid: true,
    ticket_price: 25000,
    slug: 'sample-mobile-bootcamp',
    color: '#E8A020',
  },
]

export default function EventsPage() {
  const [activeType, setActiveType] = useState('all')
  const [events, setEvents] = useState<any[]>(sampleEvents)

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        const items = data.data || []
        if (items.length > 0) setEvents(items)
      })
      .catch(() => {})
  }, [])

  const filteredEvents = activeType === 'all' 
    ? events 
    : events.filter(e => e.event_type === activeType)

  const types = ['all', 'bootcamp', 'workshop', 'webinar', 'meetup', 'conference', 'hackathon']

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bootcamp': return '#E8A020'
      case 'workshop': return '#4A9EE8'
      case 'webinar': return '#34C27A'
      case 'meetup': return '#8B5CF6'
      case 'conference': return '#F97316'
      case 'hackathon': return '#F05050'
      default: return '#EDE8DF'
    }
  }

  return (
    <main className="min-h-screen bg-[#080A07] pt-10 pb-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-syne text-4xl md:text-6xl font-black text-[#EDE8DF] mb-4 tracking-tighter">Events & Bootcamps</h1>
          <p className="text-[#9A9C8E] max-w-xl mx-auto">Level up your career with community-led learning and networking across Africa.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar mb-12 border-b border-[#252D22]">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeType === t ? 'bg-[#E8A020] text-[#080A07]' : 'bg-[#141710] text-[#9A9C8E] border border-[#252D22] hover:bg-[#222820]'
              }`}
            >{t}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredEvents.map(event => {
            const color = getTypeColor(event.event_type)
            return (
              <div key={event.id} className="bg-[#141710] border border-[#252D22] rounded-[2rem] p-8 hover:border-[#E8A020]/50 transition-all group relative flex flex-col" style={{ borderLeft: `4px solid ${color}` }}>
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-[#080A07] rounded-full text-[10px] font-black uppercase text-[#9A9C8E] border border-[#252D22]">{event.event_type}</span>
                  <span className={`text-xs font-bold ${event.is_paid ? 'text-[#E8A020]' : 'text-[#34C27A]'}`}>
                    {event.is_paid ? `NGN ${event.ticket_price.toLocaleString()}` : 'FREE'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#EDE8DF] mb-2 group-hover:text-[#E8A020] transition-colors line-clamp-2">{event.title}</h3>
                <div className="text-xs text-[#555C50] font-medium mb-6">by {event.organizer_name}</div>
                <div className="space-y-3 mb-8">
                  <div className="text-sm text-[#9A9C8E] flex items-center gap-2">📅 {new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-sm text-[#9A9C8E] flex items-center gap-2">{event.is_online ? '🌐 Online' : `📍 ${event.location}`}</div>
                </div>
                <div className="mt-auto">
                  <div className="w-full bg-[#080A07] rounded-full h-1.5 mb-4 overflow-hidden">
                    <div className="h-full" style={{ width: `${(event.current_registrations / (event.max_capacity || 100)) * 100}%`, backgroundColor: color }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-[#555C50] uppercase mb-8">
                    <span>Capacity</span>
                    <span>{event.current_registrations}/{event.max_capacity || '∞'} registered</span>
                  </div>
                  <Link href={`/events/${event.slug}`} className="block w-full py-3.5 bg-[#222820] text-[#EDE8DF] text-center font-black rounded-xl group-hover:bg-[#E8A020] group-hover:text-[#080A07] transition-all">
                    View Event →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="max-w-4xl mx-auto p-12 bg-[#141710] border border-[#E8A020]/20 rounded-[3rem] text-center">
          <h2 className="text-3xl font-black text-[#EDE8DF] mb-6">Are you an organizer?</h2>
          <p className="text-[#9A9C8E] text-lg mb-10">Host your event on OppAlert and reach thousands of African students and professionals.</p>
          <Link href="/organizer" className="px-12 py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:scale-105 transition-all inline-block shadow-glow-amber">
            Host an Event →
          </Link>
        </div>
      </div>
    </main>
  )
}
