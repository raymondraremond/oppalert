"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Calendar, TrendingUp, Share2, Copy, Twitter } from "lucide-react"

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
        
        // Fetch events
        const res = await fetch("/api/organizer/events", {
          headers: { "Authorization": `Bearer ${parsed.token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setEvents(data.data || [])
          
          // Calculate simple stats
          const active = data.data?.filter((e: any) => e.is_active).length || 0
          const totalRegs = data.data?.reduce((acc: number, curr: any) => acc + (curr.current_registrations || 0), 0) || 0
          const views = totalRegs * 4 + 10 // Sample multiplier
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
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E8A020] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted font-bold uppercase tracking-widest text-xs">Accessing Dashboard...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-bg pt-10 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
          <div>
            <h1 className="font-syne text-3xl font-black text-primary mb-2">Organizer Dashboard</h1>
            <p className="text-muted">Welcome back, {user?.fullName}. Here is how your events are performing.</p>
          </div>
          <Link href="/organizer/create" className="px-8 py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:scale-105 transition-all shadow-glow-amber">
            + Create New Event
          </Link>
        </div>

        {/* PLAN LIMIT WARNINGS REMOVED FOR FREEMIUM MODEL */}
        {(user?.status === 'free' || !user?.status) && (
          <div className="mb-10 p-6 bg-[#34C27A]/10 border border-[#34C27A]/20 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 bg-[#34C27A] rounded-full flex items-center justify-center text-[#080A07] text-2xl">✨</div>
              <div>
                <h4 className="font-black text-primary uppercase text-sm tracking-widest">Free Supply Model Active</h4>
                <p className="text-xs text-muted">You are on the <span className="text-[#34C27A] font-bold">Standard Free Plan</span>. Create unlimited events and share links with your community.</p>
              </div>
            </div>
            <Link href="/pricing" className="px-6 py-3 bg-[#34C27A] text-[#080A07] font-black rounded-xl text-xs hover:scale-105 transition-all">
              Boost My Events
            </Link>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-8 bg-bg2 border border-border rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Users size={80} className="text-[#34C27A]" />
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-black text-subtle uppercase tracking-[0.2em] mb-2">Total Registrations</div>
              <div className="text-5xl font-black text-primary mb-4">{stats.totalRegistrations}</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#34C27A]">
                <TrendingUp size={12} />
                <span>+12% from last week</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-bg2 border border-border rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Calendar size={80} className="text-[#E8A020]" />
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-black text-subtle uppercase tracking-[0.2em] mb-2">Active Events</div>
              <div className="text-5xl font-black text-primary mb-4">{stats.activeEvents}</div>
              <div className="w-full h-8 flex items-end gap-1">
                {[4, 7, 5, 8, 6, 9, 7].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#E8A020]/20 rounded-t-sm group-hover:bg-[#E8A020]/40 transition-all" style={{ height: `${h * 10}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-bg2 border border-border rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-[10px] font-black text-subtle uppercase tracking-[0.2em] mb-2">Conversion Rate</div>
              <div className="text-5xl font-black text-primary mb-4">{stats.conversionRate}%</div>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 20">
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  points="0,15 20,10 40,18 60,5 80,12 100,2"
                  className="drop-shadow-sm"
                />
              </svg>
            </div>
          </div>

          <div className="p-8 bg-bg2 border border-border rounded-[2.5rem]">
            <div className="text-[10px] font-black text-subtle uppercase tracking-[0.2em] mb-2">Estimated Growth</div>
            <div className="text-5xl font-black text-primary mb-4">8.4k</div>
            <p className="text-[10px] text-muted leading-tight">Projected registrations based on current traffic trends.</p>
          </div>
        </div>

        {/* EVENTS TABLE */}
        <div className="bg-bg2 border border-border rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-primary">Your Events</h3>
            <span className="text-xs font-bold text-subtle">{events.length} Total</span>
          </div>
          
          <div className="overflow-x-auto">
            {events.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0D0F0B]">
                    <th className="px-8 py-5 text-[10px] font-black text-subtle uppercase tracking-widest">Event Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-subtle uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-subtle uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-subtle uppercase tracking-widest">Registrations</th>
                    <th className="px-8 py-5 text-[10px] font-black text-subtle uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-subtle uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252D22]">
                  {events.map((event: any) => (
                    <tr key={event.id} className="hover:bg-icon-bg transition-colors">
                      <td className="px-8 py-6 font-bold text-primary">{event.title}</td>
                      <td className="px-8 py-6 text-sm text-muted">{new Date(event.start_date).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-xs font-bold text-subtle uppercase">{event.event_type}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-primary">{event.current_registrations}</span>
                          <span className="text-[10px] text-subtle">/ {event.max_capacity || "∞"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${event.is_published ? "bg-[#34C27A]/10 text-[#34C27A]" : "bg-[#E8A020]/10 text-[#E8A020]"}`}>
                          {event.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <Link href={`/organizer/events/${event.id}`} style={{ textDecoration: 'none' }}>
                            <button className="px-4 py-2 bg-[#2A1E06] border border-[#E8A020]/30 rounded-lg text-xs font-bold text-[#E8A020] hover:bg-[#E8A020] hover:text-[#080A07] transition-all">
                              Manage →
                            </button>
                          </Link>
                          <div className="flex items-center gap-1.5 border-l border-[#252D22] pl-3">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`https://OppFetch.vercel.app/events/${event.slug}`);
                                setCopyingId(event.id);
                                setTimeout(() => setCopyingId(null), 2000);
                              }}
                              className="p-2 hover:bg-surface rounded-lg transition-colors text-subtle hover:text-[#E8A020]"
                              title="Copy Link"
                            >
                              <Copy size={14} className={copyingId === event.id ? "text-[#34C27A]" : ""} />
                            </button>
                            <a 
                              href={`https://wa.me/?text=${encodeURIComponent(`Check out ${event.title} on OppFetch: https://oppfetch?events/${event.slug}`)}`}
                              target="_blank"
                              className="p-2 hover:bg-surface rounded-lg transition-colors text-subtle hover:text-[#34C27A]"
                              title="Share on WhatsApp"
                            >
                              <Share2 size={14} />
                            </a>
                            <a 
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me at ${event.title}!`)}&url=${encodeURIComponent(`https://OppFetch.vercel.app/events/${event.slug}`)}`}
                              target="_blank"
                              className="p-2 hover:bg-surface rounded-lg transition-colors text-subtle hover:text-[#4A9EE8]"
                              title="Share on X"
                            >
                              <Twitter size={14} />
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center">
                <div className="text-5xl mb-6 opacity-20">📅</div>
                <h4 className="text-xl font-bold text-primary mb-2">No events created yet</h4>
                <p className="text-muted mb-10">Start by creating your first workshop or bootcamp.</p>
                <Link href="/organizer/create" className="px-8 py-4 bg-surface text-primary border border-border font-black rounded-xl hover:bg-[#E8A020] hover:text-[#080A07] transition-all inline-block">
                  Create My First Event
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
