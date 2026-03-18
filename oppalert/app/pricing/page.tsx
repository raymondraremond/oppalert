'use client'
import { useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { Check, Minus, Zap, ChevronDown, ArrowRight, Star, ShieldCheck, Globe } from 'lucide-react'

const freeFeatures = [
  { label: 'Browse 2,400+ listings', included: true },
  { label: 'Save up to 5 opportunities', included: true },
  { label: 'Weekly email digest', included: true },
  { label: 'Basic category filters', included: true },
  { label: 'Instant Telegram alerts', included: false },
  { label: 'Early access (24h ahead)', included: false },
  { label: 'Unlimited saved items', included: false },
  { label: 'SMS deadline reminders', included: false },
]

const premiumFeatures = [
  { label: 'Everything in Free', included: true },
  { label: 'Instant Telegram & Email alerts', included: true, bold: true },
  { label: 'Early access (24h ahead)', included: true },
  { label: 'Unlimited saved opportunities', included: true },
  { label: 'Advanced niche filters', included: true },
  { label: 'SMS deadline reminders', included: true },
  { label: 'Priority application review', included: true },
]

const faqs = [
  {
    q: 'How do the instant alerts work?',
    a: 'Premium users get a unique Telegram bot key. Whenever a new opportunity matching your profile is verified, you get a notification instantly—often 24 hours before it hits the public site.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We process all payments through Stripe for cards and international bank transfers. For West African users, we also support bank transfers in Naira (₦1,500/mo) or Cedi.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, anytime with one click. There are no long-term contracts. You will retain premium access until the end of your current billing cycle.',
  },
  {
    q: 'What is the "Early Access" feature?',
    a: 'High-quality opportunities (like fully-funded scholarships or remote internships) often have limited slots. We verify and release these to premium members first so you can apply before the rush.',
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="animate-fade-up inline-flex items-center gap-2.5 bg-amber/10 border border-amber/20 rounded-full px-5 py-2 mb-8 group cursor-default">
            <Zap size={14} className="text-amber fill-amber animate-pulse" />
            <span className="text-amber font-bold text-xs uppercase tracking-widest font-syne">
              Simple pricing, elite results
            </span>
          </div>
          
          <h1 className="animate-fade-up animate-delay-100 font-syne text-5xl md:text-7xl font-black tracking-tighter mb-8 text-primary">
            Transparent <span className="text-amber-gradient drop-shadow-glow-amber">Pricing</span>
          </h1>
          
          <p className="animate-fade-up animate-delay-200 text-subtle text-lg md:text-xl font-medium leading-relaxed">
            Whether you&apos;re just starting out or ready to land your dream scholarship, we have a plan for you.
          </p>
        </div>

        {/* ── PRICING CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-32">
          {/* FREE PLAN */}
          <div className="animate-fade-up animate-delay-200 glass-gradient border border-[var(--border)] rounded-[3rem] p-10 flex flex-col group transition-all duration-500 hover:border-[var(--glass-border)]">
            <div className="mb-8">
              <span className="badge badge-gray px-4 py-1 text-[10px] font-black uppercase tracking-widest bg-[var(--icon-bg)] text-subtle border-[var(--glass-border)]">Standard</span>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-syne text-6xl font-black text-primary">$0</span>
                <span className="text-muted font-bold text-sm uppercase tracking-widest">/forever</span>
              </div>
              <p className="text-subtle text-sm font-medium mt-4">For occasional opportunity seekers.</p>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {freeFeatures.map((f) => (
                <div key={f.label} className={`flex items-start gap-4 text-sm ${f.included ? 'text-subtle' : 'opacity-30'}`}>
                  <div className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${f.included ? 'bg-[var(--icon-bg)] text-primary/50' : 'text-muted'}`}>
                    {f.included ? <Check size={12} className="stroke-[3]" /> : <Minus size={12} />}
                  </div>
                  <span className="font-medium">{f.label}</span>
                </div>
              ))}
            </div>

            <Link href="/register" className="w-full">
              <button className="btn-ghost w-full py-4 px-8 rounded-2xl border-[var(--glass-border)] text-primary font-black uppercase tracking-widest text-xs hover:bg-[var(--icon-bg)] group-hover:border-white/20 transition-all">
                Get Started Free
                <ArrowRight size={16} className="ml-2" />
              </button>
            </Link>
          </div>

          {/* PREMIUM PLAN */}
          <div className="animate-fade-up animate-delay-300 relative overflow-hidden glass-gradient border-2 border-amber/30 rounded-[3rem] p-10 flex flex-col shadow-premium-glow group scale-105 z-10">
            {/* Glossy background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/10 blur-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/5 blur-[80px] -z-10" />

            <div className="mb-8">
              <div className="flex justify-between items-center">
                <span className="badge badge-amber bg-amber text-bg px-4 py-1 text-[10px] font-black uppercase tracking-widest">Elite Premium</span>
                <div className="flex gap-1 text-amber">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-syne text-6xl font-black text-primary tracking-tighter">$3</span>
                <div className="flex flex-col">
                  <span className="text-amber font-black text-sm uppercase tracking-widest">/month</span>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider line-through">or $36/year</span>
                </div>
              </div>
              <p className="text-subtle text-sm font-medium mt-4">Join 4.2k+ premium African students.</p>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {premiumFeatures.map((f) => (
                <div key={f.label} className="flex items-start gap-4 text-sm text-primary">
                  <div className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-amber/20 text-amber flex items-center justify-center shadow-glow-amber/20 group-hover:scale-110 transition-transform">
                    <Check size={12} className="stroke-[4]" />
                  </div>
                  <span className={f.bold ? 'font-black text-amber' : 'font-bold'}>{f.label}</span>
                </div>
              ))}
            </div>

            <Link href="/login" className="w-full">
              <button className="btn-primary w-full py-5 px-8 rounded-2xl shadow-glow-amber text-bg font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                Unlock Elite Access
                <Zap size={18} className="fill-current stroke-[2.5]" />
              </button>
            </Link>
            <p className="text-[10px] text-center text-muted font-bold uppercase tracking-widest mt-6">
              Billed monthly · Cancel anytime
            </p>
          </div>
        </div>

        {/* ── ORGANIZATIONS ── */}
        <div className="animate-fade-up animate-delay-400 reveal glass-gradient border border-[var(--glass-border)] rounded-[4rem] p-10 md:p-16 mb-32 relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10" />
          
          <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest mb-6">
                <Globe size={12} />
                For Organizations
              </div>
              <h2 className="font-syne text-4xl md:text-5xl font-black text-primary leading-tight mb-6">
                Amplify your <span className="text-primary italic">impact.</span>
              </h2>
              <p className="text-subtle text-lg font-medium leading-relaxed mb-10">
                Reach our engaged audience of 48k+ African graduates. Packages include targeted email blasts, WhatsApp broadcasts, and priority homepage placement.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/contact" className="btn-ghost !border-primary/30 hover:!bg-primary/5 px-10 py-4 font-black uppercase tracking-widest text-xs rounded-2xl text-primary transition-all">
                  Get Partner Deck
                </Link>
                <Link href="/contact" className="btn-ghost px-10 py-4 font-black uppercase tracking-widest text-xs rounded-2xl border-[var(--glass-border)] text-primary transition-all">
                  Post a Listing Free
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
              {[
                { label: 'Basic Reach', price: '$25', stats: '20k+ impressions' },
                { label: 'Elite Blast', price: '$150', stats: 'Global Push notification' },
              ].map((item) => (
                <div key={item.label} className="bg-[var(--icon-bg)] border border-[var(--border)] rounded-[2.5rem] p-8 text-center hover:border-primary/30 transition-all group/card">
                  <p className="text-muted text-[10px] font-black uppercase tracking-widest mb-2">{item.label}</p>
                  <div className="font-syne text-4xl font-black text-primary mb-2 group-hover/card:scale-110 transition-transform">{item.price}</div>
                  <p className="text-subtle text-xs font-bold">{item.stats}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <section className="reveal max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-6">Common <span>Questions</span></h2>
            <p className="text-subtle font-medium">Everything you need to know about OppAlert Premium.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={f.q} className="group">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full text-left p-8 rounded-[2rem] border transition-all flex justify-between items-center gap-6 ${
                    openFaq === i 
                    ? 'glass-gradient border-[var(--glass-border)] bg-[var(--icon-bg)] shadow-premium' 
                    : 'border-[var(--border)] hover:border-[var(--glass-border)] hover:bg-[var(--icon-bg)]'
                  }`}
                >
                  <span className="font-syne text-lg font-extrabold text-primary tracking-tight">{f.q}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full bg-[var(--icon-bg)] flex items-center justify-center border border-[var(--glass-border)] transition-transform duration-500 ${openFaq === i ? 'rotate-180 bg-amber/20 border-amber/30 text-amber' : 'text-subtle'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-8 pt-0 text-subtle font-medium leading-relaxed text-base">
                    {f.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECURITY BADGE ── */}
        <div className="mt-32 flex flex-col items-center animate-fade-up">
          <div className="flex items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <ShieldCheck size={48} className="text-primary" />
            <span className="font-syne font-black text-2xl tracking-tighter text-primary">STRIPE <span className="text-muted">SECURE</span></span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mt-8">
            Bank-grade encryption · Verified by Google Security
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
