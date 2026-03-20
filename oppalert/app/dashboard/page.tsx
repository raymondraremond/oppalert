'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { calculateDaysRemaining } from '@/lib/utils'
import { opportunities as seedData } from '@/lib/data'
import OpportunityCard from '@/components/OpportunityCard'
import AffiliateCard from '@/components/AffiliateCard'
import {
  BarChart3, Heart, Bell, User, LogOut, Clock, Sparkles,
  ArrowRight, Zap, Check, Mail, ChevronRight, ShieldCheck, Settings,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'saved', label: 'Saved Items', icon: Heart },
  { id: 'alerts', label: 'Smart Alerts', icon: Bell },
  { id: 'profile', label: 'My Profile', icon: User },
]

function ReferralCard({ userId }: { userId: string }) {
  const referralLink = `https://oppalert.vercel.app/register?ref=${userId}`
  const [copied, setCopied] = useState(false)
  
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div style={{
      background: '#141710',
      border: '1px solid #252D22',
      borderRadius: 12, padding: '1.25rem',
      marginTop: 16,
    }}>
      <div style={{
        fontFamily: "var(--font-syne), sans-serif",
        fontSize: 14, fontWeight: 700, marginBottom: 6,
      }}>
        🎁 Invite Friends, Earn Rewards
      </div>
      <p style={{
        fontSize: 12, color: '#9A9C8E',
        marginBottom: 14, lineHeight: 1.6,
      }}>
        Invite 3 friends and get 1 month Premium free.
        They get 7 days Premium on signup.
      </p>
      <div style={{
        display: 'flex', gap: 8,
        background: '#1C2119',
        border: '1px solid #252D22',
        borderRadius: 8, padding: '8px 12px',
        marginBottom: 10, alignItems: 'center',
      }}>
        <span style={{
          fontSize: 11, color: '#9A9C8E',
          flex: 1, overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {referralLink}
        </span>
        <button onClick={copyLink} style={{
          background: copied ? '#0F2E1C' : '#E8A020',
          border: 'none', borderRadius: 6,
          padding: '5px 12px', fontSize: 11,
          fontWeight: 700,
          color: copied ? '#34C27A' : '#090A07',
          cursor: 'pointer', flexShrink: 0,
          transition: 'all 0.2s',
        }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div style={{
        display: 'flex', gap: 8,
        justifyContent: 'space-between',
        fontSize: 11, color: '#555C50',
      }}>
        <span>0 friends referred</span>
        <span>0 / 3 for free month</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)
  const [savedOpps, setSavedOpps] = useState<any[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [savedLoading, setSavedLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [alerts, setAlerts] = useState({ newOpps: true, deadlines: true, digest: true, instant: false })
  const [profileSaved, setProfileSaved] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)
  const [selectedCats, setSelectedCats] = useState<string[]>(['Scholarships', 'Fellowships', 'Remote Jobs'])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [country, setCountry] = useState('Nigeria')
  const [isLoading, setIsLoading] = useState(true)

  // Auth helper
  const getAuthHeaders = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Load user and data
  useEffect(() => {
    // Get user from localStorage
    try {
      const stored = localStorage.getItem('user') || localStorage.getItem('oppalert_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        const fullName = parsed.fullName || parsed.name || ""
        const parts = fullName.split(' ')
        setFirstName(parts[0] || "")
        setLastName(parts.slice(1).join(' ') || "")
      } else {
        router.push('/login')
        return
      }
    } catch (err) {
      console.error("User parsing error:", err)
      router.push('/login')
      return
    }

    // Fetch recommended opportunities
    fetch('/api/opportunities?limit=15')
      .then(r => r.json())
      .then(data => {
        if (data?.data) {
          const openOpps = data.data.filter((opp: any) => calculateDaysRemaining(opp.deadline) > 0)
          setRecommendations(openOpps.slice(0, 6))
        }
      })
      .catch(console.error)

    // Fetch alert preferences
    fetch('/api/user/alerts', { 
      headers: { ...getAuthHeaders() as any, 'Content-Type': 'application/json' }
    })
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setAlerts({
            newOpps: data.new_opportunity_email,
            deadlines: data.deadline_reminders,
            digest: data.weekly_digest,
            instant: data.instant_alerts,
          })
          if (data.categories?.length) setSelectedCats(data.categories)
        }
      })
      .catch(console.error)

    setIsLoading(false)
  }, [router])

  // Fetch saved opportunities on mount
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setSavedLoading(true)
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]
        
        if (!token) {
          setSavedLoading(false)
          return
        }

        const res = await fetch('/api/user/saved', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })

        if (res.ok) {
          const data = await res.json()
            // Handle both array response and object response
            const opps = Array.isArray(data) 
              ? data 
              : (data.data || [])
            setSavedOpps(opps)
            setSavedCount(opps.length)
        }
      } catch (err) {
        console.error("fetchSaved error:", err)
      } finally {
        setSavedLoading(false)
      }
    }

    fetchSaved()
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('user')
    localStorage.removeItem('oppalert_user')
    localStorage.removeItem('oppalert_token')
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    window.dispatchEvent(new Event('oppalert_auth'))
    router.push('/')
  }

  const toggleAlert = async (key: keyof typeof alerts) => {
    if (key === 'instant' && user?.plan !== 'premium' && user?.plan !== 'admin') return
    const next = { ...alerts, [key]: !alerts[key] }
    setAlerts(next)
    await fetch('/api/user/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({
        new_opportunity_email: next.newOpps,
        deadline_reminders: next.deadlines,
        weekly_digest: next.digest,
        instant_alerts: next.instant,
        categories: selectedCats,
      })
    }).catch(console.error)
  }

  const toggleCat = (cat: string) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const handleSaveProfile = async () => {
    const fullName = `${firstName} ${lastName}`.trim()
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ fullName, country }),
    })
    if (res.ok) {
      const updated = await res.json()
      const newUser = { ...user, fullName: updated.fullName }
      localStorage.setItem('oppalert_user', JSON.stringify(newUser))
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      window.dispatchEvent(new Event('oppalert_auth'))
    }
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handleSavePrefs = async () => {
    await fetch('/api/user/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({
        new_opportunity_email: alerts.newOpps,
        deadline_reminders: alerts.deadlines,
        weekly_digest: alerts.digest,
        instant_alerts: alerts.instant,
        categories: selectedCats,
      })
    }).catch(console.error)
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 2000)
  }

  const handleUpgrade = async () => {
    if (!user) return
    const res = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, email: user.email, fullName: user.fullName || user.name }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U"
  const displayName = `${firstName} ${lastName}`.trim() || user?.email || "User"
  const isPremium = user?.plan === 'premium' || user?.plan === 'admin'
  const planName = user?.plan === 'admin' ? "FOUNDER" : user?.plan === 'premium' ? "PREMIUM MEMBER" : "FREE MEMBER"

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-[var(--border)] border-t-amber rounded-full animate-spin" />
      </div>
    )
  }

  const deadlines = recommendations.filter((o: any) => (o.days_remaining || o.days || 30) <= 20).slice(0, 3)

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-3xl -z-10" />
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-[1.5rem] bg-amber-gradient p-1 mb-4 shadow-glow-amber/20 group-hover:rotate-6 transition-transform">
                <div className="w-full h-full rounded-[1.2rem] bg-bg flex items-center justify-center font-syne text-2xl font-black text-amber">
                  {initials}
                </div>
              </div>
              <h3 className="font-syne text-lg font-black text-primary mb-1">{displayName}</h3>
              <div className="mb-6">
                <span 
                  className={user?.plan === 'admin' || user?.plan === 'premium' ? 'badge-shimmer' : ""}
                  style={
                  user?.plan === 'admin' ? {
                    background: "linear-gradient(135deg, #E8A020 0%, #FFDF90 50%, #E8A020 100%)",
                    backgroundSize: "200% auto",
                    color: '#0D0F0B',
                    fontWeight: 800,
                    letterSpacing: "1px",
                    borderRadius: 100,
                    padding: "3px 14px",
                    fontSize: 11
                  } : user?.plan === 'premium' ? {
                    background: "linear-gradient(135deg, #2A1E06 0%, #4A350A 50%, #2A1E06 100%)",
                    backgroundSize: "200% auto",
                    color: '#E8A020',
                    border: "1px solid rgba(232,160,32,0.3)",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    borderRadius: 100,
                    padding: "3px 14px",
                    fontSize: 11
                  } : {
                    background: '#1C2119',
                    color: '#9A9C8E',
                    fontWeight: 800,
                    letterSpacing: "1px",
                    borderRadius: 100,
                    padding: "3px 14px",
                    fontSize: 11
                  }
                }>
                  {planName}
                </span>
              </div>
              {!isPremium && (
                <button onClick={handleUpgrade} className="btn-primary w-full py-3 px-6 rounded-xl shadow-glow-amber text-bg font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Zap size={14} className="fill-current" />
                  Upgrade to Premium
                </button>
              )}
            </div>

            <div className="h-px bg-[var(--icon-bg)] my-8" />

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                      isActive
                        ? 'bg-[var(--icon-bg)] text-amber border border-[var(--glass-border)] shadow-inner'
                        : 'text-muted hover:text-primary hover:bg-[var(--icon-bg)]'
                    }`}
                  >
                    <div className={isActive ? 'text-amber' : ""}><Icon size={18} /></div>
                    {item.label}
                    {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-amber shadow-glow-amber" />}
                  </button>
                )
              })}
            </nav>

            <div className="h-px bg-[var(--icon-bg)] my-8" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-5 py-3 text-danger/60 hover:text-danger font-black uppercase tracking-widest text-[10px] transition-colors group/logout w-full"
            >
              <LogOut size={16} className="group-hover/logout:-translate-x-1 transition-transform" />
              Sign Out Securely
            </button>
          </div>
          
          {user && <ReferralCard userId={user.id} />}
          <AffiliateCard />
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-10 min-w-0">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="animate-fade-up space-y-10">
              <div>
                <h1 className="font-syne text-4xl md:text-5xl font-black text-primary tracking-tighter mb-2">
                  Welcome, <span className="text-amber-gradient drop-shadow-glow-amber">{firstName || "back"}</span>
                </h1>
                <p className="text-subtle font-medium">
                  {savedOpps.length > 0 ? `You have ${savedOpps.length} saved opportunities.` : "Discover opportunities and start saving them."}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { num: String(savedCount), label: 'Saved Items', icon: <Heart size={20} /> },
                  { num: String(deadlines.length), label: 'Urgent Deadlines', icon: <Clock size={20} />, alert: deadlines.length > 0 },
                  { num: isPremium ? 'Unlimited' : `${savedCount} / 5`, label: 'Save Limit', icon: <Bell size={20} /> },
                ].map((s, idx) => (
                  <div key={idx} className="glass-gradient border border-[var(--border)] rounded-3xl p-6 relative group overflow-hidden">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 shadow-inner ${s.alert ? 'bg-danger/10 text-danger' : 'bg-[var(--icon-bg)] text-subtle'}`}>
                      {s.icon}
                    </div>
                    <div className="font-syne text-4xl font-black text-primary mb-1">{s.num}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recommended */}
              {recommendations.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-inner"><Sparkles size={20} /></div>
                    <h2 className="font-syne text-xl font-black text-primary">Latest Opportunities</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((opp: any) => <OpportunityCard key={opp.id} opp={opp} />)}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Link href="/opportunities" className="inline-flex items-center gap-2 text-sm font-bold text-amber hover:brightness-125 transition-all group">
                      View all opportunities
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SAVED ITEMS TAB */}
          {activeTab === 'saved' && (
            <div>
              <h2 style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 4,
              }}>
                Saved <span style={{ color: '#E8A020' }}>Items</span>
              </h2>
              <p style={{
                fontSize: 13,
                color: '#555C50',
                marginBottom: 24,
              }}>
                {savedCount} saved {savedCount === 1 
                  ? "opportunity" : "opportunities"}
              </p>

              {savedLoading ? (
                // Show skeleton cards while loading
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 
                    "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{
                      background: '#141710',
                      border: '1px solid #252D22',
                      borderRadius: 16,
                      padding: '1.25rem',
                      height: 180,
                      animation: 
                        "skeleton-pulse 1.5s ease infinite",
                    }} />
                  ))}
                </div>
              ) : savedOpps.length === 0 ? (
                // Empty state
                <div style={{
                  background: '#0F1210',
                  border: '1px solid #252D22',
                  borderRadius: 16,
                  padding: '3rem 2rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>
                    🤍
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-syne), sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}>
                    No saved items yet
                  </h3>
                  <p style={{
                    fontSize: 13,
                    color: '#555C50',
                    marginBottom: 20,
                  }}>
                    Browse opportunities and save the ones 
                    you want to apply to.
                  </p>
                  <Link href="/opportunities">
                    <button style={{
                      background: '#E8A020',
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px 24px',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#090A07',
                      cursor: 'pointer',
                      fontFamily: "inherit",
                    }}>
                      Browse Opportunities
                    </button>
                  </Link>
                </div>
              ) : (
                // Show saved opportunity cards
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 
                    "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}>
                  {savedOpps.map((opp: any) => (
                    <div key={opp.id || opp.opportunity_id}
                      style={{
                        background: '#141710',
                        border: '1px solid #252D22',
                        borderRadius: 16,
                        padding: '1.25rem',
                        position: 'relative',
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        fontSize: 28,
                        marginBottom: 10,
                      }}>
                        {opp.icon || "🌍"}
                      </div>

                      {/* Title */}
                      <div style={{
                        fontFamily: 
                          "var(--font-syne), sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        marginBottom: 4,
                        color: '#EDE8DF',
                        lineHeight: 1.3,
                      }}>
                        {opp.title}
                      </div>

                      {/* Org */}
                      <div style={{
                        fontSize: 12,
                        color: '#555C50',
                        marginBottom: 12,
                      }}>
                        {opp.organization}
                      </div>

                      {/* Badges */}
                      <div style={{
                        display: 'flex',
                        gap: 6,
                        flexWrap: 'wrap',
                        marginBottom: 14,
                      }}>
                        <span style={{
                          background: '#2A1E06',
                          color: '#E8A020',
                          padding: '2px 9px',
                          borderRadius: 100,
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          {opp.category}
                        </span>
                        <span style={{
                          background: '#1C2119',
                          color: '#9A9C8E',
                          padding: '2px 9px',
                          borderRadius: 100,
                          fontSize: 11,
                        }}>
                          {opp.funding_type}
                        </span>
                      </div>

                      {/* Deadline */}
                      <div style={{
                        fontSize: 11,
                        color: '#555C50',
                        marginBottom: 14,
                      }}>
                        ⏰ {opp.days_remaining || calculateDaysRemaining(opp.deadline) || 0} days left
                      </div>

                      {/* Buttons */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        
                        <Link
                          href={
                             `/opportunities/${opp.id || opp.opportunity_id}`
                          }
                          style={{
                            flex: 1,
                            textDecoration: 'none',
                          }}
                        >
                          <button style={{
                            width: '100%',
                            padding: '8px',
                            background: '#E8A020',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#090A07',
                            cursor: 'pointer',
                            fontFamily: "inherit",
                          }}>
                            View →
                          </button>
                        </Link>
                        <button
                          onClick={async () => {
                            const token = document.cookie
                              .split('; ')
                              .find(r => r.startsWith('token='))
                              ?.split('=')[1]
                            if (!token) return
                            try {
                              const res = await fetch('/api/user/saved', {
                                method: 'DELETE',
                                headers: {
                                  'Authorization': `Bearer ${token}`,
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ 
                                  oppId: opp.id || opp.opportunity_id 
                                }),
                              })
                              if (res.ok) {
                                setSavedOpps(prev => 
                                  prev.filter((o: any) => 
                                    (o.id || o.opportunity_id) !== (opp.id || opp.opportunity_id)
                                  )
                                )
                                setSavedCount(prev => Math.max(0, prev - 1))
                              }
                            } catch (err) {
                              console.error("Remove failed:", err)
                            }
                          }}
                          style={{
                            padding: '8px 12px',
                            background: 'transparent',
                            border: '1px solid #252D22',
                            borderRadius: 8,
                            fontSize: 12,
                            color: '#F05050',
                            cursor: 'pointer',
                            fontFamily: "inherit",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SMART ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div className="animate-fade-up space-y-8">
              <div>
                <h1 className="font-syne text-4xl font-black text-primary tracking-tighter mb-2">Smart <span className="text-amber">Alerts</span></h1>
                <p className="text-subtle font-medium">Get notified before everyone else.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { key: 'newOpps' as const, icon: Mail, label: 'Opportunity Blast', sub: 'Instant email for matches in your niches', premium: false },
                  { key: 'deadlines' as const, icon: Clock, label: 'Final Call Reminders', sub: 'Reminders 48h before closing dates', premium: false },
                  { key: 'digest' as const, icon: BarChart3, label: 'Weekly Performance', sub: 'Summary of all matches and market trends', premium: false },
                  { key: 'instant' as const, icon: Zap, label: 'Instant Telegram Pushes', sub: 'Instant verified listing notifications', premium: true },
                ].map((a) => (
                  <div key={a.key} className="glass-gradient border border-[var(--border)] p-6 rounded-[2rem] flex items-center gap-6 group hover:border-[var(--glass-border)] transition-all">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${a.premium ? 'bg-amber/10 border-amber/20 text-amber' : 'bg-[var(--icon-bg)] border-[var(--border)] text-subtle'}`}>
                      <a.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-primary text-sm">{a.label}</span>
                        {a.premium && <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber text-bg shadow-glow-amber">Premium</span>}
                      </div>
                      <p className="text-xs text-muted font-medium">{a.sub}</p>
                    </div>
                    <button
                      onClick={() => toggleAlert(a.key)}
                      disabled={a.premium && !isPremium}
                      className={`w-12 h-6 rounded-full relative transition-all duration-500 ${alerts[a.key] ? 'bg-amber' : 'bg-white/10'} ${a.premium && !isPremium ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${alerts[a.key] ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-up space-y-10">
              <div>
                <h1 className="font-syne text-4xl font-black text-primary tracking-tighter mb-2">Profile <span className="text-amber">Settings</span></h1>
                <p className="text-subtle font-medium">Keep your professional profile current for better matches.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Basic Info */}
                <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-8 md:p-10 space-y-8">
                  <h3 className="font-syne text-xl font-black text-primary flex items-center gap-3">
                    <User size={20} className="text-amber" /> Identity Details
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">First Name</label>
                      <input className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Last Name</label>
                      <input className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Email</label>
                    <input className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary/50 focus:outline-none transition-all cursor-not-allowed" value={user?.email || ""} readOnly />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Country</label>
                    <select className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all cursor-pointer appearance-none" value={country} onChange={e => setCountry(e.target.value)}>
                      {['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia', 'Egypt', 'Tanzania', 'Uganda', 'Rwanda', 'Senegal', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  <button onClick={handleSaveProfile} className="btn-primary w-full py-4 rounded-2xl shadow-glow-amber text-bg font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                    {profileSaved ? <><Check size={18} /> Saved!</> : 'Save Profile'}
                  </button>
                </div>

                {/* Match Preferences */}
                <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-8 md:p-10 space-y-8">
                  <h3 className="font-syne text-xl font-black text-primary flex items-center gap-3">
                    <Sparkles size={20} className="text-primary" /> Discovery Filters
                  </h3>
                  <p className="text-xs text-subtle font-medium leading-relaxed">Select the niches you want our engine to monitor for you.</p>

                  <div className="flex flex-wrap gap-3">
                    {['Scholarships', 'Fellowships', 'Remote Jobs', 'Grants', 'Internships', 'Startup Funding'].map(cat => {
                      const isSelected = selectedCats.includes(cat)
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCat(cat)}
                          className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            isSelected ? 'bg-primary/20 border-primary/40 text-primary shadow-glow-primary/10' : 'bg-[var(--icon-bg)] border-[var(--glass-border)] text-muted hover:border-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    })}
                  </div>

                  <div className="bg-[var(--icon-bg)] border border-[var(--border)] rounded-[2rem] p-6 text-center space-y-4">
                    <ShieldCheck size={32} className="mx-auto text-muted" />
                    <h4 className="font-bold text-sm text-primary">Trust & Security</h4>
                    <p className="text-[10px] text-muted font-medium leading-relaxed">Your data is encrypted. We never sell your personal metrics.</p>
                  </div>

                  <button onClick={handleSavePrefs} className="btn-ghost !border-primary/20 text-primary w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
                    {prefsSaved ? <><Check size={18} /> Saved!</> : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
