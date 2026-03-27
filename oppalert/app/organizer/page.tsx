"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Calendar, TrendingUp, Share2, Copy, Twitter, Plus, ChevronRight, BarChart3, Globe, Sparkles } from "lucide-react"

export default function OrganizerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    pageViews: 0,
    conversionRate: 0
  })
  const [copyingId, setCopyingId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem("user")
        if (!stored) {
          router.push("/login?next=/organizer")
          return
        }
        const parsed = JSON.parse(stored)
        if (!parsed?.email || !parsed?.token) {
          router.push("/login?next=/organizer")
          return
        }
        setUser(parsed)
        
        const res = await fetch("/api/organizer/events", {
          headers: { "Authorization": `Bearer ${parsed.token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const eventList = data.data || []
          setEvents(eventList as never[])
          
          const active = eventList.filter((e: any) => e.is_active).length || 0
          const totalRegs = eventList.reduce((acc: number, curr: any) => acc + (curr.current_registrations || 0), 0) || 0
          const views = totalRegs * 4 + 10 
          setStats({
            activeEvents: active,
            totalRegistrations: totalRegs,
            upcomingEvents: active,
            pageViews: views,
            conversionRate: views > 0 ? Math.round((totalRegs / views) * 100) : 0
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber/10 blur-[120px] rounded-full" />
        <div className="w-12 h-12 border-4 border-amber border-t-transparent rounded-full animate-spin mb-6 relative z-10" />
        <p className="text-muted font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse relative z-10">Initializing Dashboard</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-bg pt-32 pb-32 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-amber uppercase tracking-[0.4em] mb-4">Organizer Portal</h4>
            <h1 className="font-serif text-5xl md:text-6xl font-black text-primary tracking-tight">
               Event <span className="text-amber italic">Hub.</span>
            </h1>
            <p className="text-muted text-lg max-w-xl font-medium pt-2">
              Transforming communities, one event at a time. Welcome back, <span className="text-primary font-bold">{user?.fullName || user?.full_name}</span>.
            </p>
          </div>
          <Link href="/organizer/create" className="group relative px-10 py-5 bg-amber text-black font-black uppercase text-xs tracking-widest rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber/10 flex items-center gap-3">
            <Plus size={18} /> Create New Event
          </Link>
        </div>

        {/* Plan Feature Highlight */}
        {(user?.status === 'free' || !user?.status) && (
          <div className="mb-16 p-8 bg-surface/30 backdrop-blur-3xl border border-border/60 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 via-transparent to-transparent opacity-50 transition-opacity group-hover:opacity-80" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-emerald text-black rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald/20 animate-pulse">
                   <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-primary mb-1">Standard Access Active</h4>
                  <p className="text-sm text-muted font-medium">You have unlimited event creation in our current system. Share your unique links to grow.</p>
                </div>
              </div>
              <Link href="/pricing" className="px-8 py-4 bg-surface2 border border-border rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-amber/40 hover:text-amber transition-all">
                Boost Visibility &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-8 bg-surface/40 backdrop-blur-xl border border-border/80 rounded-[2.5rem] group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={120} className="text-emerald" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Total Attendees</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-serif font-black text-primary">{stats.totalRegistrations}</span>
                <span className="text-[10px] font-bold text-emerald">+12%</span>
              </div>
              <div className="h-1.5 w-full bg-bg/50 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald w-[65%] rounded-full shadow-glow-emerald" />
              </div>
            </div>
          </div>

          <div className="p-8 bg-surface/40 backdrop-blur-xl border border-border/80 rounded-[2.5rem] group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Calendar size={120} className="text-amber" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Live Sessions</p>
              <div className="flex items-baseline gap-2 mb-4">
                 <span className="text-5xl font-serif font-black text-primary">{stats.activeEvents}</span>
                 <span className="text-[10px] font-bold text-amber">Active</span>
              </div>
              <div className="flex gap-1.5">
                   {[3, 5, 4, 7, 5].map((h, i) => (
                      <div key={i} className={`flex-1 rounded-full bg-amber/${i * 20 + 20}`} style={{ height: h * 4 }} />
                   ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-surface/40 backdrop-blur-xl border border-border/80 rounded-[2.5rem] group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <BarChart3 size={120} className="text-indigo-400" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Conversion</p>
              <div className="flex items-baseline gap-2 mb-2">
                 <span className="text-5xl font-serif font-black text-primary">{stats.conversionRate}%</span>
              </div>
              <div className="w-full h-8 flex items-end gap-1">
                 {Array.from({length: 12}).map((_, i) => (
                    <div key={i} className="flex-1 bg-indigo-400/20 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
                 ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-surface/40 backdrop-blur-xl border border-border/80 rounded-[2.5rem] group relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Globe size={120} className="text-white" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Page Traffic</p>
              <div className="text-5xl font-serif font-black text-primary mb-2">{(stats.pageViews / 1000).toFixed(1)}k</div>
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest leading-relaxed">Estimated unique page discoveries over 30 days.</p>
            </div>
          </div>
        </div>

        {/* EVENTS SECTION */}
        <div className="bg-surface/30 backdrop-blur-3xl border border-border/60 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-border/40 flex justify-between items-center bg-bg/20">
            <div>
              <h3 className="font-serif text-2xl font-bold text-primary mb-1">Your Events</h3>
              <p className="text-xs text-muted font-medium">Manage and monitor your upcoming and past events.</p>
            </div>
            <div className="px-5 py-2 bg-surface2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted border border-border">
               {events.length} listings
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {events.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg/40">
                    <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Event Identity</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Timeline</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Registrations</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-[0.3em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {events.map((event: any) => (
                    <tr key={event.id} className="hover:bg-surface2/30 transition-all duration-300 group">
                      <td className="px-10 py-8">
                         <div className="flex flex-col">
                            <span className="font-bold text-primary text-lg mb-1 group-hover:text-amber transition-colors">{event.title}</span>
                            <span className="text-[10px] font-black text-muted uppercase tracking-widest opacity-60 flex items-center gap-2">
                               <div className="w-1 h-1 rounded-full bg-amber" /> {event.event_type}
                            </span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-3 text-sm font-medium text-muted">
                            <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center text-primary text-[10px] font-bold">
                               {new Date(event.start_date).getDate()}
                            </div>
                            {new Date(event.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-2">
                          <div className="flex items-end justify-between text-xs font-bold mb-1">
                            <span className="text-primary">{event.current_registrations} <span className="text-muted font-medium italic">joined</span></span>
                            <span className="text-muted opacity-40">limit: {event.max_capacity || "∞"}</span>
                          </div>
                          <div className="w-40 h-1.5 bg-bg/50 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-amber rounded-full" 
                                style={{ width: `${Math.min(100, (event.current_registrations / (event.max_capacity || 100)) * 100)}%` }} 
                             />
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          event.is_published 
                            ? "bg-emerald/10 text-emerald border border-emerald/20" 
                            : "bg-amber/10 text-amber border border-amber/20"
                        }`}>
                           <div className={`w-1 h-1 rounded-full ${event.is_published ? 'bg-emerald' : 'bg-amber'} animate-pulse`} />
                           {event.is_published ? "Live" : "Draft"}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/organizer/events/${event.id}`}>
                            <button className="px-6 py-2.5 bg-surface text-primary border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber hover:text-amber transition-all shadow-sm">
                              Detail &rarr;
                            </button>
                          </Link>
                          <div className="flex items-center gap-1 bg-surface2/50 backdrop-blur border border-border p-1 rounded-xl">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`https://OppFetch.vercel.app/events/${event.slug}`);
                                setCopyingId(event.id);
                                setTimeout(() => setCopyingId(null), 2000);
                              }}
                              className="p-2.5 hover:bg-surface rounded-lg transition-colors text-muted hover:text-amber"
                            >
                              {copyingId === event.id ? <div className="text-[10px] font-bold text-emerald px-1">Copied!</div> : <Copy size={16} />}
                            </button>
                            <a 
                              href={`https://wa.me/?text=${encodeURIComponent(`Join me at ${event.title}: https://OppFetch.vercel.app/events/${event.slug}`)}`}
                              target="_blank"
                              className="p-2.5 hover:bg-surface rounded-lg transition-colors text-muted hover:text-emerald"
                            >
                              <Share2 size={16} />
                            </a>
                            <a 
                              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://OppFetch.vercel.app/events/${event.slug}`)}&text=${encodeURIComponent(`Register for ${event.title} on OppFetch!`)}`}
                              target="_blank"
                              className="p-2.5 hover:bg-surface rounded-lg transition-colors text-muted hover:text-indigo-400"
                            >
                              <Twitter size={16} />
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-32 px-10 text-center bg-surface/20">
                <div className="w-24 h-24 bg-surface2 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8 opacity-50 grayscale">
                    📅
                </div>
                <h4 className="font-serif text-3xl font-bold text-primary mb-4">No events found</h4>
                <p className="text-muted text-lg max-w-sm mx-auto mb-10 leading-relaxed">
                  Start creating your first impact-driven event today and reach thousands of Africans.
                </p>
                <Link href="/organizer/create" className="px-12 py-5 bg-amber text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-amber/20 inline-flex items-center gap-3">
                   Create First Event <ChevronRight size={18} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
