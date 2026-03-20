'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { calculateDaysRemaining } from '@/lib/utils'
import { getFeatured } from '@/lib/data'
import OpportunityCard from '@/components/OpportunityCard'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
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

// Lazy load below-the-fold sections
const TestimonialsSection = dynamic(
  () => import('@/components/TestimonialsSection'),
  { 
    loading: () => (
      <div style={{ height: 400, background: 'var(--icon-bg)', borderRadius: 24, margin: '64px auto', maxWidth: '80rem' }} />
    )
  }
)

const NewsletterSection = dynamic(
  () => import('@/components/NewsletterSection'),
  { loading: () => null }
)

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
  { icon: Briefcase, label: 'Bootcamps', count: '45 open', slug: 'bootcamp' },
  { icon: Globe, label: 'Events', count: '38 open', slug: 'event' },
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
  // CRITICAL: Start with seed data so cards show instantly — never empty
  const [featured, setFeatured] = useState<any[]>(getFeatured(6))

  useEffect(() => {
    // Try DB in background silently
    fetch('/api/opportunities?limit=15')
      .then(res => res.json())
      .then(data => {
        if (data?.data?.length > 0) {
          const openOpps = data.data.filter((opp: any) => calculateDaysRemaining(opp.deadline) > 0)
          if (openOpps.length > 0) {
            setFeatured(openOpps.slice(0, 6))
          }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <main className="min-h-screen bg-bg overflow-x-hidden">
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 px-6 max-w-screen-xl mx-auto overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] blur-[120px] rounded-full pointer-events-none -z-10" style={{backgroundColor: 'rgba(232, 160, 32, 0.08)'}} />
        <div className="absolute -top-24 -left-24 w-96 h-96 blur-[100px] rounded-full pointer-events-none -z-10" style={{backgroundColor: 'var(--icon-bg)'}} />

        <div className="text-center max-w-4xl mx-auto">
          {/* Announcement pill */}
          <ScrollReveal direction="none">
            <div className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 mb-10 group cursor-default" style={{backgroundColor: 'var(--amber-dim)', border: '1px solid rgba(232, 160, 32, 0.2)'}}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber"></span>
              </span>
              <span className="text-amber font-bold text-xs uppercase tracking-widest font-syne group-hover:text-amber-light transition-colors">
                Now live — 2,400+ verified African opportunities
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="font-syne text-[clamp(40px,7vw,88px)] font-black leading-[0.95] tracking-tighter mb-8 text-primary">
              Never miss an<br />
              <span className="text-amber-gradient drop-shadow-glow-amber">opportunity</span> again
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-subtle text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              The #1 platform for African students and graduates to discover verified 
              scholarships, jobs, and funding. Join the elite who stay ahead.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
              <Link href="/opportunities" className="btn-primary px-10 py-5 text-base rounded-2xl shadow-glow-amber">
                Explore Opportunities
                <ArrowRight size={20} className="stroke-[2.5]" />
              </Link>
              <Link href="/pricing" className="btn-ghost px-10 py-5 text-base rounded-2xl">
                <Bell size={20} className="mr-2" />
                Get Alerted Free
              </Link>
            </div>
          </ScrollReveal>

          {/* Quick Stats Grid */}
          <ScrollReveal delay={0}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto py-12 border-y backdrop-blur-sm rounded-3xl md:rounded-full" style={{borderColor: 'var(--border)', backgroundColor: 'var(--icon-bg)'}}>
              {stats.map((s) => (
                <div key={s.label} className="text-center px-4 group">
                  <div className="font-syne text-3xl md:text-4xl font-black text-amber mb-1 group-hover:scale-110 transition-transform duration-500 drop-shadow-glow-amber/50">
                    {s.num}
                  </div>
                  <div className="text-[10px] uppercase font-black tracking-[0.2em] text-muted transition-colors">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
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
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {cats.map((c, i) => {
            const Icon = c.icon
            return (
              <ScrollReveal key={c.slug} delay={i * 60}>
                <Link href={`/opportunities?cat=${c.slug}`} className="group h-full block">
                  <div className="cat-card h-full">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner" style={{backgroundColor: 'var(--amber-dim)'}}>
                      <Icon size={28} className="text-amber drop-shadow-glow-amber" />
                    </div>
                    <h3 className="font-syne text-lg font-extrabold text-primary mb-2 group-hover:text-amber transition-colors">
                      {c.label}
                    </h3>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest">
                      {c.count}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* ── FEATURED SECTION ── */}
      <section className="py-24 px-6 border-y" style={{borderColor: 'var(--border)', backgroundColor: 'var(--icon-bg)'}}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
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
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((opp, i) => (
              <ScrollReveal key={opp.id} delay={i * 80}>
                <OpportunityCard opp={opp} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-16 text-center md:hidden">
            <ScrollReveal delay={200}>
              <Link href="/opportunities" className="btn-ghost inline-flex px-8 py-4 w-full">
                View All Opportunities <ArrowRight size={18} className="ml-2" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="section-title mb-6">
              Your journey to <span>success</span>
            </h2>
            <p className="text-subtle text-lg font-medium leading-relaxed">
              We&apos;ve streamlined discovery into four simple steps so you can focus on what matters: your application.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((s, i) => {
            const StepIcon = s.icon
            return (
              <ScrollReveal key={s.step} delay={i * 100} direction="up" className="h-full">
                <div className="step-card group h-full">
                  <div className="w-16 h-16 rounded-2xl bg-amber-gradient text-bg flex items-center justify-center mb-8 shadow-glow-amber group-hover:scale-110 transition-all duration-500">
                    <StepIcon size={28} className="stroke-[2.5]" />
                  </div>
                  <div className="font-syne text-[10px] font-black text-amber uppercase tracking-[0.3em] mb-4 opacity-70">
                    Phase {s.step}
                  </div>
                  <h3 className="text-xl font-extrabold text-primary mb-4 group-hover:text-amber transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-subtle text-sm leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <ScrollReveal delay={100}>
        <TestimonialsSection />
      </ScrollReveal>

      {/* ── FINAL CTA ── */}
      <ScrollReveal delay={100}>
        <NewsletterSection />
      </ScrollReveal>

      <Footer />
    </main>
  )
}
