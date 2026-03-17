'use client'
import Link from 'next/link'
import { Target, Users, ShieldCheck, Zap, ArrowRight, Github, Globe, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-32 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/20 rounded-full px-5 py-2 mb-8 animate-fade-up">
            <Star size={14} className="text-amber fill-amber" />
            <span className="text-amber font-bold text-[10px] uppercase tracking-widest font-syne">Our Mission</span>
          </div>
          <h1 className="font-syne text-6xl md:text-8xl font-black tracking-tighter mb-10 text-[#F0EDE6] leading-[0.9]">
            The Future of <span className="text-amber-gradient drop-shadow-glow-amber">African Talent.</span>
          </h1>
          <p className="text-subtle text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
            OppAlert is a mission-driven platform dedicated to connecting students and professionals across Africa with life-changing global opportunities.
          </p>
        </section>

        {/* Vision/Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
           <div className="space-y-10 animate-fade-up">
             <div className="space-y-6">
               <h2 className="font-syne text-4xl font-black text-white leading-tight">Why we <span className="text-amber italic">started.</span></h2>
               <p className="text-lg text-subtle font-medium leading-relaxed">
                 Information gap remains one of the biggest hurdles for African youth. While thousands of scholarships, grants, and jobs exist specifically for the continent, finding them shouldn&apos;t be a full-time job.
               </p>
               <p className="text-lg text-subtle font-medium leading-relaxed">
                 We built OppAlert to democratize access. By using a combination of human verification and smart scanning, we ensure that you see the most relevant opportunities the moment they go live.
               </p>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
               <div className="glass-gradient border border-white/5 rounded-3xl p-8 group">
                  <div className="font-syne text-4xl font-black text-white mb-2 group-hover:text-amber transition-colors">48K+</div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-dark">Active Members</p>
               </div>
               <div className="glass-gradient border border-white/5 rounded-3xl p-8 group">
                  <div className="font-syne text-4xl font-black text-white mb-2 group-hover:text-amber transition-colors">2.4K</div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-dark">Annual Listings</p>
               </div>
             </div>
           </div>

           <div className="relative group animate-fade-up animate-delay-200">
             <div className="absolute inset-0 bg-amber-gradient blur-[100px] opacity-10 -z-10 group-hover:opacity-20 transition-opacity" />
             <div className="glass-gradient border border-white/10 rounded-[4rem] p-12 aspect-square flex flex-col justify-center items-center text-center space-y-8">
                <div className="w-32 h-32 rounded-[3rem] bg-amber/10 border border-amber/20 flex items-center justify-center text-amber shadow-premium-glow">
                   <Target size={64} className="stroke-[1.5]" />
                </div>
                <h3 className="font-syne text-3xl font-black text-white">100% African Driven.</h3>
                <p className="text-subtle font-medium">Built by developers and researchers who understand the unique landscape of African career progression.</p>
             </div>
           </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {[
            { icon: ShieldCheck, title: 'Verified Only', color: 'success', desc: 'Every opportunity is manually reviewed by our audit team. We filter out the noise and the scams.' },
            { icon: Users, title: 'Community First', color: 'primary', desc: 'Access resources and shared experiences from thousands of students who have navigated these paths.' },
            { icon: Zap, title: 'Speed of Info', color: 'amber', desc: 'Our premium engine scans global clusters 24/7 to give you a 48-hour head start on high-demand roles.' }
          ].map((pillar, idx) => (
            <div key={idx} className="glass-gradient border border-white/5 rounded-[3rem] p-10 hover:border-white/20 transition-all group">
               <div className={`w-14 h-14 rounded-2xl bg-${pillar.color}/10 text-${pillar.color} flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
                 <pillar.icon size={28} />
               </div>
               <h3 className="font-syne text-xl font-black text-white mb-4">{pillar.title}</h3>
               <p className="text-subtle font-medium leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* Join the story */}
        <section className="bg-amber-gradient rounded-[4rem] p-12 md:p-24 text-center text-bg relative overflow-hidden animate-reveal group">
           <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
           <h2 className="font-syne text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">Ready to Land Your <br/>Next Big <span className="italic">Opportunity?</span></h2>
           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link href="/opportunities" className="btn-primary !bg-bg !text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-110 transition-all flex items-center gap-3 shadow-premium">
               Explore Clusters <ArrowRight size={18} />
             </Link>
             <Link href="/register" className="font-black uppercase tracking-widest text-xs border-b-2 border-bg/30 hover:border-bg transition-all py-1">Create Account Today</Link>
           </div>
        </section>

        {/* Open Source / Footer Note */}
        <div className="mt-32 pt-20 border-t border-white/5 flex flex-col items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           <div className="flex items-center gap-10">
              <Github size={48} />
              <Globe size={48} />
              <div className="font-syne font-black text-3xl tracking-tighter">OPPALERT <span className="text-subtle opacity-50">v2.0</span></div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-dark text-center">
             Engineered for the Digital African Economy · Secure · Fast · Transparent
           </p>
        </div>
      </div>
    </main>
  )
}
