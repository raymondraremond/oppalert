"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function OrganizerDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    thisMonthRegistrations: 0
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    async function fetchData() {
      try {
        // Fetch Profile
        const profileRes = await fetch("/api/organizer/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const profileData = await profileRes.json()
        
        if (!profileData) {
          router.push("/organizer/setup")
          return
        }
        setProfile(profileData)

        // Fetch Events
        const eventsRes = await fetch("/api/organizer/events", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const eventsData = await eventsRes.json()
        const eventList = eventsData.data || []
        setEvents(eventList)

        // Calculate Stats
        const totalRegs = eventList.reduce((acc: number, curr: any) => acc + Number(curr.registrations_count || 0), 0)
        const upcoming = eventList.filter((e: any) => new Date(e.start_date) > new Date()).length
        
        setStats({
          totalEvents: eventList.length,
          totalRegistrations: totalRegs,
          upcomingEvents: upcoming,
          thisMonthRegistrations: totalRegs // Placeholder for month filtering
        })

      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) return <div className="min-h-screen pt-40 text-center text-[#9A9C8E]">Loading organizer dashboard...</div>

  return (
    <div className="min-h-screen bg-[#080A07] pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#EDE8DF] mb-1">Organizer Dashboard</h1>
            <p className="text-[#9A9C8E]">{profile?.organization_name}</p>
          </div>
          <Link href="/organizer/create" className="px-6 py-3 bg-[#E8A020] text-[#080A07] font-bold rounded-xl hover:bg-[#F0B040] transition-colors">
            + Create New Event
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Events", value: stats.totalEvents, icon: "📅" },
            { label: "Total Registrations", value: stats.totalRegistrations, icon: "👥" },
            { label: "Upcoming Events", value: stats.upcomingEvents, icon: "🚀" },
            { label: "Verified Status", value: profile?.verified ? "Verified" : "Pending", icon: "✅" },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-[#141710] border border-[#252D22] rounded-2xl">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-[#555C50] text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-xl font-black text-[#EDE8DF]">{stat.value}</div>
            </div>
          ))}
        </div>

        {profile?.plan === "free" && (
          <div className="mb-10 p-6 bg-gradient-to-r from-[#E8A020]/10 to-transparent border border-[#E8A020]/20 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-[#EDE8DF] font-bold mb-1">Upgrade to Organizer Premium</h3>
              <p className="text-[#9A9C8E] text-sm">Get verified, feature your events, and export attendee data.</p>
            </div>
            <Link href="/pricing" className="px-6 py-2 bg-[#E8A020] text-[#080A07] font-bold rounded-lg text-sm whitespace-nowrap">
              Upgrade Now
            </Link>
          </div>
        )}

        {/* EVENTS LIST */}
        <div className="bg-[#141710] border border-[#252D22] rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-[#252D22] flex justify-between items-center">
            <h3 className="text-[#EDE8DF] font-bold">Your Events</h3>
          </div>

          <div className="overflow-x-auto">
            {events.length > 0 ? (
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Regs</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: any) => (
                    <tr key={event.id}>
                      <td className="font-bold text-[#EDE8DF]">{event.title}</td>
                      <td className="capitalize">{event.event_type}</td>
                      <td>{new Date(event.start_date).toLocaleDateString()}</td>
                      <td>{event.registrations_count || 0}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          event.is_published ? "bg-[#34C27A]/10 text-[#34C27A]" : "bg-[#555C50]/20 text-[#555C50]"
                        }`}>
                          {event.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-3">
                          <Link href={`/events/${event.slug}`} className="text-[#E8A020] hover:underline">View</Link>
                          <Link href={`/organizer/events/${event.id}`} className="text-[#EDE8DF] hover:underline">Manage</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center">
                <p className="text-[#9A9C8E] mb-6">You have not created any events yet.</p>
                <Link href="/organizer/create" className="px-8 py-3 bg-[#E8A020] text-[#080A07] font-bold rounded-xl transition-colors">
                  Create Your First Event
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
