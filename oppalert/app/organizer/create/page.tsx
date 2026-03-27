'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PartyPopper, Check, ArrowLeft, Calendar, Globe, MapPin, Tag, DollarSign, Users, Zap, ExternalLink, Mail, Linkedin } from 'lucide-react'

export default function CreateEventPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: 'bootcamp',
    location: '',
    isOnline: false,
    onlineLink: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxCapacity: '',
    isPaid: false,
    ticketPrice: '',
    tags: '',
    isPublished: false,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (!stored) {
        router.push('/login?next=/organizer/create')
        return
      }
      const parsed = JSON.parse(stored)
      if (!parsed?.token) {
        router.push('/login?next=/organizer/create')
        return
      }
      setUser(parsed)
    } catch {
      router.push('/login?next=/organizer/create')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement
    const value = target.type === 'checkbox' 
      ? target.checked 
      : target.value
    setForm(prev => ({ ...prev, [target.name]: value }))
  }

  const handleSubmit = async (isPublished: boolean) => {
    setError('')
    setSubmitting(true)

    try {
      if (!form.title.trim()) {
        setError('Event title is required')
        setSubmitting(false)
        return
      }
      if (!form.startDate) {
        setError('Start date is required')
        setSubmitting(false)
        return
      }

      const token = user?.token
      if (!token) {
        setError('You must be logged in to create an event')
        setSubmitting(false)
        return
      }

      const res = await fetch('/api/organizer/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          isPublished,
          tags: form.tags
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create event. Please try again.')
        return
      }

      setSuccess({
        slug: data.slug,
        title: data.title,
        published: isPublished,
      })
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Create event error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-12 h-12 border-4 border-amber/20 border-t-amber rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-amber opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber/5 blur-[120px] rounded-full animate-pulse-soft" />
        
        <div className="max-w-xl w-full bg-surface/30 backdrop-blur-3xl border border-border/60 rounded-[3rem] p-12 text-center relative z-10 animate-fade-up shadow-premium">
          <div className="w-24 h-24 bg-amber/10 border border-amber/20 rounded-[2rem] flex items-center justify-center text-amber mx-auto mb-8 shadow-glow-amber">
             <PartyPopper size={48} />
          </div>
          <h2 className="font-serif text-4xl font-bold text-primary mb-4 tracking-tight">
            {success.published ? 'Protocol Initiated.' : 'Draft Transmission Saved.'}
          </h2>
          <p className="text-muted font-medium mb-12 leading-relaxed opacity-80">
            {success.published
              ? 'Your event cluster is now live on the global index. Recruiters and students have been notified.'
              : 'Your event data has been stored in our encrypted registers. Deploy it whenever you are ready.'}
          </p>

          {success.published && (
            <div className="bg-bg/40 border border-border/60 rounded-2xl p-6 mb-10 text-left">
              <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3">Live Access Node</div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-amber font-mono truncate">
                  {typeof window !== 'undefined' ? `${window.location.host}/${success.slug}` : `oppfetch.com/${success.slug}`}
                </span>
                <button
                  onClick={async () => {
                    const url = `${window.location.origin}/${success.slug}`
                    await navigator.clipboard.writeText(url)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    copied ? 'bg-emerald text-black' : 'bg-surface border border-border text-muted hover:text-amber hover:border-amber/40'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-10">
             <Link href="/organizer" className="px-8 py-5 bg-amber text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-amber/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
               Dashboard
             </Link>
             <button
               onClick={() => { setSuccess(null); setForm({...form, title: '', description: ''}); }}
               className="px-8 py-5 bg-surface border border-border text-muted font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-surface2 transition-all"
             >
               New Listing
             </button>
          </div>

          {success.published && (
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-border/40">
               <a href="#" className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-amber transition-all"><Mail size={18} /></a>
               <a href="#" className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-amber transition-all"><Linkedin size={18} /></a>
               <a href="#" className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-amber transition-all"><ExternalLink size={18} /></a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pt-32 pb-40 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber/5 blur-[150px] rounded-full -z-10" />
      
      <div className="max-w-3xl mx-auto">
        <Link href="/organizer" className="group inline-flex items-center gap-3 text-amber text-[10px] font-black uppercase tracking-[0.3em] mb-12 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={16} /> Dashboard
        </Link>

        <div className="mb-16">
          <h4 className="text-[10px] font-black text-amber uppercase tracking-[0.4em] mb-4">Organizer Portal</h4>
          <h1 className="font-serif text-5xl md:text-6xl font-black text-primary tracking-tight mb-4">
            Deployment <span className="text-amber italic">Hub.</span>
          </h1>
          <p className="text-muted text-lg font-medium opacity-80 leading-relaxed">
            Configure your next opportunity cluster for the African student ecosystem.
          </p>
        </div>

        {error && (
          <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-3 animate-shake">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <div className="space-y-12">
          {/* Section 1: Core Intelligence */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-1 bg-amber/30 rounded-full" />
              <h3 className="text-[11px] font-black text-muted uppercase tracking-[0.3em]">Core Intelligence</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Event Designation</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-amber transition-colors" size={18} />
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Mandela Rhodes Summit 2025"
                    className="w-full bg-surface/30 border border-border/80 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:border-amber/40 focus:bg-surface/50 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Classification</label>
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  className="w-full bg-surface/30 border border-border/80 rounded-2xl py-4 px-6 text-sm font-bold focus:border-amber/40 focus:bg-surface/50 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="bootcamp">Bootcamp</option>
                  <option value="workshop">Workshop</option>
                  <option value="webinar">Webinar</option>
                  <option value="meetup">Meetup</option>
                  <option value="conference">Conference</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Intelligence Summary</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a detailed breakdown of the opportunity requirements, benefits, and schedule..."
                rows={6}
                className="w-full bg-surface/30 border border-border/80 rounded-3xl p-6 text-sm font-medium leading-relaxed focus:border-amber/40 focus:bg-surface/50 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 2: Temporal Parameters */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-1 bg-amber/30 rounded-full" />
              <h3 className="text-[11px] font-black text-muted uppercase tracking-[0.3em]">Temporal Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Commencement</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-amber transition-colors" size={18} />
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full bg-surface/30 border border-border/80 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:border-amber/40 focus:bg-surface/50 outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Conclusion</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-amber transition-colors" size={18} />
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full bg-surface/30 border border-border/80 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:border-amber/40 focus:bg-surface/50 outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Physical & Digital Presence */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-1 bg-amber/30 rounded-full" />
              <h3 className="text-[11px] font-black text-muted uppercase tracking-[0.3em]">Presence Mode</h3>
            </div>
            
            <div className="p-8 bg-surface/30 border border-border/80 rounded-[2.5rem] space-y-8">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative w-12 h-6 bg-border/40 rounded-full transition-colors group-hover:bg-border/60">
                  <input
                    type="checkbox"
                    name="isOnline"
                    checked={form.isOnline}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-muted rounded-full transition-all peer-checked:left-7 peer-checked:bg-amber" />
                </div>
                <div>
                  <span className="text-sm font-black text-primary uppercase tracking-widest block mb-0.5">Digital Overide</span>
                  <span className="text-[11px] text-muted font-medium">Toggle for virtual/online clusters</span>
                </div>
              </label>

              {form.isOnline ? (
                <div className="space-y-3 animate-fade-down">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Access URL</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-amber transition-colors" size={18} />
                    <input
                      name="onlineLink"
                      value={form.onlineLink}
                      onChange={handleChange}
                      placeholder="https://meet.nexus.com/..."
                      className="w-full bg-bg/40 border border-border/80 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:border-amber/40 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-down">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Physical Node</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-amber transition-colors" size={18} />
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Civic Center, Victoria Island, Lagos"
                      className="w-full bg-bg/40 border border-border/80 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:border-amber/40 outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Economic Parameters */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-1 bg-amber/30 rounded-full" />
              <h3 className="text-[11px] font-black text-muted uppercase tracking-[0.3em]">Economic Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="p-8 bg-surface/30 border border-border/80 rounded-[2.5rem] space-y-6">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative w-12 h-6 bg-border/40 rounded-full transition-colors group-hover:bg-border/60">
                    <input
                      type="checkbox"
                      name="isPaid"
                      checked={form.isPaid}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-muted rounded-full transition-all peer-checked:left-7 peer-checked:bg-amber" />
                  </div>
                  <span className="text-sm font-black text-primary uppercase tracking-widest">Entry Fee Required</span>
                </label>

                {form.isPaid && (
                  <div className="space-y-3 animate-fade-down">
                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Fee Amount (NGN)</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-amber transition-colors" size={18} />
                      <input
                        type="number"
                        name="ticketPrice"
                        value={form.ticketPrice}
                        onChange={handleChange}
                        placeholder="e.g. 15000"
                        className="w-full bg-bg/40 border border-border/80 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:border-amber/40 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Node Capacity</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-amber transition-colors" size={18} />
                  <input
                    type="number"
                    name="maxCapacity"
                    value={form.maxCapacity}
                    onChange={handleChange}
                    placeholder="Infinite if empty"
                    className="w-full bg-surface/30 border border-border/80 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:border-amber/40 focus:bg-surface/50 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="pt-12 flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="flex-1 px-10 py-5 bg-surface border border-border rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-muted hover:bg-surface2 transition-all disabled:opacity-50"
            >
              {submitting ? 'Syncing...' : 'Save Draft Segment'}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="flex-1 group relative px-10 py-5 bg-amber text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl shadow-amber/10 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="flex items-center justify-center gap-3 relative z-10">
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Zap size={16} />
                )}
                <span>Deploy Node Cluster</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
