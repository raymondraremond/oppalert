'use client'
import Link from 'next/link'
import { ArrowLeft, Quote, Star, Users, Zap, Award, Globe } from 'lucide-react'

export default function SuccessStoriesPage() {
  const stories = [
    {
      name: "Chidi Okafor",
      role: "Software Engineer @ Google",
      content: "OppFetch was the turning point in my career. I found a specialized fellowship that I hadn't seen anywhere else. Three months later, I was interviewing with top-tier tech firms.",
      image: "CO",
      location: "Lagos, Nigeria"
    },
    {
      name: "Amina Yusuf",
      role: "Graduate Scholar",
      content: "Securing a full scholarship for my Masters in the UK seemed impossible until I set up my alerts on OppFetch. The verification system saved me from so many scams.",
      image: "AY",
      location: "Accra, Ghana"
    },
    {
      name: "Kofi Mensah",
      role: "Startup Founder",
      content: "We raised our first $50k grant through a listing we found here. The platform's focus on African founders is exactly what the ecosystem needed.",
      image: "KM",
      location: "Nairobi, Kenya"
    }
  ]

  return (
    <div className="min-h-screen bg-bg text-primary pt-32 pb-40 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber/5 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-emerald/5 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-24 space-y-8 animate-fade-up">
           <Link href="/" className="group inline-flex items-center gap-3 text-amber text-[10px] font-black uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          <h4 className="text-[10px] font-black text-amber uppercase tracking-[0.4em] mb-4">Community Impact</h4>
          <h1 className="font-serif text-6xl md:text-8xl font-black mb-8 tracking-tight leading-none">
            Real Stories, <span className="text-amber italic">Real Impact.</span>
          </h1>
          <p className="text-xl text-muted font-medium max-w-2xl mx-auto leading-relaxed">
            Join thousands of African students and professionals who have accelerated their journey through the OppAlert ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {stories.map((story, i) => (
            <div key={i} className="group relative animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber/20 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />
              <div className="bg-surface/30 backdrop-blur-xl p-12 rounded-[3rem] border border-border/60 relative h-full flex flex-col hover:bg-surface/50 transition-all duration-500 shadow-premium">
                <Quote className="absolute top-12 right-12 text-amber/5 group-hover:text-amber/10 transition-colors" size={64} />
                
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-amber text-black flex items-center justify-center font-black text-2xl shadow-glow-amber">
                    {story.image}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-primary">{story.name}</h3>
                    <p className="text-[10px] font-black text-amber uppercase tracking-widest mt-1">{story.role}</p>
                  </div>
                </div>

                <p className="text-lg text-muted font-medium leading-relaxed italic mb-12 flex-grow">
                  &quot;{story.content}&quot;
                </p>

                <div className="pt-8 border-t border-border/40 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
                     <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">{story.location}</span>
                   </div>
                   <div className="flex gap-1 text-amber">
                     {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" stroke="none" />)}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="py-24 border-y border-border/40 animate-fade-up">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
              {[
                { label: 'Opportunities Found', value: '15,000+', icon: Zap, color: 'text-amber' },
                { label: 'Users Placed', value: '5,000+', icon: Users, color: 'text-emerald' },
                { label: 'Countries Covered', value: '54+', icon: Globe, color: 'text-amber' },
                { label: 'Success Rate', value: '94%', icon: Award, color: 'text-emerald' }
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                   <div className="w-16 h-16 rounded-2xl bg-surface/50 border border-border flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 shadow-xl">
                     <stat.icon size={28} className={stat.color} />
                   </div>
                   <div className="font-serif text-4xl font-black text-primary mb-3 tracking-tight">{stat.value}</div>
                   <div className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Join CTA */}
        <div className="mt-40 relative group animate-fade-up">
           <div className="absolute -inset-1 bg-gradient-to-r from-amber/20 to-emerald/20 rounded-[4rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
           <div className="relative p-20 md:p-32 rounded-[4rem] bg-surface/30 backdrop-blur-3xl border border-border/60 text-center overflow-hidden shadow-premium">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(232,160,32,0.05),transparent)] pointer-events-none" />
              
              <h2 className="font-serif text-5xl md:text-7xl font-black text-primary mb-10 tracking-tight leading-none">
                Your journey <br/><span className="text-amber italic">starts now.</span>
              </h2>
              <p className="text-xl text-muted font-medium mb-16 max-w-xl mx-auto leading-relaxed">
                Become part of the most verified opportunity cluster in Africa. Access excellence today.
              </p>
              
              <Link href="/register" className="relative group/btn inline-block">
                <div className="absolute inset-0 bg-amber blur-xl opacity-20 group-hover/btn:opacity-40 transition-opacity" />
                <span className="relative inline-block bg-amber text-black px-12 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber/10">
                  Join the Community
                </span>
              </Link>
           </div>
        </div>
      </div>
    </div>
  )
}
