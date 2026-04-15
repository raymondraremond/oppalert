'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Globe, Sparkles, Terminal, Copy, Share2, Rocket, Search, Calendar, Users, Briefcase } from 'lucide-react'
import TypewriterURL from '@/components/TypewriterURL'

const ease = [0.16, 1, 0.3, 1] as any

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [heroKey, setHeroKey] = useState(0)
  const [stats, setStats] = useState({
    users: 50000,
    opportunities: 45,
    countries: 150,
    accuracy: 98
  })

  useEffect(() => {
    setMounted(true)
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {})
      
    const interval = setInterval(() => {
      setHeroKey(prev => prev + 1)
    }, 6000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-bg relative selection:bg-emerald/30 selection:text-emerald-100 overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald/5 blur-[120px] rounded-full animate-orb" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/5 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section: The Dual Pillar */}
      <section className="relative pt-32 pb-24 px-6 flex items-center min-h-[95vh]">
        <div className="max-w-[90rem] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Typography */}
          <div className="text-left w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface2 border border-border backdrop-blur-md mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-muted">
                    The Multi-Sided Opportunity Ecosystem
                  </span>
               </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <h1 key={heroKey} className="text-5xl md:text-7xl lg:text-[7.5rem] leading-[0.9] text-primary tracking-tighter mb-10 font-syne font-black flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-4">
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                  transition={{ duration: 1.2, delay: 0.2, ease }}
                >
                  Find.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                  transition={{ duration: 1.2, delay: 0.8, ease }}
                >
                  Host.
                </motion.span>
                <div className="w-full h-0 basis-full block"></div>
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                  transition={{ duration: 1.2, delay: 1.4, ease }}
                  className="italic text-emerald font-normal"
                >
                  Succeed.
                </motion.span>
              </h1>
            </AnimatePresence>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="text-lg md:text-xl text-muted/70 max-w-xl mb-12 font-medium leading-relaxed"
            >
              OppAlert is the dual-purpose engine for African talent and community builders. Discover global funding or host the events that drive the next generation forward.
            </motion.p>
          </div>

          {/* Right Column: Entry Points (Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 w-full relative z-10">
             {/* Seeker Path */}
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.4, ease }}
               className="group relative h-full"
             >
               <Link href="/opportunities" className="block h-full p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] bg-surface/40 backdrop-blur-3xl border border-border hover:border-emerald/30 transition-all duration-500 overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Search size={140} />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald/10 border border-emerald/20 flex items-center justify-center mb-6 lg:mb-8 text-emerald">
                     <Briefcase size={28} />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-syne font-bold text-primary mb-4">I am a Seeker</h3>
                  <p className="text-sm lg:text-base text-muted/70 mb-8 leading-relaxed">Access the most curated database of scholarships, jobs, and grants designed for your success.</p>
                  <div className="flex items-center gap-2 text-emerald font-bold text-sm tracking-widest uppercase mt-auto">
                    Discover Now <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </div>
               </Link>
             </motion.div>

             {/* Organizer Path */}
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.6, ease }}
               className="group relative h-full"
             >
               <Link href="/organizer" className="block h-full p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] bg-surface/40 backdrop-blur-3xl border border-border hover:border-emerald/30 transition-all duration-500 overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Calendar size={140} className="text-emerald" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald/10 border border-emerald/20 flex items-center justify-center mb-6 lg:mb-8 text-emerald">
                     <Users size={28} />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-syne font-bold text-primary mb-4">I am an Organizer</h3>
                  <p className="text-sm lg:text-base text-muted/70 mb-8 leading-relaxed">Host workshops, summits, or cohorts. Get a dedicated URL and manage your attendees with ease.</p>
                  <div className="flex items-center gap-2 text-emerald font-bold text-sm tracking-widest uppercase mt-auto">
                    Launch Event <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </div>
               </Link>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Typewriter URL Feature Block */}
      <section className="py-40 px-6 relative overflow-hidden bg-bg2">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease }}
              className="p-8 md:p-12 rounded-[3.5rem] bg-bg/80 border border-border backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
            >
               {/* Terminal Visual */}
               <div className="flex items-center gap-2 mb-8 absolute top-8 left-8">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
               </div>
               
               <div className="mt-12 py-8 sm:py-10 px-4 sm:px-8 bg-surface/50 border border-border rounded-3xl min-h-[300px] flex flex-col justify-center">
                  <div className="mb-10 p-4 sm:p-6 bg-emerald/5 border border-emerald/10 rounded-2xl inline-flex flex-wrap items-center gap-4 hover:scale-[1.02] transition-transform">
                     <div className="w-10 h-10 rounded-lg bg-emerald/20 flex items-center justify-center text-emerald">
                        <Terminal size={20} />
                     </div>
                     <TypewriterURL />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className={`h-16 sm:h-24 rounded-xl sm:rounded-2xl border border-border transition-all duration-700 bg-surface/${i * 2 + 1}`} 

                             style={{ animationDelay: `${i * 200}ms` }} />
                     ))}
                  </div>
               </div>

               <div className="absolute bottom-8 right-8 flex gap-3">
                  <div className="p-3 bg-surface2 border border-border rounded-xl text-muted hover:text-primary transition-colors cursor-pointer"><Copy size={20} /></div>
                  <div className="p-3 bg-surface2 border border-border rounded-xl text-muted hover:text-primary transition-colors cursor-pointer"><Share2 size={20} /></div>
               </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald/10 border border-emerald/20 rounded-lg text-[9px] font-black tracking-widest uppercase text-emerald">
                <Sparkles size={12} /> Fast Deployment
              </div>
              <h2 className="text-4xl md:text-6xl font-syne font-bold text-primary tracking-tighter leading-tight italic">
                Your event link, <br />
                <span className="text-emerald not-italic">instantly developed.</span>
              </h2>
              <p className="text-xl text-muted/70 leading-relaxed font-medium">
                Organizers don&apos;t just host—they build. Every event on OppAlert gets a unique, SEO-optimized URL tailored to your community. Type, launch, and share in seconds.
              </p>
              <div className="pt-6">
                <Link href="/organizer/create" className="inline-flex items-center gap-4 text-emerald font-black uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                   Start developing your link <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Discovery Section (The Seeker Side) */}
      <section className="py-40 px-6 relative border-t border-border overflow-hidden">
        <div className="max-w-7xl mx-auto container relative z-10 text-center">
           <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
           >
              <div className="mb-12">
                 <h2 className="text-4xl md:text-7xl font-syne font-black text-primary tracking-[0.1em] uppercase mb-6 italic">
                   The Radar.
                 </h2>
                 <p className="text-xl text-muted/60 max-w-2xl mx-auto mb-16">
                   Seekers use OppAlert as their global radar for scholarships, fellowships, and remote impact roles.
                 </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                 {[
                   { icon: Globe, label: "Global Reach", count: `${stats.countries}+ Countries` },
                   { icon: Rocket, label: "Daily Drops", count: `${stats.opportunities}+ New` },
                   { icon: Users, label: "Peer Support", count: `${(stats.users / 1000).toFixed(0)}k+ Community` },
                   { icon: Sparkles, label: "AI Matching", count: `${stats.accuracy}% Acc.` }
                 ].map((item, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-surface/30 border border-border hover:border-emerald/20 transition-all group">
                       <item.icon className="mx-auto mb-6 text-emerald opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" size={32} />
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">{item.label}</p>
                       <p className="text-lg font-bold text-primary">{item.count}</p>
                    </div>
                 ))}
              </div>
              
              <div className="mt-20">
                <Link href="/opportunities" className="px-12 py-6 rounded-full bg-primary text-bg font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-3 w-fit mx-auto shadow-2xl shadow-emerald/10">
                   Enter the radar <Search size={20} />
                </Link>
              </div>
           </motion.div>
        </div>
      </section>

      {/* CTA: Final Onboarding Choice */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto p-12 md:p-32 rounded-[4rem] bg-surface/30 border border-border backdrop-blur-3xl text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-emerald opacity-0 group-hover:opacity-5 transition-opacity duration-1000" />
           <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald/10 blur-[120px] rounded-full" />
           
           <h2 className="text-5xl md:text-7xl font-syne font-black text-primary mb-12 tracking-tighter italic">Which one are <br /> you today?</h2>
           
           <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link href="/register" className="px-14 py-7 bg-emerald text-bg font-black uppercase tracking-widest rounded-3xl hover:shadow-[0_0_50px_rgba(52,194,122,0.3)] transition-all flex items-center gap-3 text-lg leading-none">
                I want to discover <Rocket size={20} />
              </Link>
              <Link href="/register?type=organizer" className="px-14 py-7 bg-white text-bg font-black uppercase tracking-widest rounded-3xl hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all flex items-center gap-3 text-lg leading-none">
                I want to host <Calendar size={20} />
              </Link>
           </div>
           
           <p className="mt-16 text-muted/60 font-bold uppercase tracking-[0.4em] text-[10px]">
             Trusted by 50,000+ Africans and community builders.
           </p>
        </div>
      </section>
    </main>
  )
}
