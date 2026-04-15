'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategoryLabel, calculateDaysRemaining } from '@/lib/utils'
import Toast from '@/components/Toast'
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

function UsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetch('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${(() => { try { return JSON.parse(localStorage.getItem('user') || '{}').token || '' } catch { return '' } })()}`,
      },
    })
      .then(r => r.json())
      .then(data => { if (data.data) setUsers(data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const token = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}').token || '' } catch { return '' } })()
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) {
        setToast({ message: data.error || 'Failed to update user', type: 'error' })
        return
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u))
      setToast({ message: `User promoted to ${status}`, type: 'success' })
    } catch {
      setToast({ message: 'Network error', type: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 text-center">
        <Loader2 size={32} className="mx-auto text-emerald animate-spin mb-4" />
        <p className="text-muted font-bold text-sm">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <h3 className="text-primary font-bold">{users.length} Registered Users</h3>
      <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--icon-bg)]">
                {['Name', 'Email', 'Plan / Status', 'Joined', 'Action'].map((h) => (
                  <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-surface2/30 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="font-bold text-primary text-sm">{u.full_name || 'Anonymous'}</div>
                  </td>
                  <td className="px-8 py-6 text-[11px] text-muted font-bold uppercase tracking-wider opacity-70">{u.email}</td>
                  <td className="px-8 py-6">
                    {u.status === 'admin' ? (
                      <span className="px-4 py-1.5 rounded-full bg-emerald/10 border border-emerald/30 text-emerald text-[9px] font-black uppercase tracking-widest shadow-sm shadow-emerald/5">
                        System Admin
                      </span>
                    ) : u.status === 'premium' ? (
                      <span className="px-4 py-1.5 rounded-full bg-emerald/10 border border-emerald/30 text-emerald text-[9px] font-black uppercase tracking-widest shadow-sm shadow-emerald/5">
                        Elite Member
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 rounded-full bg-surface2 border border-border text-muted text-[9px] font-black uppercase tracking-widest">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-xs text-subtle font-medium">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-8 py-6">
                    {u.status === 'admin' ? (
                      <span className="text-muted opacity-30">—</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateUserStatus(u.id, 'admin')}
                          className="px-4 py-2 bg-emerald/10 border border-emerald/30 text-emerald rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald hover:text-black transition-all"
                        >
                          Dev Admin
                        </button>
                        {u.status !== 'premium' && (
                          <button
                            onClick={() => updateUserStatus(u.id, 'premium')}
                            className="px-4 py-2 bg-surface border border-border text-muted rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-emerald hover:text-emerald transition-all"
                          >
                            Set Premium
                          </button>
                        )}
                      </div>
                    )}
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
        <Loader2 size={32} className="mx-auto text-emerald animate-spin mb-4" />
        <p className="text-muted font-bold text-sm">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h3 className="text-2xl font-serif font-bold text-primary">{events.length} Live Opportunities</h3>
        <Link href="/organizer/create" className="px-8 py-4 bg-emerald text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald/10 hover:scale-105 active:scale-95 transition-all">
          Index Opportunity
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
                        event.is_featured ? "bg-emerald/10 border-emerald/30 text-emerald" : "bg-[var(--icon-bg)] border-[var(--border)] text-muted"
                      }`}
                    >
                      <Star size={16} fill={event.is_featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <Link href={`/events/${event.slug}`} target="_blank" className="p-2.5 rounded-xl bg-[var(--icon-bg)] border border-[var(--border)] text-muted hover:text-emerald transition-all">
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
        <Loader2 size={32} className="mx-auto text-emerald animate-spin mb-4" />
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

function SyncTab({ syncLogs, onSyncTrigger }: { syncLogs: any[], onSyncTrigger: () => Promise<void> }) {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    await onSyncTrigger()
    setIsSyncing(false)
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface/30 border border-border/40 rounded-[2.5rem] p-10 backdrop-blur-xl">
        <div className="space-y-2">
          <h3 className="font-syne text-2xl font-black text-primary">Opportunity Sync Center</h3>
          <p className="text-subtle text-sm font-medium max-w-md">Orchestrate live data ingestion from Adzuna and Jooble. System triggers automatically every 12 hours.</p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="px-10 py-5 bg-emerald text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald/10 flex items-center gap-3 disabled:opacity-50"
        >
          {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} className="fill-current" />}
          {isSyncing ? 'Synchronizing Index...' : 'Force System Sync'}
        </button>
      </div>

      <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] overflow-hidden">
        <div className="px-10 py-8 border-b border-border/20">
          <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-muted">Transmission History</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--icon-bg)]">
                {['Sequence ID', 'Source', 'Status', 'Payload', 'Latency', 'Timestamp'].map((h) => (
                  <th key={h} className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {syncLogs && syncLogs.length > 0 ? syncLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--icon-bg)] transition-colors group">
                  <td className="px-10 py-6">
                    <div className="font-mono text-[10px] text-muted truncate w-32">{log.id}</div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-3 py-1 rounded-lg bg-surface2 border border-border text-[9px] font-black uppercase tracking-widest text-primary">
                      {log.source}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                      log.status === 'success' ? 'text-success' : log.status === 'partial' ? 'text-emerald' : 'text-danger'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        log.status === 'success' ? 'bg-success' : log.status === 'partial' ? 'bg-emerald' : 'bg-danger'
                      }`} />
                      {log.status}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="text-xs font-bold text-primary">
                      +{log.items_added} New · -{log.items_deleted || 0} Stale
                    </div>
                  </td>
                  <td className="px-10 py-6 text-xs text-subtle font-medium">{log.duration_ms}ms</td>
                  <td className="px-10 py-6 text-xs font-bold text-muted uppercase tracking-wider opacity-70">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Inbox size={48} />
                      <p className="text-xs font-black uppercase tracking-widest">No transmissions recorded yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('opps')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [adminToast, setAdminToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [liveOpps, setLiveOpps] = useState<any[]>([])
  const [liveStats, setLiveStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: 'scholarship',
    location: 'Remote',
    deadline: '',
    description: '',
    application_url: ''
  })

  useEffect(() => {
    if (showCreateModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showCreateModal])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) setCurrentUser(JSON.parse(stored))
    } catch {}
  }, [])

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
        <div className="w-16 h-16 border-4 border-[var(--border)] border-t-emerald rounded-full animate-spin" />
        <p className="text-sm font-bold text-emerald uppercase tracking-widest animate-pulse">Initializing Terminal...</p>
      </div>
    )
  }

  const statCards = [
    { num: liveStats?.totalOpps || '0', label: 'Total Listings', change: '+Active DB listings', icon: TrendingUp, color: 'emerald' },
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
    { id: 'sync', label: 'Sync Control' },
  ]

  const triggerManualSync = async () => {
    try {
      const token = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}').token || '' } catch { return '' } })()
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        const adzunaCount = data.results?.adzuna || 0
        const joobleCount = data.results?.jooble || 0
        const totalNew = adzunaCount + joobleCount
        const deletedCount = data.results?.deleted || 0
        const errorsArr: string[] = data.results?.errors || []
        
        let msg = `Sync complete: +${totalNew} new, -${deletedCount} stale`
        if (errorsArr.length > 0) msg += ` (${errorsArr.length} warning${errorsArr.length > 1 ? 's' : ''})`
        setAdminToast({ message: msg, type: totalNew > 0 ? 'success' : 'success' })

        // Refresh stats AND sync logs (syncLogs are embedded in the stats response)
        const statsRes = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          if (statsData) setLiveStats(statsData)
        }
      } else {
        setAdminToast({ message: data.error || 'Sync failed', type: 'error' })
      }
    } catch {
      setAdminToast({ message: 'Network error during sync', type: 'error' })
    }
  }

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
        setFormData({ title: '', organization: '', category: 'scholarship', location: 'Remote', deadline: '', description: '', application_url: '' })
        setTimeout(() => {
          setShowCreateModal(false)
          setPublishSuccess(false)
        }, 1500)
      } else {
        let errMsg = res.statusText
        try {
          const errData = await res.json()
          if (errData && errData.error) errMsg = errData.error
        } catch(e) {}
        alert(`Failed to create opportunity: ${errMsg} (Status ${res.status})`)
      }
    } catch (err: any) {
      console.error(err)
      alert(`Network error: ${err.message}`)
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
      {adminToast && (
        <Toast message={adminToast.message} type={adminToast.type} onClose={() => setAdminToast(null)} />
      )}
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[9px] uppercase tracking-[0.2em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Restricted Terminal — Level 4 Access
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-black text-primary tracking-tight mb-2">
              System <span className="text-emerald italic">Control.</span>
            </h1>
            <p className="text-muted text-xl font-medium max-w-xl">Global management of the African opportunity index.</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative px-10 py-5 bg-emerald text-black font-black uppercase text-xs tracking-[0.2em] rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald/10 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Deploy New Data</span>
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
                    ? 'bg-[var(--icon-bg)] text-emerald border border-[var(--glass-border)] shadow-inner' 
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
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald transition-colors" />
                  <input
                    placeholder="Search global clusters..."
                    className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl py-4 pl-14 pr-4 text-sm font-bold text-primary focus:outline-none focus:border-emerald/30 transition-all shadow-inner"
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
                            <div className="font-bold text-primary group-hover:text-emerald transition-colors">{opp.title}</div>
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
                               <Link href={`/opportunities/${opp.id}`} target="_blank" className="p-2.5 rounded-xl bg-[var(--icon-bg)] border border-[var(--border)] text-muted hover:text-emerald hover:border-emerald/20 transition-all cursor-pointer">
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
            <UsersTab />
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Top KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Listings', value: liveStats?.totalOpps ?? '—', sub: 'Active in DB', color: '#E8A020' },
                  { label: 'Registered Users', value: liveStats?.totalUsers ?? '—', sub: 'Since launch', color: '#34C27A' },
                  { label: 'Premium Members', value: liveStats?.premiumUsers ?? '—', sub: 'Active subscriptions', color: '#4A9EE8' },
                  { label: 'Est. Revenue', value: liveStats?.estimatedRevenue ? `₦${Number((liveStats.estimatedRevenue / 1000).toFixed(1))}K` : '₦0', sub: 'Estimated total', color: '#8B5CF6' },
                ].map((kpi, i) => (
                  <div key={i} className="glass-gradient border border-[var(--border)] rounded-[2rem] p-8">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted mb-3">{kpi.label}</div>
                    <div className="font-syne text-3xl font-black" style={{ color: kpi.color }}>{kpi.value}</div>
                    <div className="text-[10px] text-muted mt-2">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* User breakdown */}
              <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 space-y-6">
                <h3 className="font-syne text-lg font-black text-primary">User Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Free Users', value: (liveStats?.totalUsers || 0) - (liveStats?.premiumUsers || 0), color: 'bg-white/10', textColor: '#9A9C8E' },
                    { label: 'Premium Members', value: liveStats?.premiumUsers || 0, color: 'bg-[#34C27A]', textColor: '#34C27A' },
                  ].map((row, i) => {
                    const total = liveStats?.totalUsers || 1
                    const pct = Math.round((row.value / total) * 100)
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-primary">{row.label}</span>
                          <span style={{ color: row.textColor }}>{row.value} &nbsp;({pct}%)</span>
                        </div>
                        <div className="h-2 bg-[var(--icon-bg)] rounded-full overflow-hidden">
                          <div className={`h-full ${row.color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Platform info */}
              <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10">
                <h3 className="font-syne text-lg font-black text-primary mb-6">Platform Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                  {[
                    { label: 'Database', value: process.env.NODE_ENV === 'production' ? 'Neon PostgreSQL' : 'Connected', status: true },
                    { label: 'Environment', value: 'Production', status: true },
                    { label: 'Region', value: 'West Africa Focus', status: true },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">{item.label}</div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        <span className="font-bold text-primary text-xs">{item.value}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

          {/* SYNC TAB */}
          {activeTab === 'sync' && (
            <SyncTab 
              syncLogs={liveStats?.syncLogs || []} 
              onSyncTrigger={triggerManualSync}
            />
          )}
        </div>
      </div>

      {/* ── CREATE MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-bg/80 backdrop-blur-xl animate-fade-in overflow-y-auto" onClick={() => setShowCreateModal(false)}>
          <div className="bg-bg2 border border-[var(--glass-border)] rounded-[3rem] p-8 md:p-14 w-full max-w-2xl shadow-premium relative my-auto" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/5 blur-[100px] -z-10" />
            
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
                    <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-emerald/30 transition-all" placeholder="e.g. Mandela Rhodes 2025" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Parent Org</label>
                    <input value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-emerald/30 transition-all" placeholder="e.g. MRF Foundation" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Cluster Type</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-emerald/30 transition-all cursor-pointer appearance-none">
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
                    <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-emerald/30 transition-all cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Location / Target</label>
                    <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-emerald/30 transition-all" placeholder="e.g. Remote, Nigeria, Global" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Opportunity Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-medium text-primary focus:outline-none focus:border-emerald/30 transition-all min-h-[120px] resize-none" 
                    placeholder="Provide details about the eligibility, benefits, and how to apply..." 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Access URL</label>
                  <div className="relative group">
                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald transition-colors" />
                    <input value={formData.application_url} onChange={e => setFormData({...formData, application_url: e.target.value})} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-primary focus:outline-none focus:border-emerald/30 transition-all" placeholder="https://..." />
                  </div>
                </div>

                <button 
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="btn-primary w-full py-5 rounded-2xl shadow-glow-emerald text-bg font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
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
