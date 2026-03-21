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
      default: return '#EDE8DF'
    }
  }

  return (
    <main className="min-h-screen bg-[#080A07] pt-10 pb-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-syne text-4xl md:text-6xl font-black text-[#EDE8DF] mb-4">Events & Bootcamps</h1>
          <p className="text-[#9A9C8E] max-w-xl mx-auto">Level up your career with community-led learning and networking.</p>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '40px'
        }}>
          {filtered.map(event => {
            const color = getTypeColor(event.event_type)
            const progress = (event.current_registrations / event.max_capacity) * 100
            return (
              <div key={event.id} style={{
                background: '#141710',
                border: '1px solid #252D22',
                borderLeft: `4px solid ${color}`,
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  background: `${color}20`,
                  color: color,
                  padding: '4px 10px',
                  borderRadius: '100px',
                  fontSize: '10px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  width: 'fit-content'
                }}>
                  {event.event_type}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: 'white', margin: 0 }}>{event.title}</h3>
                <div style={{ fontSize: '12px', color: '#9A9C8E' }}>by {event.organizer_name}</div>
                
                <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#EDE8DF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📅</span> {new Date(event.start_date).toLocaleDateString('en-NG', { year:'numeric', month:'long', day:'numeric' })}
                  </div>
                  <div style={{ fontSize: '13px', color: '#EDE8DF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{event.is_online ? '🌐' : '📍'}</span> {event.is_online ? 'Online' : event.location}
                  </div>
                  
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', color: '#555C50', marginBottom: '4px' }}>
                      <span>REGISTRATION</span>
                      <span>{event.current_registrations}/{event.max_capacity}</span>
                    </div>
                    <div style={{ height: '4px', background: '#080A07', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${progress}%`, height: '100%', background: color }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: 'bold', 
                      color: event.is_paid ? '#E8A020' : '#34C27A' 
                    }}>
                      {event.is_paid ? `NGN ${event.ticket_price.toLocaleString()}` : 'Free'}
                    </div>
                    <Link href={`/events/${event.slug}`} style={{
                      padding: '8px 16px',
                      background: '#222820',
                      border: '1px solid #252D22',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      textDecoration: 'none'
                    }}>
                      View Event →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #2A1E06, #1A1208)',
          border: '1px solid rgba(232,160,32,0.3)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'black', color: '#EDE8DF', margin: '0 0 8px 0' }}>Are you an organizer?</h2>
            <p style={{ fontSize: '14px', color: '#9A9C8E', margin: 0 }}>Create your event and reach thousands of African students and professionals</p>
          </div>
          <Link href="/organizer" style={{
            padding: '12px 24px',
            background: '#E8A020',
            color: '#090A07',
            borderRadius: '12px',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            Host an Event →
          </Link>
        </div>
      </div>
    </main>
  )
}
