'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-[#080A07] pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="font-syne text-4xl md:text-6xl font-black text-[#EDE8DF] mb-6">
            Next-Gen <span className="text-[#E8A020]">Events.</span>
          </h1>
          <p className="text-[#9A9C8E] text-lg max-w-2xl leading-relaxed">
            Discover workshops, webinars, and meetups designed to accelerate 
            your professional growth in Africa.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {['all', 'bootcamp', 'workshop', 'webinar', 'meetup', 'hackathon'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-6 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${
                typeFilter === type
                  ? 'bg-[#E8A020] border-[#E8A020] text-[#080A07]'
                  : 'bg-[#141710] border-[#252D22] text-[#9A9C8E] hover:border-[#E8A020]'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-[#141710] border border-[#252D22] rounded-[2rem] p-8 hover:border-[#E8A020]/50 transition-all group flex flex-col"
              style={{ borderLeft: `5px solid ${event.color || '#E8A020'}` }}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-[#080A07] rounded-full text-[10px] font-black uppercase text-[#9A9C8E] border border-[#252D22]">
                  {event.event_type}
                </span>
                <span className="text-[#E8A020] text-xs font-bold">
                  {event.is_paid ? `NGN ${Number(event.ticket_price).toLocaleString()}` : 'FREE'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-[#EDE8DF] mb-3 group-hover:text-[#E8A020] transition-colors line-clamp-2">
                {event.title}
              </h3>
              
              <p className="text-[#555C50] text-sm mb-6 line-clamp-2 leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-3 mb-8 flex-grow">
                <div className="text-sm text-[#9A9C8E] flex items-center gap-2">
                  📅 {new Date(event.start_date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="text-sm text-[#9A9C8E] flex items-center gap-2">
                  {event.is_online ? '🌐 Online' : `📍 ${event.location}`}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-[#252D22]/50">
                <div className="w-full bg-[#080A07] rounded-full h-1.5 mb-4 overflow-hidden">
                  <div 
                    className="h-full bg-[#E8A020]" 
                    style={{ width: `${Math.min((event.current_registrations / (event.max_capacity || 100)) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-[#555C50] uppercase mb-8">
                  <span>Capacity</span>
                  <span>{event.current_registrations}/{event.max_capacity || '∞'} Booked</span>
                </div>
                
                <Link 
                  href={`/events/${event.slug}`}
                  className="block w-full py-4 bg-[#222820] text-[#EDE8DF] text-center font-black rounded-xl hover:bg-[#E8A020] hover:text-[#080A07] transition-all"
                >
                  View Details & Register
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
