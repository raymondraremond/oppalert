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
        {/* Warm Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-1/4 w-[800px] h-[800px] bg-amber/10 blur-[140px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald/5 blur-[120px] rounded-full mix-blend-screen" />
        </div>

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
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary leading-[1.05] mb-8 tracking-tight max-w-5xl mx-auto">
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
                  <button className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-amber to-amber-light text-[#080A07] font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-amber flex items-center justify-center gap-2 text-base">
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
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <div className="font-serif text-2xl font-bold">Google</div>
                <div className="font-serif text-2xl font-bold">Microsoft</div>
                <div className="font-serif text-2xl font-bold">Andela</div>
                <div className="font-serif text-2xl font-bold">Paystack</div>
                <div className="font-serif text-2xl font-bold">Flutterwave</div>
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
                <div className="text-4xl md:text-6xl font-serif text-amber mb-3 group-hover:scale-105 transition-transform duration-300">
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted group-hover:text-primary transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-xl">
              <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4 tracking-tight">Browse by <span className="text-amber italic">Path</span></h2>
              <p className="text-muted leading-relaxed font-medium">Explore curated categories designed to accelerate your career or startup journey.</p>
            </div>
            <Link href="/opportunities" className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber hover:opacity-80 transition-opacity">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <Link 
                  href={`/opportunities?cat=${cat.slug}`}
                  className="group relative p-8 bg-surface/30 border border-border rounded-[2rem] hover:border-amber/30 hover:bg-surface/50 transition-all duration-500 overflow-hidden card-hover"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ${cat.color}`}>
                    <cat.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">{cat.name}</h3>
                  <p className="text-sm text-muted mb-6">Discover the latest {cat.name.toLowerCase()} tailored for your growth.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber uppercase tracking-widest">{cat.count} listings</span>
                    <div className="w-8 h-8 rounded-full bg-amber/10 flex items-center justify-center text-amber translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-24 px-6 bg-surface/10 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4 tracking-tight">Handpicked for <span className="text-amber italic">You</span></h2>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-bg bg-surface2 flex items-center justify-center text-[10px] font-bold">A</div>
                  ))}
                </div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Joined by 1,200+ seekers today</p>
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
      <section className="py-24 px-6 relative overflow-hidden bg-bg">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6">Real stories from our <span className="text-amber italic">community</span>.</h2>
            <div className="flex justify-center gap-1.5 mb-8 text-amber">
              {[1,2,3,4,5].map(i => <Star key={i} size={24} fill="currentColor" />)}
            </div>
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
                <div className="p-10 bg-surface/30 border border-border rounded-3xl relative h-full flex flex-col hover:border-amber/30 transition-colors duration-300">
                  <div className="absolute -top-5 left-10 p-2.5 bg-amber rounded-xl text-[#080A07] shadow-lg">
                    <Star size={18} fill="currentColor" />
                  </div>
                  <p className="text-base text-primary/80 mb-8 mt-4 leading-relaxed italic flex-1">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                    <div className="w-12 h-12 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center font-bold text-amber">{t.avatar}</div>
                    <div>
                      <div className="text-sm font-bold text-primary">{t.author}</div>
                      <div className="text-xs text-muted font-medium">{t.role}</div>
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
        <div className="max-w-5xl mx-auto bg-amber-gradient rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-premium">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 mix-blend-overlay">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>
          
          <ScrollReveal direction="none">
            <h2 className="font-serif text-4xl md:text-6xl text-[#080A07] mb-8 tracking-tight">Your next big move <br />starts <span className="italic">here</span>.</h2>
            <p className="text-lg md:text-xl text-[#080A07]/70 max-w-xl mx-auto mb-12 font-bold">Join 50,000+ African youth and professionals discovering their future today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="px-10 py-5 bg-[#080A07] text-white font-black rounded-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2">
                Create Free Account <ArrowRight size={20} />
              </Link>
              <Link href="/opportunities" className="px-10 py-5 bg-white/20 backdrop-blur-md text-[#080A07] border border-[#080A07]/10 font-black rounded-2xl hover:bg-white/30 transition-all flex items-center justify-center gap-2">
                Explore Opportunities
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
