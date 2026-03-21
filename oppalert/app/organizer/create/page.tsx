"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    eventType: "workshop",
    description: "",
    isOnline: true,
    location: "",
    onlineLink: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    maxCapacity: "",
    isPaid: false,
    ticketPrice: "0",
    tags: "",
    isPublished: true
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) router.push("/login")
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const payload = {
        ...formData,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : null,
        ticketPrice: parseFloat(formData.ticketPrice),
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t !== "")
      }

      const res = await fetch("/api/organizer/events", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create event")
      }

      router.push("/organizer")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080A07] pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/organizer" className="text-[#9A9C8E] hover:text-[#EDE8DF] mb-8 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-black text-[#EDE8DF] mb-10">Create New Event</h1>

        {error && (
          <div className="mb-8 p-4 bg-[#F05050]/10 border border-[#F05050]/20 rounded-xl text-[#F05050] text-sm font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* SECTION 1 - BASIC INFO */}
          <div className="bg-[#141710] border border-[#252D22] p-8 rounded-3xl">
            <h3 className="text-[#EDE8DF] font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#E8A020] text-[#080A07] rounded-full flex items-center justify-center text-xs">1</span>
              Basic Information
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Event Title *</label>
                <input 
                  type="text" required
                  className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                  placeholder="e.g. Intro to UI/UX Workshop"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Event Type</label>
                  <select 
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                    value={formData.eventType}
                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
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
                <div>
                  <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Tags (comma separated)</label>
                  <input 
                    type="text"
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                    placeholder="design, tech, networking"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Full Description *</label>
                <textarea 
                  required
                  className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none h-40 resize-none"
                  placeholder="Tell people what to expect..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 - DATE AND LOCATION */}
          <div className="bg-[#141710] border border-[#252D22] p-8 rounded-3xl">
            <h3 className="text-[#EDE8DF] font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#E8A020] text-[#080A07] rounded-full flex items-center justify-center text-xs">2</span>
              Date and Location
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Start Date & Time *</label>
                  <input 
                    type="datetime-local" required
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">End Date & Time</label>
                  <input 
                    type="datetime-local"
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-6 mb-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isOnline: true})}
                  className={`flex-1 py-3 rounded-xl font-bold border ${formData.isOnline ? "bg-[#E8A020]/10 border-[#E8A020] text-[#E8A020]" : "bg-[#080A07] border-[#252D22] text-[#555C50]"}`}
                >
                  🌐 Online
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isOnline: false})}
                  className={`flex-1 py-3 rounded-xl font-bold border ${!formData.isOnline ? "bg-[#E8A020]/10 border-[#E8A020] text-[#E8A020]" : "bg-[#080A07] border-[#252D22] text-[#555C50]"}`}
                >
                  📍 In-Person
                </button>
              </div>

              {formData.isOnline ? (
                <div>
                  <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Online Link (Zoom/Meet)</label>
                  <input 
                    type="url"
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                    placeholder="https://zoom.us/j/..."
                    value={formData.onlineLink}
                    onChange={(e) => setFormData({...formData, onlineLink: e.target.value})}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Physical Address</label>
                  <input 
                    type="text"
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                    placeholder="Street, City, State"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3 - CAPACITY AND PRICING */}
          <div className="bg-[#141710] border border-[#252D22] p-8 rounded-3xl">
            <h3 className="text-[#EDE8DF] font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#E8A020] text-[#080A07] rounded-full flex items-center justify-center text-xs">3</span>
              Capacity and Pricing
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Max Capacity (blank = unlimited)</label>
                  <input 
                    type="number"
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                    placeholder="100"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Ticket Type</label>
                  <div className="flex gap-4">
                     <button 
                      type="button"
                      onClick={() => setFormData({...formData, isPaid: false})}
                      className={`flex-1 py-3 rounded-xl font-bold border ${!formData.isPaid ? "bg-[#34C27A]/10 border-[#34C27A] text-[#34C27A]" : "bg-[#080A07] border-[#252D22] text-[#555C50]"}`}
                    >
                      Free
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isPaid: true})}
                      className={`flex-1 py-3 rounded-xl font-bold border ${formData.isPaid ? "bg-[#E8A020]/10 border-[#E8A020] text-[#E8A020]" : "bg-[#080A07] border-[#252D22] text-[#555C50]"}`}
                    >
                      Paid
                    </button>
                  </div>
                </div>
              </div>

              {formData.isPaid && (
                <div className="animate-in slide-in-from-top duration-300">
                  <label className="block text-xs font-bold text-[#555C50] uppercase tracking-widest mb-2">Ticket Price (NGN)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-[#555C50]">₦</span>
                    <input 
                      type="number"
                      className="w-full bg-[#080A07] border border-[#252D22] rounded-xl pl-10 pr-5 py-3 text-[#EDE8DF] focus:border-[#E8A020] outline-none"
                      placeholder="5,000"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              onClick={() => setFormData({...formData, isPublished: true})}
              disabled={loading}
              className="flex-1 py-5 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:bg-[#F0B040] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Creating Event..." : "Publish Event Now →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
