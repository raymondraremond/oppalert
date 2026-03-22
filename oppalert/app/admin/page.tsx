'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategoryLabel, calculateDaysRemaining } from '@/lib/utils'
import {
  Plus,
  Search,
  Pin,
  Home,
  Star,
  X,
  Edit2,
  Trash2,
  TrendingUp,
  Users,
  Crown,
  DollarSign,
  Eye,
  ArrowRight,
  Loader2,
  Check,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Globe,
  Zap,
  Inbox,
} from 'lucide-react'

function EventsTab() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = () => {
    setLoading(true)
    fetch("/api/admin/events")
      .then(r => r.json())
      .then(data => {
        if (data.data) setEvents(data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_featured: !current }),
      })
      setEvents(prev => prev.map(e => e.id === id ? { ...e, is_featured: !current } : e))
    } catch (err) {
      console.error("Toggle featured error:", err)
    }
  }

  const deactivateEvent = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this event?")) return
    try {
      await fetch("/api/admin/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setEvents(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error("Deactivate error:", err)
    }
  }

  if (loading) {
    return (
      <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 text-center">
        <Loader2 size={32} className="mx-auto text-amber animate-spin mb-4" />
        <p className="text-muted font-bold text-sm">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-primary font-bold">{events.length} Active Events</h3>
        <Link href="/organizer/create" className="px-5 py-2 bg-[#E8A020] text-[#080A07] font-bold rounded-xl text-xs uppercase tracking-widest">
          Create Event
        </Link>
      </div>

      <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--icon-bg)]">
                {["Event", "Organizer", "Type", "Date", "Regs", "Featured", "Control"].map((h) => (
                  <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-[var(--icon-bg)] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-primary">{event.title}</div>
                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">/{event.slug}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs text-primary font-bold">{event.organization_name || event.organizer_name}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="badge badge-blue">{event.event_type}</span>
                  </td>
                  <td className="px-8 py-6 text-xs text-subtle font-medium">
                    {new Date(event.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-bold text-primary">{event.current_registrations || 0}</div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleFeatured(event.id, event.is_featured)}
                      className={`p-2 rounded-xl border transition-all ${
                        event.is_featured ? "bg-amber/10 border-amber/30 text-amber" : "bg-[var(--icon-bg)] border-[var(--border)] text-muted"
                      }`}
                    >
                      <Star size={16} fill={event.is_featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <Link href={`/events/${event.slug}`} target="_blank" className="p-2.5 rounded-xl bg-[var(--icon-bg)] border border-[var(--border)] text-muted hover:text-amber transition-all">
                         <Eye size={16} />
                       </Link>
                       <button 
                        onClick={() => deactivateEvent(event.id)}
                        className="p-2.5 rounded-xl bg-[var(--icon-bg)] border border-[var(--border)] text-muted hover:text-danger hover:border-danger/20 transition-all"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSubmissions(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      setSubmissions(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Action error:', err)
    }
  }

  if (loading) {
    return (
      <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 text-center">
        <Loader2 size={32} className="mx-auto text-amber animate-spin mb-4" />
        <p className="text-muted font-bold text-sm">Loading submissions...</p>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 text-center space-y-4">
        <Inbox size={48} className="mx-auto text-muted opacity-40" />
        <h3 className="font-syne text-xl font-black text-primary">No Pending Submissions</h3>
        <p className="text-subtle font-medium max-w-sm mx-auto">When organizations submit listings via the Post a Listing form, they will appear here for review.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub: any) => (
        <div key={sub.id} className="glass-gradient border border-[var(--border)] rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="font-syne text-lg font-black text-primary mb-1">{sub.title}</h3>
              <p className="text-xs text-muted font-bold uppercase tracking-widest">{sub.org_name} · {sub.listing_type}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleAction(sub.id, 'approve')} className="px-6 py-2.5 rounded-xl bg-success/10 text-success text-xs font-black uppercase tracking-widest hover:bg-success/20 transition-all">Approve</button>
              <button onClick={() => handleAction(sub.id, 'reject')} className="px-6 py-2.5 rounded-xl bg-danger/10 text-danger text-xs font-black uppercase tracking-widest hover:bg-danger/20 transition-all">Reject</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-3">
            <div><span className="text-muted">Location:</span> <span className="text-primary font-bold">{sub.location}</span></div>
            <div><span className="text-muted">Cost:</span> <span className="text-primary font-bold">{sub.cost}</span></div>
            <div><span className="text-muted">Deadline:</span> <span className="text-primary font-bold">{sub.deadline ? new Date(sub.deadline).toLocaleDateString() : 'Rolling'}</span></div>
            <div><span className="text-muted">Contact:</span> <span className="text-primary font-bold">{sub.contact_email}</span></div>
          </div>
          <p className="text-sm text-subtle font-medium line-clamp-2">{sub.description}</p>
        </div>
      ))}
    </div>
  )
}

const barData = [40, 55, 48, 72, 88, 108]
const barMonths = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('opps')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [liveOpps, setLiveOpps] = useState<any[]>([])
  const [liveStats, setLiveStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: 'scholarship',
    deadline: '',
    application_url: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, oppsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/opportunities?limit=100')
        ])
        const statsData = await statsRes.json()
        const oppsData = await oppsRes.json()
        
        if (statsData) setLiveStats(statsData)
        if (oppsData.data) setLiveOpps(oppsData.data)
      } catch (err) {
        console.error('Failed to fetch admin data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="w-16 h-16 border-4 border-[var(--border)] border-t-amber rounded-full animate-spin" />
        <p className="text-sm font-bold text-amber uppercase tracking-widest animate-pulse">Initializing Terminal...</p>
      </div>
    )
  }

  const statCards = [
    { num: liveStats?.totalOpps || '0', label: 'Total Listings', change: '+Active DB listings', icon: TrendingUp, color: 'amber' },
    { num: liveStats?.totalUsers || '0', label: 'Registered Users', change: 'Since launch', icon: Users, color: 'primary' },
    { num: liveStats?.premiumUsers || '0', label: 'Active Subscriptions', change: 'Managed Role', icon: Crown, color: 'blue' },
    { num: liveStats?.estimatedRevenue ? `₦${(liveStats.estimatedRevenue / 1000).toFixed(1)}K` : '₦0', label: 'Est. Revenue', change: 'Proxy Metric', icon: DollarSign, color: 'success' },
  ]

  const tabs = [
    { id: 'opps', label: 'Core Opportunities' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'users', label: 'User Directory' },
    { id: 'featured', label: 'Promotion Slots' },
    { id: 'analytics', label: 'System Analytics' },
  ]

  const handlePublish = async () => {
    if (!formData.title || !formData.application_url) return alert('Title and URL are required')
    setIsPublishing(true)
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        const newOpp = await res.json()
        setLiveOpps(prev => [newOpp, ...prev])
        setLiveStats((prev: any) => prev ? { ...prev, totalOpps: prev.totalOpps + 1 } : prev)
        setPublishSuccess(true)
        setFormData({ title: '', organization: '', category: 'scholarship', deadline: '', application_url: '' })
        setTimeout(() => {
          setShowCreateModal(false)
          setPublishSuccess(false)
        }, 1500)
      } else {
        alert('Failed to create opportunity')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this opportunity?')) return
    try {
      const res = await fetch(`/api/opportunities/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLiveOpps(prev => prev.filter(o => o.id !== id))
        setLiveStats((prev: any) => prev ? { ...prev, totalOpps: Math.max(0, prev.totalOpps - 1) } : prev)
      } else {
        alert('Failed to delete opportunity')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/10 border border-danger/20 text-danger font-black text-[8px] uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
              Restricted Admin Console
            </div>
            <h1 className="font-syne text-4xl md:text-6xl font-black text-primary tracking-tighter mb-2">
              System <span className="text-amber-gradient drop-shadow-glow-amber">Control</span>
            </h1>
            <p className="text-subtle font-medium">Global management of African opportunity clusters.</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary animate-fade-up px-8 py-4 rounded-2xl shadow-glow-amber text-bg font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.05] transition-all"
          >
            <Plus size={18} className="stroke-[3]" />
            New Opportunity
          </button>
        </div>

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up animate-delay-100">
          {statCards.map((s, idx) => (
            <div key={idx} className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-8 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--icon-bg)] blur-2xl -z-10 group-hover:scale-150 transition-transform" />
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner bg-${s.color}/10 text-${s.color}`}>
                 <s.icon size={24} />
               </div>
               <div className="font-syne text-4xl font-black text-primary mb-1">{s.num}</div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-4">{s.label}</p>
               <p className="text-[10px] font-bold text-success">{s.change}</p>
            </div>
          ))}
        </div>

        {/* ── INTERFACE TABS ── */}
        <div className="animate-fade-up animate-delay-200">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-[var(--border)]">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === t.id 
                    ? 'bg-[var(--icon-bg)] text-amber border border-[var(--glass-border)] shadow-inner' 
                    : 'text-muted hover:text-primary hover:bg-[var(--icon-bg)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="animate-fade-up animate-delay-300">
          {activeTab === 'opps' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-amber transition-colors" />
                  <input
                    placeholder="Search global clusters..."
                    className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl py-4 pl-14 pr-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all shadow-inner"
                  />
                </div>
                <div className="flex gap-4">
                  <button className="btn-ghost !border-[var(--glass-border)] px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:bg-[var(--icon-bg)]">
                    <Filter size={16} />
                    Category
                  </button>
                  <button className="btn-ghost !border-[var(--glass-border)] px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:bg-[var(--icon-bg)]">
                    <TrendingUp size={16} />
                    Status
                  </button>
                </div>
              </div>

              <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--icon-bg)]">
                        {['Entity', 'Cluster', 'Region', 'Status', 'Performance', 'Control'].map((h) => (
                          <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {liveOpps.map((opp) => {
                        const daysLeft = calculateDaysRemaining(opp.deadline)
                        return (
                        <tr key={opp.id} className="hover:bg-[var(--icon-bg)] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="font-bold text-primary group-hover:text-amber transition-colors">{opp.title}</div>
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">{opp.organization || opp.org || 'Independent'}</div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="badge badge-blue">{getCategoryLabel(opp.category || opp.cat)}</span>
                          </td>
                          <td className="px-8 py-6 text-xs text-subtle font-medium">{opp.location || opp.loc || 'Remote'}</td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${daysLeft > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                              {daysLeft > 0 ? 'Active' : 'Expired'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 text-xs font-bold text-primary">
                               <ArrowUpRight size={14} className="text-success" />
                               {Math.floor(Math.random() * 500) + 50} clicks
                             </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <Link href={`/opportunities/${opp.id}`} target="_blank" className="p-2.5 rounded-xl bg-[var(--icon-bg)] border border-[var(--border)] text-muted hover:text-amber hover:border-amber/20 transition-all cursor-pointer">
                                 <Eye size={16} />
                               </Link>
                               <button onClick={() => handleDelete(opp.id)} className="p-2.5 rounded-xl bg-[var(--icon-bg)] border border-[var(--border)] text-muted hover:text-danger hover:border-danger/20 transition-all">
                                 <Trash2 size={16} />
                               </button>
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUBMISSIONS TAB */}
          {activeTab === 'submissions' && (
            <SubmissionsTab />
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] overflow-hidden">
               <div className="p-10 text-center space-y-4">
                  <Users size={48} className="mx-auto text-muted opacity-40" />
                  <h3 className="font-syne text-xl font-black text-primary">Identity Management</h3>
                  <p className="text-subtle font-medium max-w-sm mx-auto">Access restricted to high-level system investigators. Full directory loading...</p>
                  <button className="btn-ghost !border-[var(--glass-border)] px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-primary hover:bg-[var(--icon-bg)]">View Raw Data</button>
               </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 space-y-8">
                     <h3 className="font-syne text-xl font-black text-primary">Revenue Trajectory</h3>
                     <div className="flex items-baseline gap-4">
                        <span className="font-syne text-5xl font-black text-amber">$12.4K</span>
                        <span className="text-success text-sm font-bold tracking-widest uppercase">+24% MoM</span>
                     </div>
                     <div className="h-48 flex items-end gap-3 px-4">
                       {barData.map((h, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                           <div 
                             style={{ height: `${h}px` }}
                             className={`w-full rounded-t-xl transition-all duration-1000 ${i === barData.length - 1 ? 'bg-amber-gradient shadow-glow-amber' : 'bg-white/10 group-hover/bar:bg-white/20'}`} 
                           />
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted">{barMonths[i]}</span>
                         </div>
                       ))}
                     </div>
                  </div>

                  <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 space-y-8">
                     <h3 className="font-syne text-xl font-black text-primary">Traffic Origins</h3>
                     <div className="space-y-6">
                       {[
                         { loc: 'Lagos, Nigeria', pct: 42, color: 'amber' },
                         { loc: 'Nairobi, Kenya', pct: 18, color: 'primary' },
                         { loc: 'Accra, Ghana', pct: 15, color: 'blue' },
                         { loc: 'Cape Town, SA', pct: 12, color: 'success' },
                       ].map((region, idx) => (
                         <div key={idx} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className="text-primary">{region.loc}</span>
                             <span className="text-muted">{region.pct}%</span>
                           </div>
                           <div className="h-2 bg-[var(--icon-bg)] rounded-full overflow-hidden">
                             <div 
                               className={`h-full bg-${region.color} transition-all duration-1000 delay-300`} 
                               style={{ width: `${region.pct}%` }}
                             />
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-xl animate-fade-in" onClick={() => setShowCreateModal(false)}>
          <div className="bg-bg2 border border-[var(--glass-border)] rounded-[3rem] p-10 md:p-14 w-full max-w-2xl shadow-premium relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] -z-10" />
            
            {publishSuccess ? (
              <div className="text-center py-20 animate-fade-up">
                <div className="w-24 h-24 rounded-[2rem] bg-success/10 text-success flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Check size={48} className="stroke-[3]" />
                </div>
                <h2 className="font-syne text-3xl font-black text-primary mb-4">Transmission Successful</h2>
                <p className="text-subtle font-medium">Opportunity cluster is now live on the global index.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-syne text-3xl font-black text-primary tracking-tighter mb-2">New Entry</h2>
                    <p className="text-sm text-subtle font-medium">Index a new verified African opportunity cluster.</p>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="p-3 rounded-2xl bg-[var(--icon-bg)] border border-[var(--border)] text-muted hover:text-primary transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Entity Title</label>
                    <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="e.g. Mandela Rhodes 2025" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Parent Org</label>
                    <input value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="e.g. MRF Foundation" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Cluster Type</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all cursor-pointer appearance-none">
                      <option value="scholarship">Scholarship</option>
                      <option value="fellowship">Fellowship</option>
                      <option value="grant">Grant</option>
                      <option value="job">Remote Job</option>
                      <option value="internship">Internship</option>
                      <option value="startup">Startup Funding</option>
                      <option value="bootcamp">Bootcamp</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Closing Sequence</label>
                    <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Access URL</label>
                  <div className="relative group">
                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-amber transition-colors" />
                    <input value={formData.application_url} onChange={e => setFormData({...formData, application_url: e.target.value})} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="https://..." />
                  </div>
                </div>

                <button 
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="btn-primary w-full py-5 rounded-2xl shadow-glow-amber text-bg font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPublishing ? 'Transmitting...' : 'Verify & Publish'}
                  <Zap size={18} className="fill-current" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
