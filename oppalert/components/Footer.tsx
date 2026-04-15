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
    <footer className="bg-bg border-t border-border/50 pt-24 pb-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          {/* Column 1: Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/20 flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-emerald/10 blur-md group-hover:bg-emerald/20 transition-colors" />
                <img src="/icon.png" alt="OppAlert" className="w-6 h-6 object-contain relative z-10 drop-shadow-sm" />
              </div>
              <div className="font-serif text-2xl font-bold tracking-tight text-primary">
                Opp<span className="text-emerald italic">Alert</span>
              </div>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-10 max-w-[240px]">
              The leading premium platform for discovering high-impact opportunities across Africa. Verified listings. Zero noise.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Github, href: '#' }
              ].map((Social, idx) => (
                <a key={idx} href={Social.href} className="w-10 h-10 rounded-xl bg-surface/50 border border-border flex items-center justify-center text-muted hover:text-emerald hover:border-emerald/50 hover:bg-surface transition-all duration-300">
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
                  <Link href={link.href} className="text-sm text-subtle hover:text-emerald transition-colors font-semibold outline-none focus:text-emerald">
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
                  <Link href={link.href} className="text-sm text-subtle hover:text-emerald transition-colors font-semibold outline-none focus:text-emerald">
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
                  <Link href={link.href} className="text-sm text-subtle hover:text-emerald transition-colors font-semibold outline-none focus:text-emerald">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-8">Stay Updated</h4>
            <p className="text-xs text-muted mb-6 leading-relaxed">Join 5,000+ Africans getting the best opportunities weekly.</p>
            <form onSubmit={handleSubscribe} className="relative mb-8">
              <input
                type="email"
                placeholder="email@example.com"
                required
                className="w-full bg-surface/30 border border-border rounded-xl px-4 py-3.5 text-xs text-primary focus:border-emerald/50 outline-none transition-all placeholder:text-muted/50 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute right-2 top-2">
                <button type="submit" className="w-8 h-8 rounded-lg bg-emerald flex items-center justify-center text-[#080A07] hover:scale-105 active:scale-95 transition-all shadow-sm">
                  {subscribed ? <Zap size={14} className="animate-pulse" /> : <ArrowRight size={14} />}
                </button>
              </div>
            </form>
            {subscribed && <p className="text-[10px] text-emerald font-bold mt-2 animate-in fade-in slide-in-from-bottom-1 mb-4">Success! Check your inbox.</p>}
            
            <div className="space-y-4 mb-8">
               <a href="mailto:hello@oppalert.com" className="flex items-center gap-3 group">
                  <Mail size={14} className="text-emerald group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-muted group-hover:text-emerald transition-colors font-mono">hello@oppalert.com</span>
               </a>
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_8px_rgba(52,194,122,0.5)]" />
                  <span className="text-[11px] font-bold text-muted font-mono">+234 808 989 5943</span>
               </div>
            </div>

            <div className="p-4 bg-surface/30 border border-border rounded-2xl">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-emerald" />
                  <span className="text-[10px] font-bold text-primary/80 uppercase tracking-wider">Trusted by Institutions</span>
               </div>
            </div>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
             <span className="text-[11px] font-bold text-muted uppercase tracking-widest">© {new Date().getFullYear()} OppAlert Inc.</span>
             <Link href="/privacy" className="text-[11px] font-bold text-muted/80 hover:text-emerald uppercase tracking-widest transition-colors outline-none focus:text-emerald">Privacy</Link>
             <Link href="/terms" className="text-[11px] font-bold text-muted/80 hover:text-emerald uppercase tracking-widest transition-colors outline-none focus:text-emerald">Terms</Link>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Live Monitoring Official</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 rounded-full border border-border mt-4 md:mt-0">
                <Globe size={12} className="text-muted/80" />
                <span className="text-[10px] font-bold text-muted/80 uppercase tracking-wider">Lagos, Nigeria</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

