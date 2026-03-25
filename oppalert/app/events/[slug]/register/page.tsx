"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EventRegisterPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    agreed: false
  })

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${params.slug}`)
        if (!res.ok) throw new Error("Event not found")
        const data = await res.json()
        setEvent(data)
      } catch (err) {
        console.error(err)
        setError("Could not load event details")
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [params.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreed) {
      setError("Please agree to the terms to continue")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch(`/api/events/${params.slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const generateIcs = () => {
    if (!event) return
    const startDate = new Date(event.start_date).toISOString().replace(/-|:|\.\d+/g, "")
    const endDate = event.end_date 
      ? new Date(event.end_date).toISOString().replace(/-|:|\.\d+/g, "")
      : new Date(new Date(event.start_date).getTime() + 3600000).toISOString().replace(/-|:|\.\d+/g, "")

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description?.replace(/\n/g, "\\n")}`,
      `LOCATION:${event.is_online ? "Online" : event.location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n")

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute("download", `${event.slug}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) return <div className="min-h-screen pt-40 text-center text-muted">Loading registration form...</div>
  if (!event && !loading) return <div className="min-h-screen pt-40 text-center text-muted">{error || "Event not found"}</div>

  if (success) {
    return (
      <div className="min-h-screen bg-bg pt-32 pb-20 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-bg2 border border-border p-10 rounded-3xl text-center shadow-2xl">
          <div className="w-20 h-20 bg-[#34C27A]/10 text-[#34C27A] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-3xl font-black text-primary mb-2">Registration Confirmed!</h2>
          <p className="text-muted mb-8">
            You are successfully registered for <span className="text-primary font-bold">{event.title}</span>. 
            A confirmation has been sent to <span className="text-primary font-bold">{formData.email}</span>.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={generateIcs}
              className="w-full py-3 bg-surface border border-border text-primary font-bold rounded-xl hover:bg-[#313D2C] transition-colors"
            >
              Add to Calendar
            </button>
            <Link 
              href="/events" 
              className="w-full py-3 bg-[#E8A020] text-[#080A07] font-bold rounded-xl block hover:bg-[#F0B040] transition-colors"
            >
              Browse More Events
            </Link>
          </div>
          
          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-[10px] font-bold text-subtle uppercase tracking-widest mb-4">Invite your friends</p>
            <div className="flex justify-center gap-4">
               <a href={`https://twitter.com/intent/tweet?text=I just registered for ${event.title} on OppFetch! Join me:&url=${window.location.origin}/events/${event.slug}`} target="_blank" className="text-[#1DA1F2] font-bold text-sm">Twitter</a>
               <a href={`https://wa.me/?text=I just registered for ${event.title} on OppFetch! Join me: ${window.location.origin}/events/${event.slug}`} target="_blank" className="text-[#25D366] font-bold text-sm">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href={`/events/${params.slug}`} className="text-muted hover:text-primary transition-colors mb-8 inline-block">
          ← Back to event
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-primary mb-2">Register for Event</h1>
          <p className="text-muted font-medium">{event.title}</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[#F05050]/10 border border-[#F05050]/20 rounded-xl text-[#F05050] text-sm font-bold">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-bg2 border border-border p-8 md:p-10 rounded-3xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-subtle uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="Enter your full name"
                className="w-full bg-bg border border-border rounded-xl px-5 py-3 text-primary focus:border-[#E8A020] outline-none transition-colors"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-subtle uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="you@example.com"
                className="w-full bg-bg border border-border rounded-xl px-5 py-3 text-primary focus:border-[#E8A020] outline-none transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-subtle uppercase tracking-widest mb-2">Phone Number</label>
              <input 
                type="tel" 
                required
                placeholder="+234 ..."
                className="w-full bg-bg border border-border rounded-xl px-5 py-3 text-primary focus:border-[#E8A020] outline-none transition-colors"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="pt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  required
                  className="mt-1 accent-[#E8A020]"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                />
                <span className="text-sm text-muted group-hover:text-primary transition-colors">
                  I agree to receive event updates via email and consent to the event&apos;s terms of service.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-4 bg-[#E8A020] text-[#080A07] font-black rounded-xl hover:bg-[#F0B040] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Processing..." : "Complete Registration →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
