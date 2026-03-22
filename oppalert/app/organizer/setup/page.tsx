"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OrganizerSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    organizationName: "",
    bio: "",
    website: "",
    twitter: "",
    linkedin: "",
    logoUrl: ""
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    async function checkProfile() {
      try {
        const res = await fetch("/api/organizer/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        const data = await res.json()
        if (data) {
          router.push("/organizer")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    checkProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/organizer/profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save profile")
      }

      router.push("/organizer/create")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen pt-40 text-center text-muted">Checking profile...</div>

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-primary mb-2">Organizer Setup</h1>
          <p className="text-muted">Tell us about your organization to start hosting events.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[#F05050]/10 border border-[#F05050]/20 rounded-xl text-[#F05050] text-sm font-bold">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-bg2 border border-border p-8 md:p-10 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-subtle uppercase tracking-widest mb-2">Organization Name *</label>
              <input 
                type="text" 
                required
                className="w-full bg-bg border border-border rounded-xl px-5 py-3 text-primary focus:border-[#E8A020] outline-none"
                placeholder="e.g. Tech Africa Hub"
                value={formData.organizationName}
                onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-subtle uppercase tracking-widest mb-2">Bio / Description</label>
              <textarea 
                className="w-full bg-bg border border-border rounded-xl px-5 py-3 text-primary focus:border-[#E8A020] outline-none h-32 resize-none"
                placeholder="What does your organization do?"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-subtle uppercase tracking-widest mb-2">Website URL</label>
                <input 
                  type="url" 
                  className="w-full bg-bg border border-border rounded-xl px-5 py-3 text-primary focus:border-[#E8A020] outline-none"
                  placeholder="https://..."
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-subtle uppercase tracking-widest mb-2">Twitter Handle</label>
                <input 
                  type="text" 
                  className="w-full bg-bg border border-border rounded-xl px-5 py-3 text-primary focus:border-[#E8A020] outline-none"
                  placeholder="@handle"
                  value={formData.twitter}
                  onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-4 bg-[#E8A020] text-[#080A07] font-black rounded-xl hover:bg-[#F0B040] transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving Profile..." : "Complete Setup →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
