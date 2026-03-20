'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { Send, CheckCircle, ArrowLeft, Building2, Mail, MapPin, Calendar, DollarSign, FileText, Globe, Link2, AtSign } from 'lucide-react'

const listingTypes = [
  'Scholarship',
  'Job',
  'Fellowship',
  'Grant',
  'Internship',
  'Startup Funding',
  'Bootcamp',
  'Event',
]

const costOptions = ['Free', 'Paid', 'Subsidised', 'Fully Funded', 'Partial Funding']

export default function PostListingPage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    orgName: '',
    contactEmail: '',
    listingType: 'Bootcamp',
    title: '',
    location: '',
    isOnline: false,
    startDate: '',
    deadline: '',
    cost: 'Free',
    description: '',
    eligibility: '',
    benefits: '',
    applicationUrl: '',
    organizerWebsite: '',
    socialHandle: '',
  })

  const update = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/submit-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center py-20 animate-fade-up">
          <div className="w-24 h-24 rounded-[2rem] bg-success/10 text-success flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle size={48} />
          </div>
          <h1 className="font-syne text-4xl font-black text-primary mb-4">Submitted Successfully!</h1>
          <p className="text-subtle text-lg font-medium mb-4 leading-relaxed">
            We will review your listing within 24 hours.
          </p>
          <p className="text-muted text-sm font-medium mb-10">
            We will email you at <strong className="text-primary">{form.contactEmail}</strong> once it goes live.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/opportunities" className="btn-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
              Browse Opportunities
            </Link>
            <button onClick={() => { setSubmitted(false); setForm({ ...form, title: '', description: '', eligibility: '', benefits: '', applicationUrl: '' }) }} className="btn-ghost px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
              Submit Another
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-up">
          <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-amber font-bold text-xs uppercase tracking-[0.2em] transition-all group mb-8 block">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2.5 bg-amber/10 border border-amber/20 rounded-full px-5 py-2 mb-6">
            <Send size={14} className="text-amber" />
            <span className="text-amber font-bold text-xs uppercase tracking-widest font-syne">For Organizations</span>
          </div>
          <h1 className="font-syne text-4xl md:text-6xl font-black text-primary tracking-tighter mb-4">
            Post a <span className="text-amber-gradient drop-shadow-glow-amber">Listing</span>
          </h1>
          <p className="text-subtle text-lg font-medium max-w-2xl">
            Submit your bootcamp, event, scholarship, or job to reach 48,000+ African students and graduates. Free to submit.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-up animate-delay-100">
          {/* Organization Info */}
          <div className="glass-gradient border rounded-[2.5rem] p-8 md:p-10 space-y-6" style={{borderColor: 'var(--border)'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{backgroundColor: 'var(--amber-dim)'}}>
                <Building2 size={20} className="text-amber" />
              </div>
              <h2 className="font-syne text-xl font-black text-primary">Organization Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Organization / Company Name *</label>
                <input required value={form.orgName} onChange={e => update('orgName', e.target.value)} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="e.g. ALX Africa" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Contact Email *</label>
                <input required type="email" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="you@company.com" />
              </div>
            </div>
          </div>

          {/* Listing Details */}
          <div className="glass-gradient border rounded-[2.5rem] p-8 md:p-10 space-y-6" style={{borderColor: 'var(--border)'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{backgroundColor: 'var(--amber-dim)'}}>
                <FileText size={20} className="text-amber" />
              </div>
              <h2 className="font-syne text-xl font-black text-primary">Listing Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Listing Type *</label>
                <select required value={form.listingType} onChange={e => update('listingType', e.target.value)} className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all cursor-pointer appearance-none">
                  {listingTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Title *</label>
                <input required value={form.title} onChange={e => update('title', e.target.value)} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="e.g. Google I/O Extended Lagos 2025" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Location *</label>
                <input required value={form.location} onChange={e => update('location', e.target.value)} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="e.g. Lagos, Nigeria" disabled={form.isOnline} />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={form.isOnline} onChange={e => { update('isOnline', e.target.checked); if (e.target.checked) update('location', 'Online / Remote') }} className="rounded accent-amber" />
                  <span className="text-xs text-muted font-bold">Online / Remote</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Cost</label>
                <select value={form.cost} onChange={e => update('cost', e.target.value)} className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all cursor-pointer appearance-none">
                  {costOptions.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Start Date</label>
                <input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all cursor-pointer" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">End Date / Deadline *</label>
                <input required type="date" value={form.deadline} onChange={e => update('deadline', e.target.value)} className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all cursor-pointer" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Description *</label>
              <textarea required value={form.description} onChange={e => update('description', e.target.value)} rows={4} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all resize-none" placeholder="Describe your program, event, or opportunity..." />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Eligibility Requirements *</label>
              <textarea required value={form.eligibility} onChange={e => update('eligibility', e.target.value)} rows={3} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all resize-none" placeholder="Who can apply? Age, nationality, experience..." />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Benefits / What Attendees Get *</label>
              <textarea required value={form.benefits} onChange={e => update('benefits', e.target.value)} rows={3} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all resize-none" placeholder="Certificate, networking, funding, swag..." />
            </div>
          </div>

          {/* Links */}
          <div className="glass-gradient border rounded-[2.5rem] p-8 md:p-10 space-y-6" style={{borderColor: 'var(--border)'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{backgroundColor: 'var(--amber-dim)'}}>
                <Link2 size={20} className="text-amber" />
              </div>
              <h2 className="font-syne text-xl font-black text-primary">Links</h2>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Application / Registration URL *</label>
              <input required type="url" value={form.applicationUrl} onChange={e => update('applicationUrl', e.target.value)} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="https://..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Organizer Website (Optional)</label>
                <input type="url" value={form.organizerWebsite} onChange={e => update('organizerWebsite', e.target.value)} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Social Media Handle (Optional)</label>
                <input value={form.socialHandle} onChange={e => update('socialHandle', e.target.value)} className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="@yourhandle" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 rounded-2xl shadow-glow-amber font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit for Review'}
            <Send size={18} />
          </button>

          <p className="text-center text-[10px] text-muted font-bold uppercase tracking-widest">
            Free submission · Reviewed within 24 hours · No spam
          </p>
        </form>
      </div>
      <Footer />
    </main>
  )
}
