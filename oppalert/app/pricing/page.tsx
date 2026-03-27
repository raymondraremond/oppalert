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
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
            Choose Your <span className="text-amber italic">Edge.</span>
          </h1>
          <p className="text-muted text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Whether you&apos;re seeking opportunities or organizing them, we have the perfect plan to scale your success.
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
            <div className="p-10 bg-surface/30 border border-border rounded-3xl flex flex-col hover:border-amber/30 transition-all duration-300">
              <div className="mb-10">
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Standard</h3>
                <div className="text-5xl font-serif text-primary mb-4 font-bold">Free</div>
                <p className="text-sm text-primary/70">Basic access to public listings and standard alerts.</p>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald shrink-0 mt-0.5" /> Access to all public opportunities</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald shrink-0 mt-0.5" /> Weekly curated newsletter</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald shrink-0 mt-0.5" /> Standard community support</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-surface text-primary border border-border font-bold rounded-xl text-center hover:bg-border transition-all">
                Join Free
              </Link>
            </div>

            {/* PREMIUM SEEKER */}
            <div className="p-10 bg-surface/40 border-2 border-amber rounded-3xl relative shadow-glow-amber flex flex-col scale-105 z-10 overflow-hidden">
              <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-l from-amber to-amber-light text-[#080A07] text-[10px] font-black uppercase rounded-bl-xl tracking-widest shadow-sm">Best Value</div>
              
              <div className="mb-10 pt-2">
                <h3 className="text-xs font-bold text-amber uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Crown size={14} /> Elite Member
                </h3>
                <div className="text-5xl font-serif text-primary mb-4 font-bold flex items-baseline gap-1">2,500 <span className="text-lg font-medium text-muted">NGN/mo</span></div>
                <p className="text-sm text-primary/70">Unlock early access and premium-only listings.</p>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber shrink-0 mt-0.5" /> <strong>48h Early Access</strong> to all listings</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber shrink-0 mt-0.5" /> Exclusive Premium-only grants/jobs</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber shrink-0 mt-0.5" /> Instant WhatsApp/Email alerts</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber shrink-0 mt-0.5" /> Priority CV review service</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-gradient-to-r from-amber to-amber-light text-[#080A07] font-bold rounded-xl text-center hover:shadow-glow-amber transition-all shadow-sm">
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
            <div className="p-10 bg-surface/30 border border-border rounded-3xl flex flex-col hover:border-amber/30 transition-all duration-300">
              <div className="mb-10">
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Starter (Free)</h3>
                <div className="text-4xl lg:text-5xl font-serif text-primary mb-4 font-bold">Free</div>
                <p className="text-sm text-primary/70">Unlimited event listings and standard links.</p>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald shrink-0 mt-0.5" /> Unlimited Event listings</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald shrink-0 mt-0.5" /> Custom Event Links</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald shrink-0 mt-0.5" /> Notify Attendees (Broadcast)</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-emerald shrink-0 mt-0.5" /> Basic attendance tracking</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-surface text-primary border border-border font-bold rounded-xl text-center hover:bg-border transition-all">
                Start Posting Free
              </Link>
            </div>

            {/* ORGANIZER BOOST */}
            <div className="p-10 bg-surface/40 border-2 border-indigo-400/50 rounded-3xl shadow-[0_0_30px_rgba(129,140,248,0.15)] flex flex-col scale-105 z-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-l from-indigo-500 to-indigo-400 text-white text-[10px] font-black uppercase rounded-bl-xl tracking-widest shadow-sm">Popular Choice</div>
              <div className="mb-10 pt-2">
                <h3 className="text-xs font-bold w-fit text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap size={14} /> Boost Plan
                </h3>
                <div className="text-4xl lg:text-5xl font-serif text-primary mb-4 font-bold flex items-baseline gap-1 tracking-tight">5k <span className="text-sm font-medium text-muted uppercase tracking-normal">NGN/evt</span></div>
                <p className="text-sm text-primary/70">Get featured and reach more attendees.</p>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-indigo-400 shrink-0 mt-0.5" /> <strong>Featured Placement</strong> (7 Days)</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-indigo-400 shrink-0 mt-0.5" /> Pinned to top of category</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-indigo-400 shrink-0 mt-0.5" /> Social media mention</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-indigo-400 shrink-0 mt-0.5" /> CSV Data Export</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-bold rounded-xl text-center hover:shadow-[0_0_20px_rgba(129,140,248,0.3)] transition-all">
                Boost My Event
              </Link>
            </div>

            {/* ORGANIZER PREMIUM */}
            <div className="p-10 bg-surface/30 border border-amber/30 hover:border-amber/60 rounded-3xl flex flex-col transition-all duration-300 relative">
              <div className="mb-10">
                <h3 className="text-xs font-bold text-amber uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Crown size={14} /> Premium
                </h3>
                <div className="text-4xl lg:text-5xl font-serif text-primary mb-4 font-bold flex items-baseline gap-1 tracking-tight">10k <span className="text-sm font-medium text-muted uppercase tracking-normal">NGN/evt</span></div>
                <p className="text-sm text-primary/70">Maximum visibility for large scale events.</p>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber shrink-0 mt-0.5" /> <strong>Homepage Banner</strong> (7 Days)</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber shrink-0 mt-0.5" /> Email Blast to 50k+ members</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber shrink-0 mt-0.5" /> Advanced Analytics Dashboard</li>
                <li className="text-sm text-primary/90 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber shrink-0 mt-0.5" /> Dedicated Account Manager</li>
              </ul>
              <Link href="/register" className="w-full py-4 bg-transparent border border-amber/50 text-amber font-bold rounded-xl text-center hover:bg-amber/10 transition-all">
                Get Premium
              </Link>
            </div>
          </div>
        </section>

        <div className="text-center mb-16 pt-8">
          <div className="inline-block px-4 py-1.5 bg-surface/50 border border-border rounded-full text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-8 shadow-sm">
            PAYMENT SECURED BY
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-serif font-bold text-primary">Paystack</span>
            <span className="text-2xl font-serif font-bold text-primary">Flutterwave</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif font-bold text-primary mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="p-8 bg-surface/30 border border-border rounded-3xl hover:border-amber/30 transition-colors">
            <h4 className="font-bold text-primary text-lg mb-3">How do I pay for premium?</h4>
            <p className="text-muted text-sm leading-relaxed">
              We process all payments securely through Paystack and Flutterwave. All transactions are entirely end-to-end encrypted and we do not store your card details on our servers.
            </p>
          </div>
          <div className="p-8 bg-surface/30 border border-border rounded-3xl hover:border-amber/30 transition-colors">
            <h4 className="font-bold text-primary text-lg mb-3">Can I cancel anytime?</h4>
            <p className="text-muted text-sm leading-relaxed">
              Yes, you can cancel your subscription at any time directly from your billing dashboard. You will continue to have access to your premium features until the end of your current billing cycle.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
