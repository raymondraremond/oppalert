'use client'
import Link from 'next/link'
import { ArrowLeft, Quote, Star, Users, Zap, Award } from 'lucide-react'

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
    <div className="min-h-screen bg-[#080A07] text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-up">
          <Link href="/" className="inline-flex items-center gap-2 text-amber text-xs font-black uppercase tracking-widest mb-8 hover:underline">
            <ArrowLeft size={14} /> Back to Hub
          </Link>
          <h1 className="font-syne text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Real Stories, <span className="text-amber">Real Impact.</span>
          </h1>
          <p className="text-xl text-subtle max-w-2xl mx-auto leading-relaxed">
            Join thousands of African students and professionals who have accelerated their journey through OppFetch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {stories.map((story, i) => (
            <div key={i} className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative group hover:border-amber/20 transition-all duration-500 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <Quote className="absolute top-10 right-10 text-amber/10 group-hover:text-amber/20 transition-colors" size={48} />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-gradient flex items-center justify-center font-black text-[#080A07] text-xl shadow-glow-amber">
                  {story.image}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{story.name}</h3>
                  <p className="text-xs text-amber font-black uppercase tracking-widest">{story.role}</p>
                </div>
              </div>
              <p className="text-subtle leading-relaxed mb-8 italic">&quot;{story.content}&quot;</p>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                 <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{story.location}</span>
                 <div className="flex gap-1 text-amber">
                   {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-20 border-y border-white/5 animate-fade-in">
           {[
             { label: 'Opportunities Found', value: '15,000+', icon: Zap },
             { label: 'Users Placed', value: '5,000+', icon: Users },
             { label: 'Countries Covered', value: '25+', icon: Globe },
             { label: 'Success Rate', value: '94%', icon: Award }
           ].map((stat, i) => (
             <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-6 text-amber">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-black mb-2 tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
             </div>
           ))}
        </div>

        {/* CTA */}
        <div className="mt-32 p-16 rounded-[3rem] bg-amber-gradient text-[#080A07] text-center relative overflow-hidden shadow-glow-amber">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
           <h2 className="font-syne text-4xl md:text-5xl font-black mb-8 tracking-tighter">Your story starts here.</h2>
           <Link href="/register" className="inline-block bg-[#080A07] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">
             Join the Community
           </Link>
        </div>
      </div>
    </div>
  )
}

function Globe(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
