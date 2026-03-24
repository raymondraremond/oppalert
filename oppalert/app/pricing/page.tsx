'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, Rocket, Crown, Zap, ShieldCheck } from 'lucide-react'

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <main className="min-h-screen bg-bg pt-10 pb-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-syne text-5xl md:text-7xl font-black text-primary mb-6 tracking-tighter">
            Choose Your <span className="text-[#E8A020]">Edge.</span>
          </h1>
          <p className="text-muted text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re seeking opportunities or organizing them, we have the perfect plan to help you scale.
          </p>
        </div>

        {/* FOR SEEKERS */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-border"></div>
            <h2 className="font-syne text-2xl font-bold text-primary uppercase tracking-widest text-center px-4">For Opportunity Seekers</h2>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* FREE SEEKER */}
            <div className="p-10 bg-bg2 border border-border rounded-[3rem] flex flex-col">
              <div className="mb-10">
                <h3 className="text-sm font-black text-subtle uppercase tracking-widest mb-2">Standard</h3>
                <div className="text-5xl font-black text-primary mb-4">Free</div>
                <p className="text-sm text-muted">Basic access to public listings and standard alerts.</p>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                <li className="text-sm text-primary flex items-center gap-3"><CheckCircle2 size={16} className="text-[#34C27A]" /> Access to all public opportunities</li>
                <li className="text-sm text-primary flex items-center gap-3"><CheckCircle2 size={16} className="text-[#34C27A]" /> Weekly newsletter</li>
                <li className="text-sm text-primary flex items-center gap-3"><CheckCircle2 size={16} className="text-[#34C27A]" /> Standard support</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-transparent border border-border text-primary font-black rounded-2xl text-center hover:bg-surface transition-all">
                Join Free
              </Link>
            </div>

            {/* PREMIUM SEEKER */}
            <div className="p-10 bg-bg2 border-2 border-[#E8A020] rounded-[3rem] relative shadow-glow-amber flex flex-col scale-105 z-10">
              <div className="absolute top-6 right-10 px-3 py-1 bg-[#E8A020] text-[#080A07] text-[10px] font-black rounded-full uppercase">BEST VALUE</div>
              <div className="mb-10">
                <h3 className="text-sm font-black text-[#E8A020] uppercase tracking-widest mb-2">Elite Member</h3>
                <div className="text-5xl font-black text-primary mb-4">2,500 <span className="text-lg font-bold text-subtle">NGN/mo</span></div>
                <p className="text-sm text-muted">Unlock early access and premium-only listings.</p>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                <li className="text-sm text-primary flex items-center gap-3"><Rocket size={16} className="text-[#E8A020]" /> 48h Early Access to all listings</li>
                <li className="text-sm text-primary flex items-center gap-3"><Rocket size={16} className="text-[#E8A020]" /> Exclusive Premium-only grants/jobs</li>
                <li className="text-sm text-primary flex items-center gap-3"><Rocket size={16} className="text-[#E8A020]" /> Instant WhatsApp/Email alerts</li>
                <li className="text-sm text-primary flex items-center gap-3"><Rocket size={16} className="text-[#E8A020]" /> Priority CV review service</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl text-center hover:bg-[#F0B040] transition-all">
                Unlock Elite Access
              </Link>
            </div>
          </div>
        </section>

        {/* FOR ORGANIZERS */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-border"></div>
            <h2 className="font-syne text-2xl font-bold text-primary uppercase tracking-widest text-center px-4">For Event Organizers</h2>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ORGANIZER FREE */}
            <div className="p-10 bg-bg2 border border-border rounded-[3rem] flex flex-col">
              <div className="mb-10">
                <h3 className="text-sm font-black text-subtle uppercase tracking-widest mb-2">Starter (Free)</h3>
                <div className="text-5xl font-black text-primary mb-4">Free</div>
                <p className="text-sm text-muted">Test the waters with your first event.</p>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                <li className="text-sm text-primary flex items-center gap-3"><CheckCircle2 size={16} className="text-[#34C27A]" /> 1 Active Event listing</li>
                <li className="text-sm text-primary flex items-center gap-3"><CheckCircle2 size={16} className="text-[#34C27A]" /> Up to 50 Registrations</li>
                <li className="text-sm text-primary flex items-center gap-3"><CheckCircle2 size={16} className="text-[#34C27A]" /> Basic event page</li>
                <li className="text-sm text-subtle flex items-center gap-3 opacity-50"><ShieldCheck size={16} /> No analytics</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-transparent border border-border text-primary font-black rounded-2xl text-center hover:bg-surface transition-all">
                Start Hosting
              </Link>
            </div>

            {/* ORGANIZER PRO */}
            <div className="p-10 bg-bg2 border-2 border-[#8B5CF6] rounded-[3rem] shadow-glow-purple flex flex-col scale-105 z-10">
              <div className="mb-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-black text-[#8B5CF6] uppercase tracking-widest text-[10px]">Starter Plan</h3>
                  <span className="px-2 py-0.5 bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-black rounded uppercase tracking-tighter">Popular</span>
                </div>
                <div className="text-4xl font-black text-primary mb-4 flex items-baseline gap-1">7,500 <span className="text-sm font-bold text-subtle uppercase">NGN/mo</span></div>
                <p className="text-sm text-muted">Perfect for growing communities.</p>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                <li className="text-sm text-primary flex items-center gap-3"><Zap size={16} className="text-[#8B5CF6]" /> Up to 5 Active Events</li>
                <li className="text-sm text-primary flex items-center gap-3"><Zap size={16} className="text-[#8B5CF6]" /> Unlimited Registrations</li>
                <li className="text-sm text-primary flex items-center gap-3"><Zap size={16} className="text-[#8B5CF6]" /> Basic Registration Analytics</li>
                <li className="text-sm text-primary flex items-center gap-3"><Zap size={16} className="text-[#8B5CF6]" /> CSV Data Export</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-[#8B5CF6] text-white font-black rounded-2xl text-center hover:opacity-90 transition-all">
                Go Pro Now
              </Link>
            </div>

            {/* ORGANIZER ENTERPRISE */}
            <div className="p-10 bg-bg2 border border-[#E8A020] rounded-[3rem] flex flex-col transition-all hover:border-[#E8A020]/50">
              <div className="mb-10">
                <h3 className="text-sm font-black text-[#E8A020] uppercase tracking-widest mb-2">Enterprise</h3>
                <div className="text-4xl font-black text-primary mb-4 flex items-baseline gap-1">45,000 <span className="text-sm font-bold text-subtle uppercase">NGN/mo</span></div>
                <p className="text-sm text-muted">The ultimate tool for large scale events.</p>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                <li className="text-sm text-primary flex items-center gap-3"><Crown size={16} className="text-[#E8A020]" /> Unlimited Event Listings</li>
                <li className="text-sm text-primary flex items-center gap-3"><Crown size={16} className="text-[#E8A020]" /> Priority Homepage Placement</li>
                <li className="text-sm text-primary flex items-center gap-3"><Crown size={16} className="text-[#E8A020]" /> Advanced Analytics <span className="text-[9px] bg-[#E8A020]/20 text-[#E8A020] px-1.5 py-0.5 rounded ml-1 font-black whitespace-nowrap">COMING SOON</span></li>
                <li className="text-sm text-primary flex items-center gap-3"><Crown size={16} className="text-[#E8A020]" /> Dedicated Success Manager</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-transparent border border-[#E8A020] text-[#E8A020] font-black rounded-2xl text-center hover:bg-[#E8A020]/5 transition-all">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-bg2 border border-border rounded-full text-[10px] font-black text-subtle uppercase tracking-[0.3em] mb-8">
            SECURED BY PAYSTACK · FLUTTERWAVE
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black italic text-primary">Paystack</span>
            <span className="text-2xl font-black italic text-primary">Flutterwave</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-black text-primary mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="p-8 bg-bg2 border border-border rounded-[2rem]">
            <h4 className="font-bold text-primary mb-2">How do I pay for premium?</h4>
            <p className="text-muted text-sm leading-relaxed">
              {"We process all payments securely through Paystack and Flutterwave. All transactions are encrypted and secure."}
            </p>
          </div>
          <div className="p-8 bg-bg2 border border-border rounded-[2rem]">
            <h4 className="font-bold text-primary mb-2">Can I cancel anytime?</h4>
            <p className="text-muted text-sm leading-relaxed">
              {"Yes, you can cancel your subscription at any time from your billing dashboard. You will continue to have access until the end of your billing cycle."}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
