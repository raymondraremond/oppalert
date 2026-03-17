'use client'
import { useState } from 'react'
import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import { opportunities } from '@/lib/data'
import {
  BarChart3,
  Heart,
  Bell,
  User,
  LogOut,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  Check,
  Mail,
  ChevronRight,
  ShieldCheck,
  Settings,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'saved', label: 'Saved Items', icon: Heart },
  { id: 'alerts', label: 'Smart Alerts', icon: Bell },
  { id: 'profile', label: 'My Profile', icon: User },
]

const deadlines = opportunities.filter((o) => o.days <= 20).slice(0, 3)
const savedOpps = opportunities.slice(0, 3)
const recommended = opportunities.slice(0, 3)

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [alerts, setAlerts] = useState({
    newOpps: true,
    deadlines: true,
    digest: true,
    instant: false,
  })
  const [profileSaved, setProfileSaved] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)
  const [selectedCats, setSelectedCats] = useState<string[]>(['Scholarships', 'Fellowships', 'Remote Jobs'])
  
  // Profile Form State
  const [firstName, setFirstName] = useState('Adewale')
  const [lastName, setLastName] = useState('Okafor')
  const [email, setEmail] = useState('adewale@example.com')
  const [country, setCountry] = useState('Nigeria')
  const [status, setStatus] = useState('University Student')
  
  const toggleAlert = (key: keyof typeof alerts) => {
    if (key === 'instant') return // premium only
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleCat = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleSaveProfile = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handleSavePrefs = () => {
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 2000)
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* ── SIDEBAR ── */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="glass-gradient border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-3xl -z-10" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-[1.5rem] bg-amber-gradient p-1 mb-4 shadow-glow-amber/20 group-hover:rotate-6 transition-transform">
                <div className="w-full h-full rounded-[1.2rem] bg-bg flex items-center justify-center font-syne text-2xl font-black text-amber">
                  AO
                </div>
              </div>
              <h3 className="font-syne text-lg font-black text-[#F0EDE6] mb-1">Adewale Okafor</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-dark mb-6">Standard Member</p>
              
              <Link href="/pricing" className="w-full">
                <button className="btn-primary w-full py-3 px-6 rounded-xl shadow-glow-amber text-bg font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Zap size={14} className="fill-current" />
                  Upgrade Elite
                </button>
              </Link>
            </div>

            <div className="h-px bg-white/5 my-8" />

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
                        ? 'bg-white/5 text-amber border border-white/10 shadow-inner' 
                        : 'text-muted-dark hover:text-[#F0EDE6] hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className={`${isActive ? 'text-amber drop-shadow-glow-amber' : ''}`}>
                      <Icon size={18} />
                    </div>
                    {item.label}
                    {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-amber shadow-glow-amber" />}
                  </button>
                )
              })}
            </nav>

            <div className="h-px bg-white/5 my-8" />
            
            <Link href="/login" className="flex items-center gap-4 px-5 py-3 text-danger/60 hover:text-danger font-black uppercase tracking-widest text-[10px] transition-colors group/logout">
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out Securely
            </Link>
          </div>

          {/* Sidebar Banner */}
          <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 text-center hidden lg:block overflow-hidden relative group">
             <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
             <h4 className="font-syne font-black text-white text-sm mb-2">Join the Elite</h4>
             <p className="text-[10px] text-subtle font-bold mb-4">4,200+ members got hired or funded this month.</p>
             <Link href="/pricing" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline block">
               Learn more →
             </Link>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 space-y-10 min-w-0">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="animate-fade-up space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="font-syne text-4xl md:text-5xl font-black text-[#F0EDE6] tracking-tighter mb-2">
                    Welcome, <span className="text-amber-gradient drop-shadow-glow-amber">Adewale</span>
                  </h1>
                  <p className="text-subtle font-medium">You have 3 deadlines approaching this week.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-muted-dark cursor-help">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-muted-dark cursor-help">
                    <Settings size={20} />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { num: '3', label: 'Saved Items', icon: <Heart size={20} />, trend: '+1 this week' },
                  { num: '2', label: 'Applications', icon: <Check size={20} />, trend: '1 pending review' },
                  { num: '3', label: 'Urgent Deadlines', icon: <Clock size={20} />, trend: 'Within 7 days', alert: true },
                  { num: '28', label: 'Alerts Received', icon: <Bell size={20} />, trend: 'Global scan' },
                ].map((s, idx) => (
                  <div key={idx} className="glass-gradient border border-white/5 rounded-3xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl -z-10 group-hover:scale-150 transition-transform" />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 shadow-inner ${s.alert ? 'bg-danger/10 text-danger' : 'bg-white/5 text-subtle'}`}>
                      {s.icon}
                    </div>
                    <div className="font-syne text-4xl font-black text-[#F0EDE6] mb-1">{s.num}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-dark mb-4">{s.label}</p>
                    <p className={`text-[10px] font-bold ${s.alert ? 'text-danger' : 'text-success'}`}>{s.trend}</p>
                  </div>
                ))}
              </div>

              {/* Deadlines Section */}
              <div className="glass-gradient border border-white/5 rounded-[2.5rem] p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-amber/10 text-amber shadow-inner">
                      <Clock size={20} />
                    </div>
                    <h2 className="font-syne text-xl font-black text-white">Critical Deadlines</h2>
                  </div>
                  <Link href="/opportunities" className="text-amber font-black uppercase tracking-widest text-[10px] hover:opacity-80">View All</Link>
                </div>
                
                <div className="space-y-4">
                  {deadlines.map((opp) => (
                    <Link key={opp.id} href={`/opportunities/${opp.id}`} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber/20 hover:bg-white/[0.05] transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:rotate-3 transition-transform">
                          {opp.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#F0EDE6] group-hover:text-amber transition-colors">{opp.title}</h4>
                          <p className="text-xs text-muted-dark font-medium">{opp.org}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${opp.days <= 7 ? 'bg-danger/10 text-danger' : 'bg-amber/10 text-amber'}`}>
                          {opp.days}d Left
                        </span>
                        <ChevronRight size={18} className="text-muted-dark group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recommended List */}
              <div className="section-reveal">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-inner">
                    <Sparkles size={20} />
                  </div>
                  <h2 className="font-syne text-xl font-black text-white">Recommended For You</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommended.map((opp) => (
                    <OpportunityCard key={opp.id} opp={opp} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SAVED ITEMS TAB */}
          {activeTab === 'saved' && (
            <div className="animate-fade-up space-y-8">
              <div>
                <h1 className="font-syne text-4xl font-black text-white tracking-tighter mb-2">Saved <span className="text-amber">Items</span></h1>
                <p className="text-subtle font-medium">Keep track of opportunities you&apos;re planning to apply for.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedOpps.map((opp) => (
                  <OpportunityCard key={opp.id} opp={opp} />
                ))}
              </div>
            </div>
          )}

          {/* SMART ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div className="animate-fade-up space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="font-syne text-4xl font-black text-white tracking-tighter mb-2">Smart <span className="text-amber">Alerts</span></h1>
                  <p className="text-subtle font-medium">Don&apos;t wait for luck. Get notified before everyone else.</p>
                </div>
                <div className="badge badge-amber bg-amber/10 border-amber/20 text-amber px-6 py-2 shadow-glow-amber/10">3 Active Channels</div>
              </div>

              <div className="glass-gradient border border-amber/20 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-amber/10 flex items-center justify-center text-amber shrink-0 self-start lg:self-center">
                    <Zap size={40} className="fill-current" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-syne text-xl font-black text-white mb-2">Unlock Zero-Latency Alerts</h3>
                    <p className="text-subtle text-sm font-medium leading-relaxed">
                      Our Elite members get instant Telegram and SMS notifications 24-48 hours before opportunities hit our public index. In high-demand roles, speed is your biggest advantage.
                    </p>
                  </div>
                  <Link href="/pricing" className="shrink-0 w-full lg:w-auto">
                    <button className="btn-primary px-10 py-5 rounded-2xl shadow-glow-amber text-bg font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.05] transition-all">
                      Upgrade to Elite
                    </button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { key: 'newOpps' as const, icon: Mail, label: 'Opportunity Blast', sub: 'Instant email for matches in your niches', premium: false },
                  { key: 'deadlines' as const, icon: Clock, label: 'Final Call Reminders', sub: 'Reminders 48h before closing dates', premium: false },
                  { key: 'digest' as const, icon: BarChart3, label: 'Weekly Performance', sub: 'Summary of all matches and market trends', premium: false },
                  { key: 'instant' as const, icon: Zap, label: 'Instant Telegram Pushes', sub: 'Real-time verified listing notifications', premium: true },
                ].map((a) => (
                  <div key={a.key} className="glass-gradient border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group hover:border-white/10 transition-all">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${a.premium ? 'bg-amber/10 border-amber/20 text-amber' : 'bg-white/5 border-white/5 text-subtle'}`}>
                      <a.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-white text-sm">{a.label}</span>
                        {a.premium && <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber text-bg shadow-glow-amber">Premium</span>}
                      </div>
                      <p className="text-xs text-muted-dark font-medium">{a.sub}</p>
                    </div>
                    <button 
                      onClick={() => toggleAlert(a.key)}
                      disabled={a.premium}
                      className={`w-12 h-6 rounded-full relative transition-all duration-500 ${alerts[a.key] ? 'bg-amber' : 'bg-white/10'} ${a.premium ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
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
                <h1 className="font-syne text-4xl font-black text-white tracking-tighter mb-2">Profile <span className="text-amber">Settings</span></h1>
                <p className="text-subtle font-medium">Keep your professional profile current for better machine-learning matches.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Basic Info */}
                <div className="glass-gradient border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8">
                  <h3 className="font-syne text-xl font-black text-white flex items-center gap-3">
                    <User size={20} className="text-amber" />
                    Identity Details
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">First Name</label>
                       <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">Last Name</label>
                       <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">Global Identifier (Email)</label>
                     <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">Region</label>
                       <select className="w-full bg-[#1A1F15] border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all cursor-pointer appearance-none" value={country} onChange={e => setCountry(e.target.value)}>
                         <option>Nigeria</option>
                         <option>Ghana</option>
                         <option>Kenya</option>
                         <option>South Africa</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">Career Status</label>
                       <select className="w-full bg-[#1A1F15] border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all cursor-pointer appearance-none" value={status} onChange={e => setStatus(e.target.value)}>
                         <option>University Student</option>
                         <option>Recent Graduate</option>
                         <option>Professional</option>
                         <option>Entrepreneur</option>
                       </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveProfile}
                    className="btn-primary w-full py-4 rounded-2xl shadow-glow-amber text-bg font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    {profileSaved ? <Check size={18} /> : 'Sync Profile Updates'}
                  </button>
                </div>

                {/* Match Preferences */}
                <div className="glass-gradient border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8">
                  <h3 className="font-syne text-xl font-black text-white flex items-center gap-3">
                    <Sparkles size={20} className="text-primary" />
                    Discovery Filters
                  </h3>
                  
                  <p className="text-xs text-subtle font-medium leading-relaxed">
                    Select the niches you want our AI engine to monitor. You will prioritize these in your daily digest.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {['Scholarships', 'Fellowships', 'Remote Jobs', 'Grants', 'Internships', 'Startup Funding'].map(cat => {
                      const isSelected = selectedCats.includes(cat)
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCat(cat)}
                          className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            isSelected 
                              ? 'bg-primary/20 border-primary/40 text-primary shadow-glow-primary/10' 
                              : 'bg-white/5 border-white/10 text-muted-dark hover:border-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    })}
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 text-center space-y-4">
                    <ShieldCheck size={32} className="mx-auto text-muted-dark" />
                    <h4 className="font-bold text-sm text-white">Trust & Security</h4>
                    <p className="text-[10px] text-muted-dark font-medium leading-relaxed">
                      Your data is encrypted end-to-end. We never sell your personal metrics to third-party advertisers.
                    </p>
                  </div>

                  <button 
                    onClick={handleSavePrefs}
                    className="btn-ghost !border-primary/20 text-primary w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
                  >
                    {prefsSaved ? <Check size={18} /> : 'Save Filter Cluster'}
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
