"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ManageEventPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("registrations")
  const [event, setEvent] = useState<any>(null)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    async function fetchData() {
      try {
        const [eventRes, regsRes] = await Promise.all([
          fetch(`/api/organizer/events/${params.id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch(`/api/organizer/events/${params.id}/registrations`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ])

        if (!eventRes.ok) throw new Error("Event not found")
        
        const eventData = await eventRes.json()
        const regsData = await regsRes.json()

        setEvent(eventData)
        setRegistrations(regsData.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleExport = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch(`/api/organizer/events/${params.id}/export`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendees-${event?.slug}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const filteredRegistrations = registrations.filter((reg: any) => 
    reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="min-h-screen pt-40 text-center text-[#9A9C8E]">Loading event management...</div>
  if (!event) return <div className="min-h-screen pt-40 text-center text-[#9A9C8E]">Event not found</div>

  return (
    <div className="min-h-screen bg-[#080A07] pt-24 pb-20 px-6">
      <div className="container mx-auto">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <Link href="/organizer" className="text-[#555C50] hover:text-[#EDE8DF] text-xs font-bold uppercase tracking-widest mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-[#EDE8DF] mb-2">{event.title}</h1>
            <div className="flex items-center gap-3">
               <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  event.is_published ? "bg-[#34C27A]/10 text-[#34C27A]" : "bg-[#555C50]/20 text-[#555C50]"
                }`}>
                  {event.is_published ? "Published" : "Draft"}
                </span>
                <span className="text-[#555C50] text-xs">•</span>
                <span className="text-[#9A9C8E] text-xs">{new Date(event.start_date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-3">
             <Link 
              href={`/events/${event.slug}`}
              className="px-5 py-2.5 bg-[#141710] border border-[#252D22] text-[#EDE8DF] font-bold rounded-xl text-sm hover:bg-[#222820]"
            >
              Public Page
            </Link>
             <button 
              onClick={handleExport}
              className="px-5 py-2.5 bg-[#E8A020] text-[#080A07] font-bold rounded-xl text-sm hover:bg-[#F0B040]"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-[#252D22] mb-8 overflow-x-auto">
          {["overview", "registrations", "analytics", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab 
                  ? "border-[#E8A020] text-[#E8A020]" 
                  : "border-transparent text-[#555C50] hover:text-[#9A9C8E]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT - REGISTRATIONS */}
        {activeTab === "registrations" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-[#EDE8DF] font-bold">
                {registrations.length} Total Registrations
              </h3>
              <input 
                type="text"
                placeholder="Search by name or email..."
                className="w-full md:w-80 bg-[#141710] border border-[#252D22] rounded-xl px-4 py-2 text-sm text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-[#141710] border border-[#252D22] rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                {filteredRegistrations.length > 0 ? (
                  <table className="events-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Registered</th>
                        <th>Status</th>
                        <th>Attended</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((reg: any, i: number) => (
                        <tr key={i}>
                          <td className="font-bold text-[#EDE8DF]">{reg.full_name}</td>
                          <td>{reg.email}</td>
                          <td>{reg.phone}</td>
                          <td>{new Date(reg.registered_at).toLocaleDateString()}</td>
                          <td>
                            <span className="text-[10px] font-bold uppercase text-[#34C27A]">
                              {reg.payment_status}
                            </span>
                          </td>
                          <td>
                            <input type="checkbox" className="accent-[#E8A020]" checked={reg.attended} readOnly />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-20 text-center text-[#555C50]">
                    No registrations matching your search.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT - ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 bg-[#141710] border border-[#252D22] rounded-3xl text-center">
                <div className="text-[#555C50] text-[10px] font-bold uppercase tracking-widest mb-2">Total Registrations</div>
                <div className="text-6xl font-black text-[#E8A020] mb-4">{registrations.length}</div>
                <div className="text-[#9A9C8E] text-sm">
                  {event.max_capacity 
                    ? `${Math.round((registrations.length / event.max_capacity) * 100)}% of capacity filled`
                    : "Unlimited capacity"}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 p-8 bg-[#141710] border border-[#252D22] rounded-3xl">
              <h3 className="text-[#EDE8DF] font-bold mb-8">Registration Growth</h3>
              <div className="h-64 flex items-end gap-2 px-4">
                {[40, 60, 45, 90, 65, 80, 100, 70, 85, 95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-[#E8A020]/20 rounded-t-lg group-hover:bg-[#E8A020]/40 transition-all relative" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#222820] text-[#EDE8DF] text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         {Math.round(h * registrations.length / 100)} regs
                       </div>
                    </div>
                    <div className="text-[10px] text-[#555C50] font-bold">Day {i+1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT - OVERVIEW */}
        {activeTab === "overview" && (
           <div className="max-w-3xl bg-[#141710] border border-[#252D22] p-8 rounded-3xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h4 className="text-[10px] font-bold text-[#555C50] uppercase tracking-widest mb-2">Description</h4>
                   <p className="text-[#9A9C8E] text-sm leading-relaxed">{event.description}</p>
                </div>
                <div className="space-y-6">
                   <div>
                      <h4 className="text-[10px] font-bold text-[#555C50] uppercase tracking-widest mb-2">Type</h4>
                      <p className="text-[#EDE8DF] font-bold capitalize">{event.event_type}</p>
                   </div>
                   <div>
                      <h4 className="text-[10px] font-bold text-[#555C50] uppercase tracking-widest mb-2">Location</h4>
                      <p className="text-[#EDE8DF] font-bold">{event.is_online ? "🌐 Online" : event.location}</p>
                   </div>
                   <div>
                      <h4 className="text-[10px] font-bold text-[#555C50] uppercase tracking-widest mb-2">Pricing</h4>
                      <p className="text-[#E8A020] font-bold">{event.is_paid ? `₦${event.ticket_price}` : "Free"}</p>
                   </div>
                </div>
              </div>
           </div>
        )}
      </div>
    </div>
  )
}
