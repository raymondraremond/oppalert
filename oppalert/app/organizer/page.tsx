"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function OrganizerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    pageViews: 0
  })

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
          setStats({
            activeEvents: active,
            totalRegistrations: totalRegs,
            upcomingEvents: active,
            pageViews: totalRegs * 4 // Sample multiplier
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-syne text-3xl font-black text-primary mb-2">Organizer Dashboard</h1>
            <p className="text-muted">Welcome back, {user?.fullName}. Here is how your events are performing.</p>
          </div>
          <Link href="/organizer/create" className="px-8 py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:scale-105 transition-all shadow-glow-amber">
            + Create New Event
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Signups", value: stats.totalRegistrations, icon: "👥" },
            { label: "Active Events", value: stats.activeEvents, icon: "📅" },
            { label: "Upcoming", value: stats.upcomingEvents, icon: "🚀" },
            { label: "Page Views", value: stats.pageViews, icon: "📈" },
          ].map((s, i) => (
            <div key={i} className="p-8 bg-bg2 border border-border rounded-[2rem]">
              <div className="text-2xl mb-4">{s.icon}</div>
              <div className="text-[10px] font-black text-subtle uppercase tracking-widest mb-1">{s.label}</div>
              <div className="text-3xl font-black text-primary">{s.value}</div>
            </div>
          ))}
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
                        <Link href={`/organizer/events/${event.id}`} style={{ textDecoration: 'none' }}>
                          <button style={{
                            padding: '6px 14px',
                            background: '#2A1E06',
                            border: '1px solid rgba(232,160,32,0.3)',
                            borderRadius: 6, fontSize: 12,
                            fontWeight: 700, color: '#E8A020',
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}>
                            Manage →
                          </button>
                        </Link>
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
