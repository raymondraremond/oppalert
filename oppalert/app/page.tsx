'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, BarChart2, Activity, ShieldCheck, ChevronRight } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-bg relative selection:bg-emerald-500/30 selection:text-emerald-100 overflow-hidden">
      {/* Global Ambient Nature/Dark Green Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A1A12] via-bg to-bg" />
      <div className="fixed top-0 max-w-full w-[800px] h-[400px] left-1/2 -translate-x-1/2 bg-emerald-500/5 blur-[120px] rounded-[100%] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <ScrollReveal direction="none" delay={100}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-100/70">
                For the students who refuse to be average.
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <h1 className="text-5xl md:text-7xl lg:text-[8rem] leading-[0.9] text-primary tracking-tighter mb-8 font-syne mx-auto">
              Become the most <br />
              <span className="italic text-emerald-400 selection:text-primary">aware</span> version <br />
              of yourself.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <p className="text-lg md:text-xl text-muted/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Unlock the algorithmic advantage. We scan the globe for high-yield funding, fellowships, and roles, predicting your match before you even apply.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register" className="group relative overflow-hidden rounded-full bg-primary text-bg px-8 py-4 font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                <span className="relative z-10">Start your journey</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Hero Abstract Floating Widgets */}
        <div className="absolute top-1/2 left-[5%] hidden lg:block -translate-y-1/2 animate-float" style={{ animationDelay: '0s' }}>
          <div className="backdrop-blur-xl bg-surface/50 border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><BarChart2 size={24} /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Predicted Match</p>
              <p className="text-xl font-black font-syne text-primary">94.2%</p>
            </div>
          </div>
        </div>

        <div className="absolute top-[60%] right-[5%] hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
          <div className="backdrop-blur-xl bg-surface/50 border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-amber/20 bg-amber/10 flex items-center justify-center text-amber"><Activity size={24} /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Average Grant</p>
              <p className="text-xl font-black font-syne text-primary">$45,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION: AWARENESS */}
      <section className="py-32 px-6 relative border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500/80 mb-6">About Us</p>
            <h2 className="text-4xl md:text-6xl font-syne font-bold tracking-tighter mb-8 text-primary italic">
              Awareness is your competitive edge.
            </h2>
            <p className="text-xl text-muted/70 leading-relaxed max-w-2xl mx-auto mb-12">
              In a world flooded with noise, pinpointing the exact opportunity that changes your trajectory is a superpower. OppAlert acts as your personal radar.
            </p>
            <Link href="/opportunities" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-surface border border-white/10 text-primary font-bold hover:bg-surface2 transition-colors">
              Get started
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* BENTO GRID: OPERATE WITH INTENT */}
      <section className="py-32 px-6 bg-[#040906] relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal direction="none">
            <div className="mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Operate with intent</p>
              <h2 className="text-4xl md:text-5xl font-syne font-bold text-primary tracking-tighter max-w-xl">
                See your next result before you reach it.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
             {/* Card 1: Match Score */}
             <ScrollReveal className="h-full">
               <div className="h-full p-8 rounded-[2.5rem] bg-surface/50 border border-white/10 backdrop-blur-sm flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
                  <div>
                    <h3 className="text-2xl font-syne font-bold text-primary mb-2">Predicted Match Score</h3>
                    <p className="text-muted text-sm">Our AI analyzes your profile against historical acceptance rates to give you a definitive edge.</p>
                  </div>
                  <div className="mt-12 space-y-4">
                    <div className="h-2 w-full bg-bg rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[92%] rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="h-2 w-full bg-bg rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/50 w-[64%] rounded-full opacity-60 group-hover:opacity-100 transition-opacity delay-75" />
                    </div>
                    <div className="h-2 w-full bg-bg rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/30 w-[41%] rounded-full opacity-40 group-hover:opacity-100 transition-opacity delay-150" />
                    </div>
                  </div>
               </div>
             </ScrollReveal>

             {/* Card 2: Application Velocity */}
             <ScrollReveal className="h-full" delay={100}>
               <div className="h-full p-8 rounded-[2.5rem] bg-surface/50 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-center group hover:border-amber-500/30 transition-colors">
                  <div className="w-48 h-48 relative mb-8">
                     {/* Fake Radial Graph */}
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#F5B93A" strokeWidth="8" strokeDasharray="283" strokeDashoffset="60" className="opacity-80 group-hover:stroke-[10px] transition-all duration-500 ease-out" strokeLinecap="round" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-syne font-bold text-amber">78%</span>
                        <span className="text-[9px] uppercase tracking-widest text-muted">Velocity</span>
                     </div>
                  </div>
                  <div className="mt-auto">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber/80 mb-2">Next Focus Drop</p>
                    <h3 className="text-xl font-syne font-bold text-primary">Application Velocity</h3>
                  </div>
               </div>
             </ScrollReveal>

             {/* Card 3: Readiness */}
             <ScrollReveal className="h-full" delay={200}>
               <div className="h-full p-8 rounded-[2.5rem] bg-surface/50 border border-white/10 backdrop-blur-sm flex flex-col justify-between group hover:border-info/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck className="text-info" size={24} />
                      <span className="text-sm font-bold text-primary tracking-wide">Status: Optimal</span>
                    </div>
                    <h3 className="text-2xl font-syne font-bold text-primary mb-2">Opportunity Readiness</h3>
                    <p className="text-muted text-sm">Your materials and timing align perfectly with upcoming global cohorts.</p>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-bg/50 border border-white/5 mt-8">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 flex items-center justify-between">
                       Stability Forecast
                       <span className="w-2 h-2 rounded-full bg-info animate-pulse" />
                     </p>
                     <div className="flex items-end gap-1 h-12">
                       {[0.4, 0.6, 0.5, 0.8, 1.0, 0.7, 0.9].map((h, i) => (
                         <div key={i} className="flex-1 bg-info/80 rounded-t-sm transition-all duration-500 group-hover:bg-info" style={{ height: `${h * 100}%`, transitionDelay: `${i * 50}ms` }} />
                       ))}
                     </div>
                  </div>
               </div>
             </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FINAL PITCH */}
      <section className="py-40 px-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(52,194,122,0.1)_0%,transparent_70%)]" />
        </div>
        
        <div className="text-center relative z-10">
          <ScrollReveal>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6">The mind behind OppAlert</p>
            <h2 className="text-5xl md:text-7xl font-syne font-bold text-primary tracking-tighter mb-12">
              Oracle understands your <br className="hidden md:block"/> next move.
            </h2>
            <Link href="/opportunities" className="inline-flex items-center gap-3 text-lg font-bold text-primary hover:text-emerald-400 transition-colors group">
              Explore the platform 
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
