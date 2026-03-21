"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  return (
    <main className="min-h-screen bg-[#080A07] pt-10 pb-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <h1 className="font-syne text-5xl md:text-7xl font-black text-[#EDE8DF] mb-6 tracking-tighter">Choose Your <span className="text-[#E8A020]">Edge.</span></h1>
          <p className="text-[#9A9C8E] text-xl max-w-2xl mx-auto leading-relaxed">
            Stop scrolling and start winning. Get exclusive access to high-ticket opportunities before they go viral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              Get Started Free
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
            <Link href={user ? "/dashboard" : "/register"} className="w-full py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl text-center hover:bg-[#F0B040] transition-all">
              Unlock Elite Access
            </Link>
          </div>

          {/* ORGANIZER */}
          <div className="p-10 bg-[#141710] border border-[#252D22] rounded-[3rem] flex flex-col">
            <div className="mb-10">
              <h3 className="text-sm font-black text-[#555C50] uppercase tracking-widest mb-2">Organizer</h3>
              <div className="text-5xl font-black text-[#EDE8DF] mb-4">5,000 <span className="text-lg font-bold text-[#555C50]">NGN/month</span></div>
              <p className="text-sm text-[#9A9C8E]">Professional tools for educators and communities.</p>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">🎪 Unlimited events & bootcamps</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">🎪 CSV Attendee export</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">🎪 Real-time registration analytics</li>
              <li className="text-sm text-[#EDE8DF] flex items-center gap-3">🎪 Gold Verified Badge on listings</li>
            </ul>
            <Link href="/organizer" className="w-full py-4 bg-[#222820] text-[#EDE8DF] font-black rounded-2xl text-center hover:bg-[#E8A020] hover:text-[#080A07] transition-all">
              Become an Organizer
            </Link>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <div className="text-[#EDE8DF] font-black italic text-xl">Secured by Paystack</div>
            <div className="text-[#EDE8DF] font-black italic text-xl">Flutterwave</div>
          </div>
          <p className="text-[10px] text-[#555C50] font-bold uppercase tracking-[0.3em] mt-8">Secure localized payments for all African regions</p>
        </div>
      </div>
    </main>
  )
}
