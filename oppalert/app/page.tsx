'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { opportunities as seedData } from '@/lib/data'
import OpportunityCard from '@/components/OpportunityCard'
import { GraduationCap, Briefcase, Users, Coins, Leaf, Rocket, Calendar, Globe, MapPin, ArrowRight, Share2, MousePointer2, TrendingUp } from 'lucide-react'
import Typewriter from 'typewriter-effect'
import { motion } from 'framer-motion'

const sampleEvents = [
  {
    id: 'sample-1',
    title: 'Data Science Bootcamp Lagos 2025',
    organizer_name: 'TechAfrica Hub',
    event_type: 'bootcamp',
    start_date: '2025-04-15T09:00:00Z',
    location: 'Lagos, Nigeria',
    is_online: false,
    max_capacity: 100,
    current_registrations: 55,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-data-science-bootcamp',
    color: '#E8A020',
  },
  {
    id: 'sample-2',
    title: 'Remote Work Masterclass for Africans',
    organizer_name: 'AfriWork Community',
    event_type: 'workshop',
    start_date: '2025-04-20T14:00:00Z',
    location: 'Online',
    is_online: true,
    max_capacity: 500,
    current_registrations: 234,
    is_paid: false,
    ticket_price: 0,
    slug: 'sample-remote-work-masterclass',
    color: '#4A9EE8',
  },
  {
    id: 'sample-3',
    title: 'Startup Pitch Night Nairobi',
    organizer_name: 'Nairobi Tech Week',
    event_type: 'meetup',
    start_date: '2025-05-02T18:00:00Z',
    location: 'Nairobi, Kenya',
    is_online: false,
    max_capacity: 150,
    current_registrations: 89,
    is_paid: true,
    ticket_price: 2000,
    slug: 'sample-startup-pitch-night',
    color: '#8B5CF6',
  },
]

