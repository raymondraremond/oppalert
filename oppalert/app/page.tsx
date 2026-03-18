'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import Footer from '@/components/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import {
  GraduationCap,
  Briefcase,
  Globe,
  Coins,
  FlaskConical,
  Rocket,
  UserPlus,
  Search,
  Bookmark,
  Bell,
  ArrowRight,
} from 'lucide-react'

const stats = [
  { num: '2,400+', label: 'Opportunities' },
  { num: '48K+', label: 'Active Users' },
  { num: '54', label: 'Countries Covered' },
  { num: '98%', label: 'Verified Listings' },
]

const cats = [
  { icon: GraduationCap, label: 'Scholarships', count: '420 open', slug: 'scholarship' },
  { icon: Briefcase, label: 'Remote Jobs', count: '830 open', slug: 'job' },
  { icon: Globe, label: 'Fellowships', count: '185 open', slug: 'fellowship' },
  { icon: Coins, label: 'Grants', count: '240 open', slug: 'grant' },
  { icon: FlaskConical, label: 'Internships', count: '310 open', slug: 'internship' },
  { icon: Rocket, label: 'Startup Funding', count: '92 open', slug: 'startup' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Create Account',
    desc: 'Sign up free and set your preferences — category, country, and funding type.',
    icon: UserPlus,
  },
  {
    step: '02',
    title: 'Discover',
    desc: 'Browse verified listings or let smart filters surface the most relevant opportunities.',
    icon: Search,
  },
  {
    step: '03',
    title: 'Save & Apply',
    desc: 'Bookmark opportunities and get deadline reminders before they close.',
    icon: Bookmark,
  },
  {
    step: '04',
    title: 'Get Alerts',
    desc: 'Premium users get instant alerts for new listings — before the crowd sees them.',
    icon: Bell,
  },
]

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/opportunities?limit=6')
      .then(res => res.json())
      .then(data => setFeatured(data.data || []))
      .catch(console.error)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-bg overflow-x-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 px-6 max-w-screen-xl mx-auto overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-amber/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Announcement pill */}
          <div className="animate-fade-up inline-flex items-center gap-2.5 bg-amber/10 border border-amber/20 rounded-full px-5 py-2 mb-10 group cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber"></span>
            </span>
            <span className="text-amber font-bold text-xs uppercase tracking-widest font-syne group-hover:text-amber-light transition-colors">
              Now live — 2,400+ verified African opportunities
            </span>
          </div>

          <h1 className="animate-fade-up animate-delay-100 font-syne text-[clamp(40px,7vw,88px)] font-black leading-[0.95] tracking-tighter mb-8 text-[#F0EDE6]">
            Never miss an<br />
            <span className="text-amber-gradient drop-shadow-glow-amber">opportunity</span> again
          </h1>

          <p className="animate-fade-up animate-delay-200 text-subtle text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The #1 platform for African students and graduates to discover verified 
            scholarships, jobs, and funding. Join the elite who stay ahead.
          </p>

          <div className="animate-fade-up animate-delay-300 flex flex-col sm:flex-row gap-5 justify-center mb-20">
            <Link href="/opportunities" className="btn-primary px-10 py-5 text-base rounded-2xl shadow-glow-amber">
              Explore Opportunities
              <ArrowRight size={20} className="stroke-[2.5]" />
            </Link>
            <Link href="/pricing" className="btn-ghost px-10 py-5 text-base rounded-2xl border-white/10 hover:bg-white/5">
              <Bell size={20} className="mr-2" />
              Get Alerted Free
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="animate-fade-up animate-delay-400 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto py-12 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-3xl md:rounded-full">
            {stats.map((s) => (
              <div key={s.label} className="text-center px-4 group">
                <div className="font-syne text-3xl md:text-4xl font-black text-amber mb-1 group-hover:scale-110 transition-transform duration-500 drop-shadow-glow-amber/50">
                  {s.num}
                </div>
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-dark group-hover:text-amber/70 transition-colors">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="reveal py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4">
          <div className="max-w-xl">
            <h2 className="section-title text-left mb-4">
              Browse by <span>Category</span>
            </h2>
            <p className="text-subtle font-medium">
              Filter through curated categories tailored specifically for the African career landscape.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {cats.map((c) => {
            const Icon = c.icon
            return (
              <Link key={c.slug} href={`/opportunities?cat=${c.slug}`} className="group">
                <div className="cat-card h-full">
                  <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <Icon size={28} className="text-amber drop-shadow-glow-amber" />
                  </div>
                  <h3 className="font-syne text-lg font-extrabold text-[#F0EDE6] mb-2 group-hover:text-amber transition-colors">
                    {c.label}
                  </h3>
                  <p className="text-xs font-bold text-muted-dark uppercase tracking-widest">
                    {c.count}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── FEATURED SECTION ── */}
      <section className="reveal py-24 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="section-title text-left mb-4">
                Latest <span>Opportunities</span>
              </h2>
              <p className="text-subtle font-medium">Hand-picked, verified, and updated daily.</p>
            </div>
            <Link href="/opportunities" className="hidden md:flex items-center gap-2 group text-amber font-bold text-sm uppercase tracking-wider">
              Explore All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} />
            ))}
          </div>

          <div className="mt-16 text-center md:hidden">
            <Link href="/opportunities" className="btn-ghost inline-flex px-8 py-4 w-full">
              View All Opportunities <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="reveal py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="section-title mb-6">
            Your journey to <span>success</span>
          </h2>
          <p className="text-subtle text-lg font-medium leading-relaxed">
            We&apos;ve streamlined discovery into four simple steps so you can focus on what matters: your application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((s) => {
            const StepIcon = s.icon
            return (
              <div key={s.step} className="step-card group h-full">
                <div className="w-16 h-16 rounded-2xl bg-amber-gradient text-bg flex items-center justify-center mb-8 shadow-glow-amber group-hover:scale-110 transition-all duration-500">
                  <StepIcon size={28} className="stroke-[2.5]" />
                </div>
                <div className="font-syne text-[10px] font-black text-amber uppercase tracking-[0.3em] mb-4 opacity-70">
                  Phase {s.step}
                </div>
                <h3 className="text-xl font-extrabold text-[#F0EDE6] mb-4 group-hover:text-amber transition-colors">
                  {s.title}
                </h3>
                <p className="text-subtle text-sm leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="reveal py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="section-title mb-6">
              Loved by <span>Thousands</span>
            </h2>
            <p className="text-subtle text-lg font-medium leading-relaxed">
              Real results from African students and professionals across the continent.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Chioma Eze',
                initials: 'CE',
                role: 'Final Year Student, UNILAG',
                text: 'OppAlert helped me discover the Chevening Scholarship weeks before my classmates. The alerts are a game-changer.',
                color: '#3DAA6A',
              },
              {
                name: 'Kwame Asante',
                initials: 'KA',
                role: 'Software Engineer, Accra',
                text: "I landed a remote job through opportunities found here. The filtering is excellent — I only see roles that match.",
                color: '#4A9EE8',
              },
              {
                name: 'Fatima Al-Hassan',
                initials: 'FA',
                role: 'Startup Founder, Nairobi',
                text: 'Finding grant funding used to take hours. OppAlert consolidates everything in one place. Truly efficient.',
                color: '#E8A020',
              },
            ].map((review) => (
              <div key={review.name} className="cat-card !p-10 !rounded-3xl hover:border-amber/20 group">
                <div className="flex gap-1 mb-6 text-amber">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-glow-amber"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="text-subtle italic text-base leading-relaxed mb-10 group-hover:text-[#F0EDE6] transition-colors">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-syne font-black text-sm transition-transform group-hover:rotate-6"
                    style={{ background: `${review.color}20`, color: review.color, border: `1px solid ${review.color}40` }}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <div className="font-extrabold text-[#F0EDE6] text-sm">{review.name}</div>
                    <div className="text-[11px] font-bold text-muted-dark uppercase tracking-wider">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="newsletter" className="reveal py-32 px-6">
        <div className="max-w-4xl mx-auto rounded-[3rem] p-12 md:p-20 relative overflow-hidden bg-white/[0.02] border border-white/10 group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber/10 blur-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 blur-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="text-center max-w-xl mx-auto relative z-10">
            <div className="w-20 h-20 rounded-[2rem] bg-amber-gradient text-bg flex items-center justify-center mx-auto mb-10 shadow-glow-amber animate-pulse">
              <Bell size={36} className="stroke-[2.5]" />
            </div>
            <h2 className="font-syne text-4xl md:text-5xl font-black mb-6 text-[#F0EDE6]">
              Weekly alerts, <span className="text-amber">zero noise.</span>
            </h2>
            <p className="text-subtle text-lg font-medium mb-12">
              Join 48,000+ African students and graduates. Get the opportunities you actually want, delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
