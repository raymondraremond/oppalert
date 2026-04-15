"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3, Heart, Bell, User, LogOut, Clock, Sparkles,
  ArrowRight, Zap, Check, Mail, ChevronRight, ShieldCheck, Settings,
  ExternalLink, AlertCircle, Search, Trash2, LayoutDashboard
} from "lucide-react"
import ScrollReveal from "@/components/ScrollReveal"

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
  const [skills, setSkills] = useState<string[]>([])
  const [education, setEducation] = useState("")
  const [experience, setExperience] = useState("")
  const [skillInput, setSkillInput] = useState("")
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

    // Fetch full profile including new fields
    const fetchProfile = async () => {
      const token = getToken()
      if (!token) return

      try {
        const res = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setSkills(data.skills || [])
          setEducation(data.education || "")
          setExperience(data.experience || "")
          setCountry(data.country || "Nigeria")
        }
      } catch (err) {
        console.error("Fetch profile error:", err)
      }
    }

    fetchProfile()
    // ... existing fetchSaved call ...

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

  const handleSaveProfile = async () => {
    const token = getToken()
    if (!token) return
    setIsLoading(true)

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: `${firstName} ${lastName}`.trim(),
          country,
          skills,
          education,
          experience,
        }),
      })

      if (res.ok) {
        setProfileSaved(true)
        setTimeout(() => setProfileSaved(false), 3000)
      }
    } catch (err) {
      console.error("Save profile error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput])
      setSkillInput("")
    }
  }

  const removeSkill = (s: string) => {
    setSkills(skills.filter(x => x !== s))
  }

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg">
        <div className="w-16 h-16 border-4 border-emerald/20 border-t-emerald rounded-full animate-spin" />
      </div>
    )
  }

  const isPremium = user.plan === "premium" || user.plan === "admin"
  const planLabel = user.plan === "admin" ? "FOUNDER" : user.plan === "premium" ? "PREMIUM MEMBER" : "FREE MEMBER"
  
  const getBadgeStyle = () => {
    if (user.plan === "admin") {
      return "bg-gradient-to-r from-emerald to-emerald-light text-black shadow-lg shadow-emerald/20"
    }
    if (user.plan === "premium") {
      return "bg-emerald text-black shadow-lg shadow-emerald/10"
    }
    return "bg-surface2 text-muted border border-border"
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden bg-bg">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0">
          <ScrollReveal>
            <div className="bg-surface/30 border border-border/60 rounded-[3rem] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/5 blur-3xl -z-10" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-surface2 p-1 mb-6 border border-border shadow-inner group/avatar">
                  <div className="w-full h-full rounded-[1.8rem] bg-bg flex items-center justify-center font-serif text-3xl font-bold text-emerald group-hover:scale-95 transition-transform">
                    {(firstName[0] || user.email[0]).toUpperCase()}
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2 line-clamp-1">{user.fullName || "User"}</h3>
                <div className="mb-8">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full ${getBadgeStyle()}`}>
                    {planLabel}
                  </span>
                </div>
              </div>

              <nav className="space-y-2 mt-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                        isActive 
                        ? "bg-emerald text-black shadow-xl shadow-emerald/20" 
                        : "text-muted hover:text-primary hover:bg-surface2 border border-transparent hover:border-border/50"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  )
                })}
                
                {user.plan === "admin" && (
                  <Link href="/admin" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-muted hover:text-emerald transition-all font-bold text-sm border border-transparent hover:bg-surface2">
                    <LayoutDashboard size={18} />
                    Admin Panel
                  </Link>
                )}
              </nav>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent my-8" />

              <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-3 text-red-500/60 hover:text-red-500 font-black uppercase tracking-widest text-[10px] w-full transition-colors group">
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </button>
            </div>
          </ScrollReveal>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 space-y-12">
          {activeTab === "overview" && (
            <div className="space-y-12">
              <ScrollReveal>
                <div>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
                    Welcome, <span className="text-emerald italic">{firstName || "there"}</span>
                  </h1>
                  <p className="text-muted font-medium text-lg leading-relaxed max-w-2xl opacity-70">
                    Your global career dashboard is ready. You currently have {savedCount} items awaiting your attention.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { num: savedCount, label: "SAVED ITEMS", icon: Heart, delay: 100 },
                  { num: 0, label: "URGENT DEADLINES", icon: Clock, delay: 200 },
                  { num: isPremium ? "∞" : `${savedCount} / 5`, label: "SAVE LIMIT", icon: ShieldCheck, delay: 300 },
                ].map((s, i) => (
                  <ScrollReveal key={i} delay={s.delay}>
                    <div className="bg-surface/30 border border-border/50 rounded-[2.5rem] p-8 hover:-translate-y-1 transition-all duration-300 group backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-emerald/5">
                      <div className="w-14 h-14 rounded-2xl bg-surface2 flex items-center justify-center mb-8 border border-border shadow-inner group-hover:bg-emerald/10 group-hover:border-emerald/20 transition-colors">
                        <s.icon size={24} className="text-emerald" />
                      </div>
                      <div className="font-serif text-5xl font-bold text-primary mb-2 tracking-tighter">{s.num}</div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">{s.label}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Quick Actions / Tips */}
              <ScrollReveal delay={400}>
                <div className="bg-emerald/5 border border-emerald/20 rounded-[3rem] p-8 md:p-10 relative overflow-hidden">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-3xl bg-emerald/10 flex items-center justify-center text-emerald">
                            <Zap size={32} />
                         </div>
                         <div>
                            <h4 className="font-serif text-xl font-bold text-white mb-1">Boost your applications</h4>
                            <p className="text-muted text-sm max-w-md">Premium users are 4.5x more likely to secure international fellowships. Upgrade today.</p>
                         </div>
                      </div>
                      <Link href="/pricing" className="px-8 py-4 bg-emerald text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald/20">
                         Go Premium
                      </Link>
                   </div>
                </div>
              </ScrollReveal>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-10">
              <ScrollReveal>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary tracking-tight">
                    Saved <span className="text-emerald italic">Items</span>
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
                    <Search size={14} /> Search saved
                  </div>
                </div>
              </ScrollReveal>
              
              {savedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 rounded-[2.5rem] bg-surface2 animate-pulse border border-border/50" />
                  ))}
                </div>
              ) : savedOpps.length === 0 ? (
                <ScrollReveal delay={100}>
                  <div className="bg-surface/30 border border-border/50 rounded-[3rem] p-16 text-center backdrop-blur-sm">
                    <div className="w-24 h-24 rounded-full bg-surface2 flex items-center justify-center mx-auto mb-8 border border-border">
                       <Heart size={40} className="text-muted/30" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-primary mb-4">Your collection is empty</h3>
                    <p className="text-muted mb-10 max-w-md mx-auto">Explore thousands of scholarships, jobs, and grants and save them for later.</p>
                    <Link href="/opportunities" className="px-8 py-4 bg-emerald text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 shadow-xl shadow-emerald/10 inline-block transition-all">
                      Browse Opportunities
                    </Link>
                  </div>
                </ScrollReveal>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedOpps.map((opp, idx) => (
                    <ScrollReveal key={opp.id} delay={idx * 50}>
                      <div className="bg-surface/30 border border-border rounded-[2.5rem] p-8 flex flex-col h-full hover:border-emerald/30 transition-all duration-500 group relative overflow-hidden backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-surface2 flex items-center justify-center text-xl shadow-inner border border-border group-hover:scale-110 transition-transform">
                            {opp.icon || "🌍"}
                          </div>
                          <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${opp.days_remaining <= 7 ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald/10 text-emerald border border-emerald/20"}`}>
                            {opp.days_remaining || 0} DAYS LEFT
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-xl text-primary mb-2 line-clamp-1 leading-tight">{opp.title}</h3>
                        <p className="text-xs text-muted mb-8 font-medium tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">{opp.organization || opp.org}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-10">
                          <span className="text-[9px] font-black px-3 py-1.5 bg-surface2 text-muted border border-border rounded-lg uppercase tracking-wider">{opp.category || opp.cat}</span>
                        </div>
                        
                        <div className="mt-auto flex gap-3">
                          <Link href={`/opportunities/${opp.id}`} className="flex-[3] py-4 bg-surface2 border border-border text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl text-center transition-all flex items-center justify-center gap-2 hover:bg-emerald hover:text-black hover:border-emerald active:scale-95">
                            Details <ArrowRight size={14} />
                          </Link>
                          <button onClick={() => handleRemoveSaved(opp.id)} className="flex-1 py-4 bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl transition-all flex items-center justify-center active:scale-95 group/del">
                            <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "alerts" && (
             <ScrollReveal>
                <div className="space-y-10">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary tracking-tight">Smart <span className="text-emerald italic">Alerts</span></h2>
                  <div className="bg-surface/30 border border-border rounded-[3rem] p-12 md:p-16 text-center max-w-3xl backdrop-blur-sm flex flex-col items-center">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-surface2 flex items-center justify-center mb-10 text-emerald shadow-inner border border-border">
                      <Bell size={32} />
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-primary mb-6 italic underline decoration-emerald/30 decoration-4 underline-offset-8">Coming Soon</h3>
                    <p className="text-muted text-lg leading-relaxed max-w-md mx-auto mb-12 opacity-80">{"We're calibrating our AI to notify you instantly when opportunities matching your dream career path are published."}</p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-emerald border border-emerald/20">
                      <Sparkles size={14} /> Early Access Program
                    </div>
                  </div>
                </div>
             </ScrollReveal>
          )}

          {activeTab === "profile" && (
             <ScrollReveal>
                <div className="space-y-10">
                  <div className="flex justify-between items-end">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary tracking-tight">Career <span className="text-emerald italic">Profile</span></h2>
                    {profileSaved && (
                      <div className="flex items-center gap-2 text-emerald text-xs font-bold animate-fade-up">
                        <Check size={14} /> Profile Saved
                      </div>
                    )}
                  </div>

                  <div className="bg-surface/30 border border-border rounded-[3rem] p-8 md:p-12 backdrop-blur-sm max-w-3xl space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] pl-1">First Name</label>
                           <input 
                              value={firstName} 
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full p-4 bg-surface2 border border-border rounded-2xl text-primary text-sm font-bold focus:border-emerald/40 outline-none transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] pl-1">Last Name</label>
                           <input 
                              value={lastName} 
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full p-4 bg-surface2 border border-border rounded-2xl text-primary text-sm font-bold focus:border-emerald/40 outline-none transition-all"
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] pl-1">My Skills</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {skills.map(s => (
                            <span key={s} className="px-4 py-2 bg-emerald/10 border border-emerald/20 text-emerald text-xs font-bold rounded-full flex items-center gap-2">
                              {s} <button onClick={() => removeSkill(s)} className="hover:text-white transition-colors"><Trash2 size={12} /></button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input 
                             placeholder="Add a skill (e.g. Python, Research)" 
                             value={skillInput}
                             onChange={(e) => setSkillInput(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                             className="flex-1 p-4 bg-surface2 border border-border rounded-2xl text-primary text-sm font-bold focus:border-emerald/40 outline-none transition-all"
                          />
                          <button onClick={addSkill} className="px-6 bg-surface2 border border-border rounded-2xl text-primary hover:bg-emerald hover:text-black hover:border-emerald transition-all"><Check size={20} /></button>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] pl-1">Academic Background</label>
                        <textarea 
                           placeholder="Describe your education history..."
                           value={education}
                           onChange={(e) => setEducation(e.target.value)}
                           className="w-full p-5 bg-surface2 border border-border rounded-2xl text-primary text-sm font-bold focus:border-emerald/40 outline-none transition-all min-h-[120px]"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] pl-1">Work/Project Experience</label>
                        <textarea 
                           placeholder="Describe your previous roles or projects..."
                           value={experience}
                           onChange={(e) => setExperience(e.target.value)}
                           className="w-full p-5 bg-surface2 border border-border rounded-2xl text-primary text-sm font-bold focus:border-emerald/40 outline-none transition-all min-h-[180px]"
                        />
                     </div>

                     <div className="pt-6 border-t border-border/40 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <ShieldCheck size={20} className="text-emerald" />
                           <span className="text-xs font-bold text-muted uppercase tracking-widest">{planLabel}</span>
                        </div>
                        <button 
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                          className="px-10 py-5 bg-emerald text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald/10 flex items-center gap-3 disabled:opacity-50"
                        >
                          {isLoading ? "Saving..." : <><Check size={18} /> Update Profile</>}
                        </button>
                     </div>
                  </div>
                </div>
             </ScrollReveal>
          )}
        </div>
      </div>
    </main>
  )
}
