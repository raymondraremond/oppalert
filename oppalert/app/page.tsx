'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { opportunities as seedData } from '@/lib/data'
import OpportunityCard from '@/components/OpportunityCard'
import ScrollReveal from '@/components/ScrollReveal'
import AnimatedCounter from '@/components/AnimatedCounter'
import OpportunityTicker from '@/components/OpportunityTicker'
import { 
  GraduationCap, Briefcase, Users, Coins, Leaf, Rocket, 
  Search, ArrowRight, CheckCircle2, ShieldCheck, 
  Globe2, Zap, Star, LayoutGrid, Building2
} from 'lucide-react'

export default function HomePage() {
  const [featured, setFeatured] = useState(seedData.filter(o => o.is_featured))
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/opportunities?limit=6')
        if (res.ok) {
          const result = await res.json()
          if (result && (result.data || Array.isArray(result))) {
            const data = Array.isArray(result) ? result : result.data
            if (data && data.length > 0) setFeatured(data)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchFeatured()
  }, [])

  const categories = [
    { name: 'Scholarships', icon: GraduationCap, slug: 'scholarship', count: '450+', color: 'text-amber' },
    { name: 'Remote Jobs', icon: Briefcase, slug: 'job', count: '1.2k+', color: 'text-emerald' },
    { name: 'Fellowships', icon: Users, slug: 'fellowship', count: '85+', color: 'text-info' },
    { name: 'Grants', icon: Coins, slug: 'grant', count: '120+', color: 'text-terra' },
    { name: 'Internships', icon: Leaf, slug: 'internship', count: '300+', color: 'text-purple-400' },
    { name: 'Startup Funding', icon: Rocket, slug: 'startup', count: '50+', color: 'text-pink-400' },
  ]

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero Section - Search First */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-surface via-bg to-bg opacity-40 -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <ScrollReveal direction="none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 border border-border backdrop-blur-md mb-8 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber"></span>
              </span>
              <span className="text-xs font-bold tracking-wide text-primary">
                73+ New Opportunities added today
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="font-extrabold text-5xl md:text-7xl lg:text-[7rem] text-primary leading-[1] mb-8 tracking-tighter max-w-5xl mx-auto font-syne">
              Your gateway to <span className="text-amber italic">global</span> success.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
              Discover verified scholarships, remote jobs, and funding tailored for the ambitious African professional. Zero spam, just high-impact opportunities.
            </p>
          </ScrollReveal>

          {/* Large Search Bar */}
          <ScrollReveal delay={300}>
            <div className="max-w-4xl mx-auto mb-16 relative">
              <div className="relative group p-2.5 bg-surface/50 backdrop-blur-2xl border border-glass-border rounded-full shadow-premium focus-within:border-amber/40 transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <div className="flex-1 flex items-center gap-4 px-6 w-full">
                    <Search className="text-muted group-focus-within:text-amber transition-colors" size={24} />
                    <input 
                      type="text" 
                      placeholder="Search scholarships, internships, or remote jobs..."
                      className="w-full bg-transparent border-none outline-none py-4 text-primary placeholder:text-muted/60 font-medium text-lg leading-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="w-full md:w-auto px-10 py-5 bg-primary text-bg font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base">
                    Find Matches <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm font-semibold tracking-wide text-muted/80">
                <span className="text-subtle">Popular searches:</span>
                <Link href="/opportunities?q=masters" className="hover:text-amber transition-colors border-b border-transparent hover:border-amber/30 pb-0.5">Masters fully funded</Link>
                <Link href="/opportunities?q=remote" className="hover:text-amber transition-colors border-b border-transparent hover:border-amber/30 pb-0.5">Remote SWE roles</Link>
                <Link href="/opportunities?q=startup" className="hover:text-amber transition-colors border-b border-transparent hover:border-amber/30 pb-0.5">Seed stage grants</Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Social Proof - Logo Cloud */}
          <ScrollReveal delay={400} direction="none">
            <div className="pt-12 mt-12 border-t border-border/60">
              <p className="text-xs font-bold uppercase tracking-widest text-subtle mb-10">Trusted by students & founders from global institutions</p>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <div className="text-2xl font-black tracking-tight">Google</div>
                <div className="text-2xl font-black tracking-tight">Microsoft</div>
                <div className="text-2xl font-black tracking-tight">Andela</div>
                <div className="text-2xl font-black tracking-tight">Paystack</div>
                <div className="text-2xl font-black tracking-tight">Flutterwave</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 border-y border-border/60 bg-surface/30 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto">
            {[
              { label: 'Verified Opportunities', value: 4500, suffix: '+' },
              { label: 'Total Funding Disbursed', value: 12, prefix: '$', suffix: 'M+' },
              { label: 'Active Monthly Users', value: 50, suffix: 'k+' },
              { label: 'Partner Organizations', value: 120, suffix: '+' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-6xl font-bold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted group-hover:text-primary transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid - Bento Style */}
      <section className="py-24 px-6 relative overflow-hidden bg-bg">
        <div className="absolute top-1/2 left-0 w-full h-1/2 bg-amber/5 blur-[120px] rounded-full -z-10 opacity-30" />
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-bold text-4xl md:text-6xl text-primary mb-4 tracking-tighter font-syne">Browse by <span className="text-amber italic">Path</span></h2>
              <p className="text-muted leading-relaxed font-medium">Explore curated categories designed to accelerate your career or startup journey.</p>
            </div>
            <Link href="/opportunities" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber hover:opacity-80 transition-opacity pb-2 border-b border-amber/20">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 h-auto md:h-[640px]">
            {/* Main Feature - Scholarships */}
            <ScrollReveal className="md:col-span-2 lg:col-span-3 md:row-span-2">
              <Link 
                href="/opportunities?cat=scholarship"
                className="group relative h-full flex flex-col p-10 bg-surface/30 border border-border rounded-[2.5rem] hover:border-amber/30 transition-all duration-500 overflow-hidden card-hover"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <GraduationCap size={120} />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 text-amber">
                  <GraduationCap size={32} />
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold text-primary mb-4 font-syne italic">Scholarships</h3>
                  <p className="text-muted mb-8 leading-relaxed max-w-sm">Find fully-funded opportunities at top global institutions. From undergraduate to PhD levels.</p>
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <span className="text-xs font-black text-amber uppercase tracking-widest">450+ Active Listings</span>
                    <div className="w-10 h-10 rounded-full bg-amber text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-amber/20">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Remote Jobs */}
            <ScrollReveal className="md:col-span-2 lg:col-span-3">
              <Link 
                href="/opportunities?cat=job"
                className="group relative h-full flex items-center p-8 bg-surface/30 border border-border rounded-[2.5rem] hover:border-emerald/30 transition-all duration-500 overflow-hidden card-hover"
              >
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center mb-6 text-emerald">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2 font-syne">Remote Jobs</h3>
                  <p className="text-sm text-muted max-w-[200px]">Global roles for African talent.</p>
                </div>
                <div className="text-4xl font-black text-emerald opacity-20 group-hover:opacity-100 transition-opacity font-syne">1.2k+</div>
              </Link>
            </ScrollReveal>

            {/* Grants & Funding */}
            <ScrollReveal className="md:col-span-2 lg:col-span-2">
              <Link 
                href="/opportunities?cat=grant"
                className="group relative h-full flex flex-col p-8 bg-surface/30 border border-border rounded-[2.5rem] hover:border-terra/30 transition-all duration-500 overflow-hidden card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-terra/10 border border-terra/20 flex items-center justify-center mb-6 text-terra">
                  <Coins size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 font-syne">Grants</h3>
                <p className="text-xs text-muted mb-4">Non-dilutive funding for research & social impact.</p>
                <span className="mt-auto text-[10px] font-black text-terra uppercase tracking-widest">120+ Programs</span>
              </Link>
            </ScrollReveal>

            {/* Fellowships */}
            <ScrollReveal className="md:col-span-2 lg:col-span-2">
              <Link 
                href="/opportunities?cat=fellowship"
                className="group relative h-full flex flex-col p-8 bg-surface/30 border border-border rounded-[2.5rem] hover:border-info/30 transition-all duration-500 overflow-hidden card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-info/10 border border-info/20 flex items-center justify-center mb-6 text-info">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 font-syne">Fellowships</h3>
                <p className="text-xs text-muted mb-4">Prestigious leadership & research cohorts.</p>
                <span className="mt-auto text-[10px] font-black text-info uppercase tracking-widest">85+ Cohorts</span>
              </Link>
            </ScrollReveal>

            {/* Startups */}
            <ScrollReveal className="md:col-span-2 lg:col-span-2">
              <Link 
                href="/opportunities?cat=startup"
                className="group relative h-full flex flex-col p-8 bg-surface/30 border border-border rounded-[2.5rem] hover:border-pink-400/30 transition-all duration-500 overflow-hidden card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-400/10 border border-pink-400/20 flex items-center justify-center mb-6 text-pink-400">
                  <Rocket size={24} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 font-syne">Startup Funding</h3>
                <p className="text-xs text-muted mb-4">Seed rounds, accelerators, and pitch competitions.</p>
                <span className="mt-auto text-[10px] font-black text-pink-400 uppercase tracking-widest">50+ Funds</span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-24 px-6 bg-surface/10 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div>
              <h2 className="font-bold text-4xl md:text-6xl text-primary mb-4 tracking-tighter font-syne">Handpicked for <span className="text-amber italic">You</span></h2>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-bg bg-surface2 flex items-center justify-center text-[10px] font-bold text-muted ring-1 ring-border">A</div>
                  ))}
                </div>
                <p className="text-xs font-bold text-muted uppercase tracking-[0.2em]">Joined by 1,200+ seekers today</p>
              </div>
            </div>
            <div className="flex gap-2 bg-surface p-1 rounded-xl border border-border">
              <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-amber text-[#080A07] rounded-lg">Recent</button>
              <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary rounded-lg transition-colors">Expiring</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featured.map((opp, index) => (
              <OpportunityCard key={opp.id} opportunity={opp} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/opportunities" className="inline-flex items-center gap-3 px-10 py-5 bg-surface border border-border rounded-2xl text-primary font-black uppercase tracking-widest hover:bg-border transition-all">
              Browse All Opportunities <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust / Testimonials */}
      <section className="py-32 px-6 relative overflow-hidden bg-bg">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-amber/5 blur-[120px] rounded-full -z-10" />
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="font-bold text-4xl md:text-7xl text-primary mb-6 tracking-tighter font-syne italic">Trusted stories.</h2>
            <p className="text-muted text-lg font-medium">Join thousands of successful professionals who found their path on OppAlert.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                text: "OppAlert helped me secure my first fully-funded Masters in the UK. The alerts are incredibly timely and well-organized.",
                author: "Chinwendu A.", role: "Scholarship Recipient", avatar: "CA" 
              },
              { 
                text: "As a startup founder, finding the right grants is like looking for a needle in a haystack. This platform saved us months.",
                author: "Musa K.", role: "Tech Founder", avatar: "MK" 
              },
              { 
                text: "The remote job listings are high quality and actually verified. I got hired within 3 weeks of joining.",
                author: "Sarah O.", role: "Senior Engineer", avatar: "SO" 
              },
            ].map((t, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="p-10 bg-surface/30 border border-border rounded-[2.5rem] relative h-full flex flex-col hover:border-amber/30 transition-all duration-500 card-hover group">
                  <div className="mb-8 text-amber/40 group-hover:text-amber transition-colors">
                    <Star size={32} fill="currentColor" />
                  </div>
                  <p className="text-lg text-primary/90 mb-10 leading-relaxed font-medium flex-1 tracking-tight">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-4 pt-8 border-t border-border/40">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center font-bold text-amber group-hover:scale-110 transition-transform">{t.avatar}</div>
                    <div>
                      <div className="text-sm font-bold text-primary font-syne">{t.author}</div>
                      <div className="text-[10px] text-muted font-black uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto bg-primary rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-amber opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber/20 blur-[100px] rounded-full animate-pulse-soft" />
          
          <ScrollReveal direction="none">
            <h2 className="font-bold text-4xl md:text-[5rem] text-bg mb-10 tracking-tighter font-syne leading-[0.9] italic">Your next big move starts here.</h2>
            <p className="text-lg md:text-xl text-bg/60 max-w-xl mx-auto mb-16 font-bold leading-relaxed">Join 50,000+ African youth and professionals discovering their future today.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register" className="px-12 py-6 bg-bg text-white font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3 text-lg">
                Create Free Account <ArrowRight size={20} />
              </Link>
              <Link href="/opportunities" className="px-12 py-6 bg-bg/5 border border-bg/10 text-bg font-black rounded-[2rem] hover:bg-bg/10 transition-all flex items-center justify-center gap-3 text-lg">
                Explore All
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
