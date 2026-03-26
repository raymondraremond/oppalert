'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Twitter, Linkedin, Instagram, Github, Mail, ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <footer className="bg-[#080A07] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-4 mb-8 group" style={{ textDecoration: 'none' }}>
              <img 
                src="/icon.png" 
                alt="OppFetch" 
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="font-syne text-2xl font-black tracking-tighter text-primary">
                Opp<span className="text-amber">Fetch</span>
              </div>
            </Link>
            <p className="text-sm text-subtle leading-relaxed mb-10 max-w-[240px]">
              The leading premium platform for discovering high-impact opportunities across Africa. Verified listings. Zero noise.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Github, href: '#' }
              ].map((Social, idx) => (
                <a key={idx} href={Social.href} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-subtle hover:text-amber hover:border-amber/50 transition-all duration-300">
                  <Social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Platform</h4>
            <ul className="space-y-4">
              {[
                { label: 'Browse Opportunities', href: '/opportunities' },
                { label: 'Organizers Hub', href: '/organizer' },
                { label: 'Pricing Plans', href: '/pricing' },
                { label: 'Create Listing', href: '/organizer/create' },
                { label: 'Success Stories', href: '/success-stories' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-subtle hover:text-amber transition-colors font-semibold outline-none focus:text-amber">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Categories</h4>
            <ul className="space-y-4">
              {[
                { label: 'Scholarships', href: '/opportunities?cat=scholarship' },
                { label: 'Remote Jobs', href: '/opportunities?cat=job' },
                { label: 'Startup Grants', href: '/opportunities?cat=grant' },
                { label: 'Fellowships', href: '/opportunities?cat=fellowship' },
                { label: 'Internships', href: '/opportunities?cat=internship' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-subtle hover:text-amber transition-colors font-semibold outline-none focus:text-amber">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Resources</h4>
            <ul className="space-y-4">
              {[
                { label: 'Career Blog', href: '/blog' },
                { label: 'Help Center', href: '/help' },
                { label: 'API Reference', href: '/api-docs' },
                { label: 'Brand Assets', href: '/brand' },
                { label: 'Contact Support', href: '/help' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-subtle hover:text-amber transition-colors font-semibold outline-none focus:text-amber">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Stay Updated</h4>
            <p className="text-xs text-subtle mb-6 leading-relaxed">Join 5,000+ Africans getting the best opportunities weekly.</p>
            <form onSubmit={handleSubscribe} className="relative mb-8">
              <input
                type="email"
                placeholder="email@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-amber/50 outline-none transition-all placeholder:text-white/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-2 w-8 h-8 rounded-lg bg-amber flex items-center justify-center text-[#080A07] hover:scale-105 active:scale-95 transition-all">
                {subscribed ? <Zap size={14} className="animate-pulse" /> : <ArrowRight size={14} />}
              </button>
            </form>
            {subscribed && <p className="text-[10px] text-emerald font-bold mt-2 animate-fade-up mb-4">Success! Check your inbox.</p>}
            
            <div className="space-y-4 mb-8">
               <a href="mailto:oppFetch@gmail.com" className="flex items-center gap-3 group">
                  <Mail size={14} className="text-amber group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-subtle group-hover:text-amber transition-colors font-mono">oppFetch@gmail.com</span>
               </a>
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_8px_rgba(52,194,122,0.5)]" />
                  <span className="text-[11px] font-bold text-subtle font-mono">+234 808 989 5943</span>
               </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-emerald" />
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Trusted by Institutions</span>
               </div>
            </div>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
             <span className="text-[11px] font-bold text-subtle uppercase tracking-widest">© {new Date().getFullYear()} OppFetch Inc.</span>
             <Link href="/privacy" className="text-[11px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors outline-none focus:text-white">Privacy</Link>
             <Link href="/terms" className="text-[11px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors outline-none focus:text-white">Terms</Link>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Live Monitoring Official</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <Globe size={12} className="text-muted" />
                <span className="text-[10px] font-bold text-muted uppercase">Lagos, Nigeria</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

