'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Users, Coins, ArrowLeft, Share2, Globe, Check, Zap, Mail, Phone, User, ExternalLink, ShieldCheck, Clock } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

export default function EventDetailPage() {
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

  // Fire-and-forget view tracking
  useEffect(() => {
    if (!slug || slug.startsWith('sample-')) return
    fetch(`/api/events/${slug}/view`, { method: 'POST' }).catch(() => {})
  }, [slug])

  useEffect(() => {
    if (!slug) return

    // Handle sample events
    if (slug.startsWith('sample-')) {
      setEvent({
        title: slug.replace('sample-', '').replace(/-/g, ' '),
        description: 'Join this exclusive bootcamp for African tech talent. Master high-demand skills and connect with top mentors in the industry.\n\nParticipants will engage in high-intensity technical sessions, collaborative lab work, and direct networking with ecosystem leaders. This is a high-impact node cluster specifically designed for those ready to scale their absolute potential.',
        event_type: 'bootcamp',
        start_date: new Date().toISOString(),
        location: 'Lagos, Nigeria',
        is_online: false,
        max_capacity: 100,
        current_registrations: 42,
        is_paid: false,
        ticket_price: 0,
        organizer_name: 'OppAlert Nexus',
        is_published: true,
        slug,
      })
      setLoading(false)
      return
    }

    // Fetch real event
    fetch(`/api/events/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.data) {
          setEvent(data.data)
        } else {
          setError('Event cluster not found')
        }
      })
      .catch(() => setError('Failed to synchronize event data'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    setRegLoading(true)

    try {
      if (!regForm.fullName || !regForm.email) {
        setRegError('Full identity and email vector required')
        return
      }

      const res = await fetch(
        `/api/events/${slug}/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: regForm.fullName,
            email: regForm.email,
            phone: regForm.phone,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setRegError(data.error || 'Registration failed')
        return
      }

      setRegSuccess(true)
    } catch {
      setRegError('Failed to synchronize registration segment')
    } finally {
      setRegLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin" />
          <p className="text-muted font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Syncing Event Node...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-6 text-center">
        <div className="w-24 h-24 bg-surface/30 rounded-[2rem] border border-border flex items-center justify-center text-4xl mb-10 shadow-premium">🎪</div>
        <h1 className="font-serif text-4xl font-bold text-primary mb-6">Cluster Not Found.</h1>
        <p className="text-muted mb-12 max-w-md font-medium leading-relaxed opacity-80">The requested event node has been de-indexed or the transmission link is broken.</p>
        <Link href="/events">
          <button className="px-10 py-5 bg-emerald text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald/10">
            Browse Neural Hub
          </button>
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-40 px-6 relative overflow-hidden bg-bg">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald/5 blur-[150px] rounded-full -z-10 animate-pulse-soft" />
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-emerald/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <Link href="/events" className="group inline-flex items-center gap-3 text-emerald text-[10px] font-black uppercase tracking-[0.3em] mb-12 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 items-start">
          
          {/* Main Details Cluster */}
          <div className="space-y-16">
            <ScrollReveal>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald/20 to-transparent rounded-[3rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
                <div className="bg-surface/30 backdrop-blur-xl border border-border/60 rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden shadow-premium">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/5 blur-[80px] -z-10" />
                  
                  <div className="flex flex-wrap items-center gap-4 mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald/10 border border-emerald/20 rounded-full text-[9px] font-black text-emerald uppercase tracking-[0.2em]">
                      <Zap size={14} />
                      {event.event_type}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald/10 border border-emerald/20 rounded-full text-[9px] font-black text-emerald uppercase tracking-[0.2em]">
                      <ShieldCheck size={14} /> Verified Node
                    </div>
                  </div>

                  <h1 className="font-serif text-5xl md:text-7xl font-black text-primary leading-none mb-10 tracking-tight">
                    {event.title}
                  </h1>

                  <div className="flex items-center gap-6 mb-12 p-1 pt-0">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-emerald text-black flex items-center justify-center font-serif font-black text-2xl shadow-glow-emerald">
                      {event.organizer_name?.[0] || 'O'}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-1.5 opacity-60">Architected By</p>
                      <p className="text-xl font-bold text-primary tracking-tight">{event.organizer_name || 'OppAlert Nexus'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { icon: <Calendar className="text-emerald" size={20} />, label: 'Temporal Node', text: new Date(event.start_date || new Date()).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) },
                      { icon: <Clock className="text-emerald" size={20} />, label: 'Standard Time', text: new Date(event.start_date || new Date()).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }) },
                      { icon: event.is_online ? <Globe className="text-emerald" size={20} /> : <MapPin className="text-emerald" size={20} />, label: 'Deployment Mode', text: event.is_online ? 'Digital Experience' : event.location },
                      { icon: <Users className="text-emerald" size={20} />, label: 'Capacity Status', text: event.max_capacity ? (event.max_capacity - (event.current_registrations || 0)) + ' slots available' : 'Unlimited Node Access' },
                    ].map((chip) => (
                      <div key={chip.label} className="bg-bg/40 border border-border/80 rounded-[2rem] p-8 hover:border-emerald/30 transition-all group/item shadow-inner">
                         <div className="flex items-center gap-3 text-muted mb-4 text-[10px] uppercase font-black tracking-[0.3em] group-hover/item:text-emerald transition-colors">
                            {chip.icon} {chip.label}
                         </div>
                         <p className="text-sm font-bold text-primary leading-tight opacity-90">{chip.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="bg-surface/30 backdrop-blur-xl border border-border/60 rounded-[3rem] p-10 md:p-16 space-y-12">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-surface/50 border border-border flex items-center justify-center text-emerald shadow-xl group-hover:scale-110 transition-transform"><Globe size={32} /></div>
                   <h2 className="font-serif text-3xl font-black text-primary tracking-tight">Technical Breakdown.</h2>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none">
                  <div className="text-muted text-xl leading-relaxed whitespace-pre-line font-serif italic text-primary/80 mb-12 border-l-4 border-emerald/30 pl-10">
                    Join this immersive neural cluster designed to synchronize your trajectory with the highest industry standards.
                  </div>
                  <div className="text-muted text-lg leading-relaxed whitespace-pre-line font-medium opacity-90">
                    {event.description}
                  </div>
                </div>
                
                <div className="pt-12 border-t border-border/40 flex flex-wrap gap-8">
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald shadow-lg"><Check size={14} /></div>
                      <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Verified Listing</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald shadow-lg"><Zap size={14} /></div>
                      <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Priority Access</span>
                   </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Sidebar — Registration Interface */}
          <aside className="space-y-10 lg:sticky lg:top-32">
            <ScrollReveal delay={200}>
              <div className="bg-surface/30 backdrop-blur-3xl border border-border/60 rounded-[3.5rem] p-10 relative overflow-hidden group shadow-premium">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-12">
                  <h3 className="font-serif text-2xl font-bold text-primary leading-tight">Sync <br/>Your Spot.</h3>
                  <div className="px-5 py-2.5 bg-emerald/10 border border-emerald/20 rounded-2xl text-2xl font-black text-emerald tracking-tighter shadow-glow-emerald">
                    {event.is_paid ? '₦' + Number(event.ticket_price).toLocaleString() : 'FREE'}
                  </div>
                </div>

                {regSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-emerald/10 text-emerald rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner border border-emerald/20 animate-scale-up">✓</div>
                    <h4 className="font-serif text-3xl font-bold text-white mb-4 tracking-tight">Node Sync Complete.</h4>
                    <p className="text-muted text-sm leading-relaxed mb-12 font-medium opacity-80">Registration successful. Check your email for identity verification and entry vectors.</p>
                    <button onClick={() => setRegSuccess(false)} className="text-[10px] font-black text-emerald uppercase tracking-[0.3em] hover:opacity-70 transition-all">Add another Participant</button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-6">
                    {regError && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-red-500 text-xs font-bold mb-6 flex items-center gap-4 animate-shake">
                        <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-lg">!</div>
                        {regError}
                      </div>
                    )}

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-60">Identity designation</label>
                      <div className="relative group/input">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-emerald transition-colors" size={20} />
                        <input
                          type="text"
                          placeholder="Chidi Okafor"
                          required
                          value={regForm.fullName}
                          onChange={e => setRegForm(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full pl-14 pr-6 py-5 bg-bg/40 border border-border/80 rounded-[1.5rem] text-primary text-sm font-bold focus:border-emerald/50 focus:bg-surface/50 outline-none transition-all placeholder:text-muted/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-60">Digital Vector (Email)</label>
                      <div className="relative group/input">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-emerald transition-colors" size={20} />
                        <input
                          type="email"
                          placeholder="chidi@nexus.com"
                          required
                          value={regForm.email}
                          onChange={e => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-14 pr-6 py-5 bg-bg/40 border border-border/80 rounded-[1.5rem] text-primary text-sm font-bold focus:border-emerald/50 focus:bg-surface/50 outline-none transition-all placeholder:text-muted/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5 pb-2">
                       <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-1 opacity-60">Phone link (Optional)</label>
                       <div className="relative group/input">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-emerald transition-colors" size={20} />
                        <input
                          type="tel"
                          placeholder="+234 XXX XXX XXXX"
                          value={regForm.phone}
                          onChange={e => setRegForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-14 pr-6 py-5 bg-bg/40 border border-border/80 rounded-[1.5rem] text-primary text-sm font-bold focus:border-emerald/50 focus:bg-surface/50 outline-none transition-all placeholder:text-muted/20"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full py-6 bg-emerald text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-[1.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-emerald/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {regLoading ? 'Processing...' : (
                          <>Deploy Registration <ExternalLink size={16} /></>
                        )}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/10 transition-transform origin-left scale-x-0 group-hover:scale-x-100" />
                    </button>

                    <p className="text-[9px] text-muted text-center pt-4 font-black uppercase tracking-[0.4em] opacity-40">
                       Encrypted Transaction · 256-bit Node Sig
                    </p>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Share Interface */}
            <ScrollReveal delay={300}>
              <div className="bg-surface/30 backdrop-blur-xl border border-border/60 rounded-[3rem] p-8 shadow-premium">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center text-emerald"><Share2 size={18} /></div>
                  <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Broadcast Node</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        const el = document.getElementById('copy-status')
                        if (el) {
                            el.textContent = 'COPIED!'
                            setTimeout(() => el.textContent = 'LINK CLONE', 2000)
                        }
                    }}
                    className="py-4 bg-surface2 border border-border rounded-2xl text-[10px] font-black text-muted hover:text-emerald transition-all uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02]"
                  >
                    <span id="copy-status">LINK CLONE</span>
                  </button>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Syncing with ' + event.title + ' on OppAlert.')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    className="py-4 bg-surface2 border border-border rounded-2xl flex items-center justify-center text-muted hover:text-emerald transition-all shadow-xl hover:scale-[1.02]"
                  >
                    <Share2 size={18} />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </aside>

        </div>
      </div>
    </main>
  )
}
