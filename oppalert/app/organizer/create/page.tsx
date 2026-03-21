"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
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
    const stored = localStorage.getItem("user")
    if (!stored) {
      router.push("/login?next=/organizer/create")
      return
    }
    const parsed = JSON.parse(stored)
    if (!parsed?.token) {
      router.push("/login?next=/organizer/create")
      return
    }
    setUser(parsed)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
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
          "Authorization": `Bearer ${user.token}`
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
    <main className="min-h-screen bg-[#080A07] pt-10 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/organizer" className="text-[#555C50] hover:text-[#EDE8DF] text-xs font-black uppercase tracking-widest mb-8 inline-block transition-colors">
          ← Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="font-syne text-4xl font-black text-[#EDE8DF] mb-2">Create New Event</h1>
          <p className="text-[#9A9C8E]">Fill in the details below to publish your event to the OppAlert community.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Section 1: Basics */}
          <div className="bg-[#141710] border border-[#252D22] p-8 md:p-12 rounded-[2.5rem]">
            <h3 className="text-xl font-bold text-[#EDE8DF] mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#E8A020] text-[#080A07] rounded-full flex items-center justify-center text-sm font-black">1</span>
              Basic Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Event Title *</label>
                <input 
                  type="text" required
                  className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
                  placeholder="e.g. Advanced React Architecture Workshop"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Event Type</label>
                  <select 
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all appearance-none"
                    value={formData.eventType}
                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  >
                    <option value="bootcamp">Bootcamp</option>
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="meetup">Meetup</option>
                    <option value="conference">Conference</option>
                    <option value="hackathon">Hackathon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Tags (comma separated)</label>
                  <input 
                    type="text"
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
                    placeholder="react, web3, scaling"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Full Description *</label>
                <textarea 
                  required
                  className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all h-40 resize-none"
                  placeholder="Tell your audience what they will learn..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Date & Location */}
          <div className="bg-[#141710] border border-[#252D22] p-8 md:p-12 rounded-[2.5rem]">
            <h3 className="text-xl font-bold text-[#EDE8DF] mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#E8A020] text-[#080A07] rounded-full flex items-center justify-center text-sm font-black">2</span>
              Time and Place
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Start Date & Time *</label>
                <input 
                  type="datetime-local" required
                  className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Registration Deadline</label>
                <input 
                  type="date"
                  className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({...formData, registrationDeadline: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-4 p-1 bg-[#080A07] border border-[#252D22] rounded-2xl mb-8">
              <button 
                type="button"
                onClick={() => setFormData({...formData, isOnline: true})}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.isOnline ? "bg-[#E8A020] text-[#080A07]" : "text-[#555C50] hover:text-[#EDE8DF]"}`}
              >
                🌐 Online Event
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, isOnline: false})}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${!formData.isOnline ? "bg-[#E8A020] text-[#080A07]" : "text-[#555C50] hover:text-[#EDE8DF]"}`}
              >
                📍 In-Person
              </button>
            </div>
            {formData.isOnline ? (
              <div>
                <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Online Meeting Link</label>
                <input 
                  type="url"
                  className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
                  placeholder="Zoom, Google Meet, or YouTube URL"
                  value={formData.onlineLink}
                  onChange={(e) => setFormData({...formData, onlineLink: e.target.value})}
                />
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Venue Address</label>
                <input 
                  type="text"
                  className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
                  placeholder="Full street address, city, state"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            )}
          </div>

          {/* Section 3: Tickets */}
          <div className="bg-[#141710] border border-[#252D22] p-8 md:p-12 rounded-[2.5rem]">
            <h3 className="text-xl font-bold text-[#EDE8DF] mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#E8A020] text-[#080A07] rounded-full flex items-center justify-center text-sm font-black">3</span>
              Capacity & Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Max Capacity (optional)</label>
                <input 
                  type="number"
                  className="w-full bg-[#080A07] border border-[#252D22] rounded-xl px-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
                  placeholder="e.g. 100"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Ticket Type</label>
                <div className="flex gap-4 p-1 bg-[#080A07] border border-[#252D22] rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isPaid: false})}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${!formData.isPaid ? "bg-[#34C27A] text-[#080A07]" : "text-[#555C50]"}`}
                  >
                    Free
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isPaid: true})}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${formData.isPaid ? "bg-[#E8A020] text-[#080A07]" : "text-[#555C50]"}`}
                  >
                    Paid
                  </button>
                </div>
              </div>
            </div>
            {formData.isPaid && (
              <div className="mt-8">
                <label className="block text-[10px] font-black text-[#555C50] uppercase tracking-widest mb-3">Ticket Price (NGN)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#EDE8DF] font-bold">₦</span>
                  <input 
                    type="number" required
                    className="w-full bg-[#080A07] border border-[#252D22] rounded-xl pl-12 pr-6 py-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
                    placeholder="5,000"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              onClick={() => setFormData({...formData, isPublished: true})}
              className="flex-[2] py-5 bg-[#E8A020] text-[#080A07] font-black rounded-[2rem] text-lg hover:scale-[1.02] transition-all shadow-glow-amber disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Event Now →"}
            </button>
            <button 
              type="submit"
              disabled={loading}
              onClick={() => setFormData({...formData, isPublished: false})}
              className="flex-1 py-5 bg-[#141710] border border-[#252D22] text-[#EDE8DF] font-black rounded-[2rem] hover:bg-[#222820] transition-all"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
