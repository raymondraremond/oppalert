'use client'
import { useState, useEffect } from 'react'
import { opportunities } from '@/lib/data'
import { getCategoryLabel } from '@/lib/utils'
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
} from 'lucide-react'

const barData = [40, 55, 48, 72, 88, 108]
const barMonths = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('opps')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [liveStats, setLiveStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        const data = await res.json()
        setLiveStats(data)
      } catch (err) {
        console.error('Failed to fetch admin stats:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <div className="w-16 h-16 border-4 border-white/5 border-t-amber rounded-full animate-spin" />
        <p className="text-sm font-bold text-amber uppercase tracking-widest animate-pulse">Initializing Terminal...</p>
      </div>
    )
  }

  const statCards = [
    { num: '2,408', label: 'Total Listings', change: '+42 this week', icon: TrendingUp, color: 'amber' },
    { num: liveStats?.totalUsers || '0', label: 'Registered Users', change: '+100% since launch', icon: Users, color: 'primary' },
    { num: liveStats?.premiumUsers || '0', label: 'Active Subscriptions', change: 'Managed Role', icon: Crown, color: 'blue' },
    { num: '₦847K', label: 'Revenue (MTD)', change: '+18% vs last month', icon: DollarSign, color: 'success' },
  ]

  const tabs = [
    { id: 'opps', label: 'Core Opportunities' },
    { id: 'users', label: 'User Directory' },
    { id: 'featured', label: 'Promotion Slots' },
    { id: 'analytics', label: 'System Analytics' },
  ]

  const handlePublish = () => {
    setPublishSuccess(true)
    setTimeout(() => {
      setShowCreateModal(false)
      setPublishSuccess(false)
    }, 1500)
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
            <div key={idx} className="glass-gradient border border-white/5 rounded-[2.5rem] p-8 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl -z-10 group-hover:scale-150 transition-transform" />
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner bg-${s.color}/10 text-${s.color}`}>
                 <s.icon size={24} />
               </div>
               <div className="font-syne text-4xl font-black text-white mb-1">{s.num}</div>
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-dark mb-4">{s.label}</p>
               <p className="text-[10px] font-bold text-success">{s.change}</p>
            </div>
          ))}
        </div>

        {/* ── INTERFACE TABS ── */}
        <div className="animate-fade-up animate-delay-200">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === t.id 
                    ? 'bg-white/5 text-amber border border-white/10 shadow-inner' 
                    : 'text-muted-dark hover:text-white hover:bg-white/[0.02]'
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
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-dark group-focus-within:text-amber transition-colors" />
                  <input
                    placeholder="Search global clusters..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all shadow-inner"
                  />
                </div>
                <div className="flex gap-4">
                  <button className="btn-ghost !border-white/10 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:bg-white/5">
                    <Filter size={16} />
                    Category
                  </button>
                  <button className="btn-ghost !border-white/10 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:bg-white/5">
                    <TrendingUp size={16} />
                    Status
                  </button>
                </div>
              </div>

              <div className="glass-gradient border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        {['Entity', 'Cluster', 'Region', 'Status', 'Performance', 'Control'].map((h) => (
                          <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-dark">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {opportunities.map((opp) => (
                        <tr key={opp.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="font-bold text-primary group-hover:text-amber transition-colors">{opp.title}</div>
                            <div className="text-[10px] font-bold text-muted-dark uppercase tracking-widest mt-1">{opp.org}</div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="badge badge-blue">{opp.cat}</span>
                          </td>
                          <td className="px-8 py-6 text-xs text-subtle font-medium">{opp.loc}</td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${opp.days > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                              {opp.days > 0 ? 'Active' : 'Expired'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 text-xs font-bold text-white">
                               <ArrowUpRight size={14} className="text-success" />
                               1.2k clicks
                             </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-dark hover:text-amber hover:border-amber/20 transition-all">
                                 <Edit2 size={16} />
                               </button>
                               <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-dark hover:text-danger hover:border-danger/20 transition-all">
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
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="glass-gradient border border-white/5 rounded-[2.5rem] overflow-hidden">
               <div className="p-10 text-center space-y-4">
                  <Users size={48} className="mx-auto text-muted-dark opacity-40" />
                  <h3 className="font-syne text-xl font-black text-white">Identity Management</h3>
                  <p className="text-subtle font-medium max-w-sm mx-auto">Access restricted to high-level system investigators. Full directory loading...</p>
                  <button className="btn-ghost !border-white/10 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-white/5">View Raw Data</button>
               </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-gradient border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                     <h3 className="font-syne text-xl font-black text-white">Revenue Trajectory</h3>
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
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-dark">{barMonths[i]}</span>
                         </div>
                       ))}
                     </div>
                  </div>

                  <div className="glass-gradient border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                     <h3 className="font-syne text-xl font-black text-white">Traffic Origins</h3>
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
                             <span className="text-muted-dark">{region.pct}%</span>
                           </div>
                           <div className="h-2 bg-white/5 rounded-full overflow-hidden">
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
          <div className="bg-[#141710] border border-white/10 rounded-[3rem] p-10 md:p-14 w-full max-w-2xl shadow-premium relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] -z-10" />
            
            {publishSuccess ? (
              <div className="text-center py-20 animate-fade-up">
                <div className="w-24 h-24 rounded-[2rem] bg-success/10 text-success flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Check size={48} className="stroke-[3]" />
                </div>
                <h2 className="font-syne text-3xl font-black text-white mb-4">Transmission Successful</h2>
                <p className="text-subtle font-medium">Opportunity cluster is now live on the global index.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-syne text-3xl font-black text-white tracking-tighter mb-2">New Entry</h2>
                    <p className="text-sm text-subtle font-medium">Index a new verified African opportunity cluster.</p>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-muted-dark hover:text-white transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">Entity Title</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all" placeholder="e.g. Mandela Rhodes 2025" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">Parent Org</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all" placeholder="e.g. MRF Foundation" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">Cluster Type</label>
                    <select className="w-full bg-[#1A1F15] border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all cursor-pointer appearance-none">
                      <option>Scholarship</option>
                      <option>Fellowship</option>
                      <option>Grant</option>
                      <option>Remote Job</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">Closing Sequence</label>
                    <input type="date" className="w-full bg-[#1A1F15] border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-dark ml-1">Access URL</label>
                  <div className="relative group">
                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark group-focus-within:text-amber transition-colors" />
                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-amber/30 transition-all" placeholder="https://..." />
                  </div>
                </div>

                <button 
                  onClick={handlePublish}
                  className="btn-primary w-full py-5 rounded-2xl shadow-glow-amber text-bg font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  Verify & Publish
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
