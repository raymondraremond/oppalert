"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3, Heart, Bell, User, LogOut, Clock, Sparkles,
  ArrowRight, Zap, Check, Mail, ChevronRight, ShieldCheck, Settings,
  ExternalLink, AlertCircle, Search, Trash2, LayoutDashboard
} from "lucide-react"

const navItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "saved", label: "Saved Items", icon: Heart },
  { id: "alerts", label: "Smart Alerts", icon: Bell },
  { id: "profile", label: "My Profile", icon: User },
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<any>(null)
  const [savedOpps, setSavedOpps] = useState<any[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [savedLoading, setSavedLoading] = useState(true)
  const [alerts, setAlerts] = useState({ newOpps: true, deadlines: true, digest: true, instant: false })
  const [profileSaved, setProfileSaved] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [country, setCountry] = useState("Nigeria")
  const [isLoading, setIsLoading] = useState(true)

  const getToken = () => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.token) return parsed.token
      }
    } catch {}
    try {
      const cookies = document.cookie.split("; ")
      const found = cookies.find(c => c.startsWith("token="))
      return found ? found.split("=")[1] : null
    } catch {}
    return null
  }

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      router.push("/login")
      return
    }
    
    const parsedUser = JSON.parse(stored)
    setUser(parsedUser)

    const fullName = parsedUser.fullName || ""
    const parts = fullName.split(" ")
    setFirstName(parts[0] || "")
    setLastName(parts.slice(1).join(" ") || "")

    const fetchSaved = async () => {
      setSavedLoading(true)
      const token = getToken()
      if (!token) {
        setSavedLoading(false)
        return
      }

      try {
        const res = await fetch("/api/user/saved", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })

        if (res.ok) {
          const data = await res.json()
          const opps = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
            ? data.data
            : []
          setSavedOpps(opps)
          setSavedCount(opps.length)
        }
      } catch (err) {
        console.error("Fetch saved error:", err)
      } finally {
        setSavedLoading(false)
      }
    }

    fetchSaved()
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/"
  }

  const handleRemoveSaved = async (oppId: string) => {
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch("/api/user/saved", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oppId }),
      })

      if (res.ok) {
        setSavedOpps(prev => prev.filter(o => o.id !== oppId))
        setSavedCount(prev => prev - 1)
      }
    } catch (err) {
      console.error("Remove saved error:", err)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-[var(--border)] border-t-amber rounded-full animate-spin" />
      </div>
    )
  }

  const isPremium = user.plan === "premium" || user.plan === "admin"
  const planLabel = user.plan === "admin" ? "FOUNDER" : user.plan === "premium" ? "PREMIUM MEMBER" : "FREE MEMBER"
  
  const getBadgeStyle = () => {
    if (user.plan === "admin") {
      return {
        background: "linear-gradient(135deg, #E8A020 0%, #FFDF90 50%, #E8A020 100%)",
        color: "#0D0F0B"
      }
    }
    if (user.plan === "premium") {
      return { background: "#E8A020", color: "#0D0F0B" }
    }
    return { background: "#1C2119", color: "#9A9C8E" }
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-3xl -z-10" />
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-[1.5rem] bg-amber-gradient p-1 mb-4">
                <div className="w-full h-full rounded-[1.2rem] bg-bg flex items-center justify-center font-syne text-2xl font-black text-amber">
                  {(firstName[0] || user.email[0]).toUpperCase()}
                </div>
              </div>
              <h3 className="font-syne text-lg font-black text-primary mb-1">{user.fullName || "User"}</h3>
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full" style={getBadgeStyle()}>
                  {planLabel}
                </span>
              </div>
            </div>

            <nav className="space-y-2 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                      isActive ? "bg-[var(--icon-bg)] text-amber border border-[var(--glass-border)]" : "text-muted hover:text-primary"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                )
              })}
              
              {user.plan === "admin" && (
                <Link href="/admin" className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-muted hover:text-amber transition-all font-bold text-sm">
                  <LayoutDashboard size={18} />
                  Admin Panel
                </Link>
              )}
            </nav>

            <button onClick={handleLogout} className="flex items-center gap-4 px-5 py-3 mt-8 text-danger/60 hover:text-danger font-black uppercase tracking-widest text-[10px] w-full">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 space-y-10">
          {activeTab === "overview" && (
            <div className="animate-fade-up space-y-10">
              <div>
                <h1 className="font-syne text-4xl font-black text-primary mb-2">
                  Welcome, <span className="text-amber">{firstName || "there"}</span>
                </h1>
                <p className="text-subtle font-medium">Your opportunity dashboard is ready.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { num: savedCount, label: "SAVED ITEMS", icon: Heart },
                  { num: 0, label: "URGENT DEADLINES", icon: Clock },
                  { num: isPremium ? "Unlimited" : `${savedCount} / 5`, label: "SAVE LIMIT", icon: Bell },
                ].map((s, i) => (
                  <div key={i} className="glass-gradient border border-[var(--border)] rounded-3xl p-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--icon-bg)] flex items-center justify-center mb-6">
                      <s.icon size={20} className="text-amber" />
                    </div>
                    <div className="font-syne text-4xl font-black text-primary mb-1">{s.num}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="animate-fade-up space-y-8">
              <h1 className="font-syne text-4xl font-black text-primary">Saved <span className="text-amber">Items</span></h1>
              
              {savedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 rounded-[2rem] bg-[var(--icon-bg)] animate-pulse" />
                  ))}
                </div>
              ) : savedOpps.length === 0 ? (
                <div className="glass-gradient border border-[var(--border)] rounded-[3rem] p-16 text-center">
                  <Heart size={48} className="mx-auto text-muted mb-6 opacity-20" />
                  <h3 className="font-syne text-xl font-black text-primary mb-3">No saved items yet</h3>
                  <Link href="/opportunities" className="btn-primary px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs inline-block">Browse Opportunities</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {savedOpps.map((opp) => (
                    <div key={opp.id} className="glass-gradient border border-[var(--border)] rounded-[2rem] p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-2xl">{opp.icon || "🌍"}</div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-full ${opp.days_remaining <= 7 ? "bg-danger/10 text-danger" : "bg-amber/10 text-amber"}`}>
                          {opp.days_remaining || 0} DAYS LEFT
                        </span>
                      </div>
                      <h3 className="font-bold text-primary mb-1 line-clamp-1">{opp.title}</h3>
                      <p className="text-xs text-muted mb-4">{opp.organization || opp.org}</p>
                      <div className="flex gap-2 mb-6">
                        <span className="text-[9px] font-bold px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md uppercase">{opp.category || opp.cat}</span>
                        <span className="text-[9px] font-bold px-2 py-1 bg-white/5 text-subtle rounded-md uppercase">{opp.funding_type || opp.fund}</span>
                      </div>
                      <div className="mt-auto flex gap-3">
                        <Link href={`/opportunities/${opp.id}`} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl text-center transition-all flex items-center justify-center gap-2">
                          View <ArrowRight size={12} />
                        </Link>
                        <button onClick={() => handleRemoveSaved(opp.id)} className="p-3 bg-danger/10 hover:bg-danger/20 text-danger rounded-xl transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "alerts" && (
             <div className="animate-fade-up space-y-8">
                <h1 className="font-syne text-4xl font-black text-primary">Smart <span className="text-amber">Alerts</span></h1>
                <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-8">
                  <p className="text-subtle font-medium">Alert preferences are coming soon.</p>
                </div>
             </div>
          )}

          {activeTab === "profile" && (
             <div className="animate-fade-up space-y-8">
                <h1 className="font-syne text-4xl font-black text-primary">My <span className="text-amber">Profile</span></h1>
                <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-8">
                   <p className="text-subtle font-medium">Email: {user.email}</p>
                   <p className="text-subtle font-medium">Plan: {user.plan}</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </main>
  )
}
