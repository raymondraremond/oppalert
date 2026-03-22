'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <main className="min-h-screen bg-[#080A07] pt-10 pb-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <h1 className="font-syne text-5xl md:text-7xl font-black text-[#EDE8DF] mb-6 tracking-tighter">
            Choose Your <span className="text-[#E8A020]">Edge.</span>
          </h1>
          <p className="text-[#9A9C8E] text-xl max-w-2xl mx-auto leading-relaxed">
            Stop scrolling and start winning. Get exclusive access to high-ticket opportunities before they go viral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* FREE */}
          <div className="p-10 bg-[#141710] border border-[#252D22] rounded-[3rem] flex flex-col">
            <div className="mb-10">
              <h3 className="text-sm font-black text-[#555C50] uppercase tracking-widest mb-2">Standard</h3>
              <div className="text-5xl font-black text-[#EDE8DF] mb-4">Free</div>
              <p className="text-sm text-[#9A9C8E]">Basic access to public listings and standard alerts.</p>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">✅ Access to all public opportunities</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">✅ Weekly newsletter</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">✅ Standard support</li>
            </ul>
            <Link href="/register" className="w-full py-4 bg-transparent border border-[#252D22] text-[#EDE8DF] font-black rounded-2xl text-center hover:bg-[#222820] transition-all">
              Join Free
            </Link>
          </div>

          {/* PREMIUM */}
          <div className="p-10 bg-[#141710] border-2 border-[#E8A020] rounded-[3rem] relative shadow-glow-amber flex flex-col scale-105 z-10">
            <div className="absolute top-6 right-10 px-3 py-1 bg-[#E8A020] text-[#080A07] text-[10px] font-black rounded-full uppercase">BEST VALUE</div>
            <div className="mb-10">
              <h3 className="text-sm font-black text-[#E8A020] uppercase tracking-widest mb-2">Elite Member</h3>
              <div className="text-5xl font-black text-[#EDE8DF] mb-4">2,500 <span className="text-lg font-bold text-[#555C50]">NGN/month</span></div>
              <p className="text-sm text-[#9A9C8E]">Unlock early access and premium-only listings.</p>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">🚀 48h Early Access to all listings</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">🚀 Exclusive Premium-only grants/jobs</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">🚀 Instant WhatsApp/Email alerts</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">🚀 Priority CV review service</li>
            </ul>
            <Link href="/register" className="w-full py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl text-center hover:bg-[#F0B040] transition-all">
              Unlock Elite Access
            </Link>
          </div>

          {/* ORGANIZER PRO */}
          <div className="p-10 bg-[#141710] border border-[#8B5CF6] rounded-[3rem] flex flex-col">
            <div className="mb-10">
              <h3 className="text-sm font-black text-[#8B5CF6] uppercase tracking-widest mb-2">Organizer Pro</h3>
              <div className="text-4xl font-black text-[#EDE8DF] mb-4">45,000 <span className="text-lg font-bold text-[#555C50]">NGN/month</span></div>
              <p className="text-sm text-[#9A9C8E]">For event organizers and community leaders.</p>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">👑 Unlimited Event creation</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">👑 Real-time registration tracking</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">👑 Attendee data export (CSV)</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">👑 Email notification system</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">👑 Custom event landing pages</li>
            </ul>
            <Link href="/register" className="w-full py-4 bg-[#8B5CF6] text-white font-black rounded-2xl text-center hover:opacity-90 transition-all shadow-glow-purple">
              Get Organizer Plan →
            </Link>
          </div>
        </div>

        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-[#141710] border border-[#252D22] rounded-full text-[10px] font-black text-[#555C50] uppercase tracking-[0.3em] mb-8">
            SECURED BY PAYSTACK · FLUTTERWAVE
          </div>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black italic text-[#EDE8DF]">Paystack</span>
            <span className="text-2xl font-black italic text-[#EDE8DF]">Flutterwave</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-black text-[#EDE8DF] mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="p-8 bg-[#141710] border border-[#252D22] rounded-[2rem]">
            <h4 className="font-bold text-[#EDE8DF] mb-2">How do I pay for premium?</h4>
            <p className="text-[#9A9C8E] text-sm leading-relaxed">
              {"We process all payments securely through Paystack and Flutterwave. All transactions are encrypted and secure."}
            </p>
          </div>
          <div className="p-8 bg-[#141710] border border-[#252D22] rounded-[2rem]">
            <h4 className="font-bold text-[#EDE8DF] mb-2">Can I cancel anytime?</h4>
            <p className="text-[#9A9C8E] text-sm leading-relaxed">
              {"Yes, you can cancel your subscription at any time from your billing dashboard. You will continue to have access until the end of your billing cycle."}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
