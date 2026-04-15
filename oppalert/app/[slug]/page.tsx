'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Globe, Users, Share2, ArrowLeft, Check, Sparkles } from 'lucide-react'

export default function BrandedEventPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [regForm, setRegForm] = useState({
    fullName: '', email: '', phone: '',
  })
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    if (!slug) return

    // Handle sample events for testing
    if (slug.startsWith('sample-')) {
      setEvent({
        title: slug.replace('sample-', '').replace(/-/g, ' '),
        description: 'Sample branded event description for verification.',
        event_type: 'workshop',
        start_date: new Date().toISOString(),
        location: 'Branded Venue',
        is_online: false,
        max_capacity: 100,
        current_registrations: 5,
        is_paid: false,
        ticket_price: 0,
        organizer_name: 'OppFetch',
        is_published: true,
        slug,
      })
      setLoading(false)
      return
    }

    // Fetch real event from API
    fetch(`/api/events/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.data) {
          setEvent(data.data)
          // Fire view track
          fetch(`/api/events/${slug}/view`, { method: 'POST' }).catch(() => {})
        } else {
          setError('Event not found')
        }
      })
      .catch(() => setError('Failed to load event'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    setRegLoading(true)

    try {
      if (!regForm.fullName || !regForm.email) {
        setRegError('Name and email are required')
        setRegLoading(false)
        return
      }

      const res = await fetch(`/api/events/${slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      })

      const data = await res.json()
      if (!res.ok) {
        setRegError(data.error || 'Registration failed')
        return
      }

      setRegSuccess(true)
    } catch {
      setRegError('Connection error. Please try again.')
    } finally {
      setRegLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080A07] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !event) {
    // If it's not a valid event slug, return null to let Next.js potentially handle other cases or show 404
    // But since this is a catch-all, we should show a nice 404 UI
    return (
      <div className="min-h-screen bg-[#080A07] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-bg2 rounded-[2rem] flex items-center justify-center mb-8 rotate-12">
          <span className="text-4xl text-emerald">🎪</span>
        </div>
        <h1 className="font-syne text-3xl font-black text-primary mb-4">Event Not Found</h1>
        <p className="text-muted mb-8 max-w-sm">The branded link you followed doesn&apos;t exist or has been moved.</p>
        <Link href="/events" className="btn-primary px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">
          Browse All Events
        </Link>
      </div>
    )
  }

  const startDate = new Date(event.start_date)
  const isPast = new Date() > new Date(event.end_date || event.start_date)

  return (
    <main className="min-h-screen bg-[#080A07] text-primary pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <Link href="/events" className="inline-flex items-center gap-2 text-subtle hover:text-emerald transition-colors mb-12 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Hub
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
          {/* Main Info */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald/10 border border-emerald/20 rounded-full text-emerald text-[10px] font-black uppercase tracking-widest mb-8">
              <Sparkles size={12} /> {event.event_type}
            </div>

            <h1 className="font-syne text-4xl md:text-6xl font-black leading-[1.1] mb-8 lg:pr-12">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-8 mb-12 border-y border-white/5 py-8">
              <div>
                <p className="text-[10px] font-black text-subtle uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Calendar size={12} className="text-emerald" /> Date & Time
                </p>
                <p className="text-sm font-bold text-primary">
                  {startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs text-muted mt-1">Starting {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-subtle uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MapPin size={12} className="text-emerald" /> Location
                </p>
                <p className="text-sm font-bold text-primary">{event.is_online ? 'Remote / Online' : event.location}</p>
                {event.is_online && <p className="text-xs text-emerald mt-1 font-bold">Zoom/Meet link shared after RSVP</p>}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-syne text-xl font-black text-emerald uppercase tracking-widest">Details</h3>
              <p className="text-muted leading-relaxed whitespace-pre-line text-lg">
                {event.description}
              </p>
            </div>
            
            <div className="mt-12 p-8 bg-bg2 rounded-[2rem] border border-border">
               <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-4">Organized By</p>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald flex items-center justify-center font-black text-[#080A07]">
                    {event.organizer_name?.[0] || 'O'}
                  </div>
                  <div>
                    <p className="font-black text-primary">{event.organizer_name || 'OppFetch Community'}</p>
                    <p className="text-xs text-subtle uppercase font-bold tracking-widest">Verified Host</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Registration Sidebar */}
          <aside className="sticky top-32 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="glass-card rounded-[2.5rem] p-8 lg:p-10 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/5 blur-3xl -z-10" />
              
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">Standard Entry</p>
                  <p className="text-3xl font-black text-primary">
                    {event.is_paid ? `₦${Number(event.ticket_price).toLocaleString()}` : 'Free'}
                  </p>
                </div>
                <div className="text-right">
                   <Users size={20} className="text-emerald ml-auto mb-1" />
                   <p className="text-[10px] font-bold text-muted uppercase">{event.current_registrations}/{event.max_capacity || '∞'} RSVPs</p>
                </div>
              </div>

              {regSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#34C27A] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-green rotate-3">
                    <Check size={32} className="text-[#080A07] stroke-[3]" />
                  </div>
                  <h3 className="font-syne text-xl font-black text-primary mb-2">You&apos;re In!</h3>
                  <p className="text-sm text-subtle leading-relaxed mb-8">Confirmation sent to <span className="text-primary font-bold">{regForm.email}</span></p>
                  <button onClick={() => setRegSuccess(false)} className="text-[10px] font-black text-emerald uppercase tracking-widest hover:underline">
                    Register another person
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  {regError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                      {regError}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      className="w-full bg-[#141710] border border-white/5 rounded-xl px-5 py-4 text-sm font-medium focus:border-emerald/50 outline-none transition-all placeholder:text-white/20"
                      value={regForm.fullName}
                      onChange={e => setRegForm({...regForm, fullName: e.target.value})}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full bg-[#141710] border border-white/5 rounded-xl px-5 py-4 text-sm font-medium focus:border-emerald/50 outline-none transition-all placeholder:text-white/20"
                      value={regForm.email}
                      onChange={e => setRegForm({...regForm, email: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={regLoading || isPast}
                    className="w-full bg-emerald text-[#080A07] font-black uppercase text-[10px] tracking-[0.2em] py-5 rounded-2xl shadow-glow-emerald hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 mt-4"
                  >
                    {isPast ? 'Event Ended' : regLoading ? 'RSVPing...' : 'Register for Event'}
                  </button>

                  <p className="text-[9px] text-center text-subtle font-bold uppercase tracking-widest mt-6">
                    By registering you agree to OppFetch Terms
                  </p>
                </form>
              )}
            </div>

            {/* Share Loop */}
            <div className="mt-8 flex flex-col items-center">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  setShared(true)
                  setTimeout(() => setShared(false), 2000)
                }}
                className="flex items-center gap-2 text-subtle hover:text-emerald transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                <Share2 size={16} /> {shared ? 'Copied Branded Link!' : 'Copy Branded URL'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