export default function HomePage() {
  const [featured, setFeatured] = useState(seedData.filter(o => o.is_featured))

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

  const getDeadlineText = (opp: any): string => {
    const days = parseInt(opp.days_remaining)
    if (!isNaN(days) && days > 0) {
      if (days === 1) return "1 day left"
      if (days < 30) return days + " days left"
      return Math.ceil(days / 30) + " months left"
    }
    return "Open"
  }

  const categories = [
    { name: 'Scholarships', icon: <GraduationCap size={32} className="mx-auto" />, slug: 'scholarship' },
    { name: 'Remote Jobs', icon: <Briefcase size={32} className="mx-auto" />, slug: 'job' },
    { name: 'Fellowships', icon: <Users size={32} className="mx-auto" />, slug: 'fellowship' },
    { name: 'Grants', icon: <Coins size={32} className="mx-auto" />, slug: 'grant' },
    { name: 'Internships', icon: <Leaf size={32} className="mx-auto" />, slug: 'internship' },
    { name: 'Startup Funding', icon: <Rocket size={32} className="mx-auto" />, slug: 'startup' },
  ]

  return (
    <main className="min-h-screen bg-bg overflow-x-hidden">
      {/* Hero */}
      <section className="text-center relative overflow-hidden flex flex-col justify-center min-h-[85vh] px-6">
        {/* Background remains same or slightly enhanced */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-[#080A07]">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E8A020]/10 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#34C27A]/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 w-full py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
             <span className="w-2 h-2 rounded-full bg-[#E8A020] animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E8A020]">Surgical UI Upgrade 3.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-syne text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[1.05]"
          >
            Empowering <span className="text-[#E8A020]">African</span> <br />Leaders.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed border-l-2 border-[#E8A020]/30 pl-6 text-left"
          >
            The premium gateway to verified scholarships, remote jobs, and VC funding. Built for the ambitious African professional.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link href="/opportunities" className="px-10 py-5 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-glow-amber tracking-wider flex items-center justify-center gap-2">
              Browse Opportunities <ArrowRight size={20} />
            </Link>
            <Link href="/register?type=organizer" className="px-10 py-5 bg-transparent text-white border-2 border-white/10 font-black rounded-2xl hover:bg-white/5 hover:border-[#E8A020]/40 active:scale-95 transition-all tracking-wider flex items-center justify-center gap-2">
              Host an Event — Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Landing Page Features */}
      <section className="py-20 px-6 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Link Tool / Typing Animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-[#1A1D18] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group min-h-[400px]"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <Share2 size={120} className="text-[#E8A020]" />
            </div>
            <div className="relative z-10 max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-[#E8A020]/10 flex items-center justify-center mb-6">
                <MousePointer2 className="text-[#E8A020]" />
              </div>
              <h3 className="font-syne text-3xl font-black text-white mb-4">Launch in seconds.</h3>
              <p className="text-[#A0A59A] mb-10 text-lg leading-relaxed">
                Create beautiful event pages with short links that actually convert. Now 100% free for all African organizers.
              </p>
              
              <div className="bg-[#080A07] p-6 rounded-2xl border border-white/10 shadow-2xl font-mono text-sm">
                <div className="flex items-center gap-2 text-white/40 mb-3 text-[10px] uppercase font-bold tracking-widest pl-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                  <span className="ml-2">Live URL Generator</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <span className="text-[#E8A020]">oppfetch.com/</span>
                  <div className="text-white font-bold border-b border-[#E8A020]/40 pb-1">
                    <Typewriter
                      options={{
                        strings: ['tech-summit-2025', 'founder-meetup', 'design-bootcamp', 'ai-workshop-lagos'],
                        autoStart: true,
                        loop: true,
                        delay: 50,
                        deleteSpeed: 30
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Engagement Indicator */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#0D0F0B] border border-[#E8A020]/20 rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative shadow-glow-amber/5"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#34C27A]/10 flex items-center justify-center mb-6">
                <TrendingUp className="text-[#34C27A]" />
              </div>
              <h3 className="font-syne text-2xl font-black text-white mb-2">Massive Reach.</h3>
              <p className="text-[#A0A59A] text-sm leading-relaxed">
                Access a network of 48,000+ top African talent instantly.
              </p>
            </div>

            <div className="mt-10 relative">
               <div className="text-6xl font-black text-[#E8A020] mb-2">98%</div>
               <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Average Conversion Rate</div>
               
               {/* Visual Chart Placeholder */}
               <div className="flex items-end gap-2 h-20 mt-6">
                  {[40, 60, 45, 80, 55, 95, 70].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                      className={`flex-1 rounded-t-lg ${i === 5 ? 'bg-[#E8A020]' : 'bg-white/10'}`}
                    />
                  ))}
               </div>
            </div>
          </motion.div>

          {/* Card 3: Featured Preview / Browse Context */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 bg-[#1A1D18] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group"
          >
             <div className="text-center mb-8">
                <h3 className="font-syne text-xl font-black text-white mb-2">Discovery Hub</h3>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">Verified Opportunities Only</p>
             </div>
             
             <div className="scale-90 opacity-60 group-hover:opacity-100 group-hover:scale-95 transition-all duration-500 -rotate-2 group-hover:rotate-0">
                {featured[0] && <OpportunityCard opportunity={featured[0]} index={0} />}
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-[#E8A020] rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden relative"
          >
            <div className="max-w-md relative z-10 text-center md:text-left mb-8 md:mb-0">
              <h3 className="font-syne text-4xl font-black text-[#080A07] mb-4">Elite Seekers.</h3>
              <p className="text-[#080A07]/70 text-lg leading-relaxed font-bold">
                Get 48h early access to listings and premium WhatsApp alerts. ₦2,500/mo.
              </p>
              <Link href="/pricing" className="mt-8 inline-block px-8 py-4 bg-[#080A07] text-white font-black rounded-2xl hover:scale-105 transition-all">
                Become a Member
              </Link>
            </div>
            <div className="w-full md:w-1/3 opacity-20 md:opacity-100">
               <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 4).map((c, i) => (
                    <div key={i} className="p-4 bg-[#080A07] rounded-2xl text-white flex items-center justify-center">
                       {c.icon}
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-6 bg-[var(--bg2)] border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-transparent pointer-events-none opacity-[0.03] select-none" style={{ backgroundImage: 'radial-gradient(var(--amber) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-syne text-3xl md:text-4xl font-black text-primary mb-3">Featured <span className="text-amber">Opportunities</span></h2>
              <p className="text-muted text-lg max-w-xl">Handpicked high-impact opportunities closing soon across Africa.</p>
            </div>
            <Link href="/opportunities" className="text-amber font-black uppercase tracking-widest text-xs hover:opacity-80 transition-opacity flex items-center gap-2">
              View All Opportunities <ArrowRight size={14} strokeWidth={3} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} deadlineOverride={getDeadlineText(opp)} />
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-syne text-3xl font-black text-primary mb-2">Upcoming Events & Bootcamps</h2>
              <p className="text-muted">Level up with community-led workshops and meetups.</p>
            </div>
            <Link href="/events" className="text-[#E8A020] font-bold hover:underline">View All Events →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleEvents.map((event) => (
              <div key={event.id} className="bg-bg2 border border-border rounded-[2rem] p-8 hover:border-amber/50 transition-all group" style={{ borderLeft: `4px solid ${event.color}` }}>
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-bg rounded-full text-[10px] font-black uppercase text-muted border border-border">
                    {event.event_type}
                  </span>
                  <span className="text-amber text-xs font-bold">{event.is_paid ? `NGN ${event.ticket_price.toLocaleString()}` : 'FREE'}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-amber transition-colors line-clamp-2">{event.title}</h3>
                <div className="space-y-3 mb-8">
                  <div className="text-sm text-muted flex items-center gap-2"><Calendar size={16} /> {new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-sm text-muted flex items-center gap-2">{event.is_online ? <><Globe size={16} /> Online</> : <><MapPin size={16} /> {event.location}</>}</div>
                </div>
                <div className="w-full bg-bg rounded-full h-1.5 mb-4 overflow-hidden">
                  <div className="h-full" style={{ width: `${(event.current_registrations / event.max_capacity) * 100}%`, backgroundColor: event.color }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-subtle uppercase mb-8">
                  <span>Registration</span>
                  <span>{event.current_registrations}/{event.max_capacity} Booked</span>
                </div>
                <Link href={`/events/${event.slug}`} className="block w-full py-3 bg-surface text-primary text-center font-black rounded-xl group-hover:bg-amber group-hover:text-[#080A07] transition-all">
                  Register Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center bg-amber shadow-[0_-20px_50px_rgba(192,112,16,0.1)]">
        <h2 className="font-syne text-4xl font-black text-[#080A07] mb-6">Ready to find your next opportunity?</h2>
        <p className="text-[#080A07] opacity-80 mb-10 text-lg max-w-xl mx-auto font-medium">Join thousands of students and professionals receiving weekly alerts.</p>
        <Link href="/register" className="px-12 py-5 bg-bg text-primary font-black rounded-2xl hover:scale-105 transition-all inline-block shadow-2xl">
          Create Free Account →
        </Link>
      </section>
    </main>
  )
}
