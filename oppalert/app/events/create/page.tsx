import Link from "next/link"

export default function EventsCreateLandingPage() {
  const features = [
    { icon: "🔗", title: "Unique Event URL", desc: "Share one link anywhere and track your sources." },
    { icon: "📊", title: "Live Registration Tracking", desc: "Watch signups happen in real time from your dashboard." },
    { icon: "📧", title: "Auto Confirmation Emails", desc: "Attendees get instant confirmation and calendar invites." },
    { icon: "📥", title: "CSV Export", desc: "Download your full attendee list for offline management." },
    { icon: "🎫", title: "Free and Paid Events", desc: "Collect ticket payments securely via Paystack." },
    { icon: "✅", title: "Verified Badge", desc: "Build trust with a verified organizer badge on your profile." },
  ]

  return (
    <main className="min-h-screen bg-bg pt-20 pb-32">
      {/* HERO */}
      <section className="container mx-auto px-6 text-center mb-24">
        <span className="px-4 py-1.5 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full text-[10px] font-black text-[#E8A020] uppercase tracking-[0.2em] mb-8 inline-block">
          FOR ORGANIZERS
        </span>
        <h1 className="font-syne text-5xl md:text-7xl font-black text-primary mb-8 tracking-tighter leading-tight">
          Turn your expertise into<br />
          <span className="text-[#E8A020]">an unforgettable event.</span>
        </h1>
        <p className="text-xl text-muted max-w-3xl mx-auto mb-12 leading-relaxed">
          OppFetch gives African educators and community leaders professional tools to host events that matter. From intimate workshops to large conferences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/organizer" className="px-10 py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:scale-105 transition-all text-lg shadow-glow-emerald">
            Create Your First Event →
          </Link>
          <button className="px-10 py-4 bg-transparent text-primary border border-border font-black rounded-2xl hover:bg-bg2 transition-all text-lg">
            See How It Works
          </button>
        </div>
        
        <div className="mt-20 flex justify-center items-center gap-8 md:gap-16 border-y border-border py-8">
          <div className="text-center">
            <div className="text-2xl font-black text-primary">500+</div>
            <div className="text-[10px] font-bold text-subtle uppercase tracking-widest">Events Hosted</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-primary">12,000+</div>
            <div className="text-[10px] font-bold text-subtle uppercase tracking-widest">Registrations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-primary">32</div>
            <div className="text-[10px] font-bold text-subtle uppercase tracking-widest">African Countries</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 mb-32">
        <h2 className="font-syne text-3xl font-black text-primary mb-16 text-center">Everything you need to run a great event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-10 bg-bg2 border border-border rounded-[2.5rem] hover:border-[#E8A020]/30 transition-all group">
              <div className="w-14 h-14 bg-bg border border-border rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-[#E8A020] group-hover:text-[#080A07] transition-all">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{f.title}</h3>
              <p className="text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FREE */}
          <div className="p-12 bg-bg2 border border-border rounded-[3rem] relative overflow-hidden flex flex-col">
            <div className="mb-8">
              <h3 className="text-sm font-black text-muted uppercase tracking-[0.2em] mb-2">Get started</h3>
              <div className="text-5xl font-black text-primary mb-4">0 <span className="text-lg font-bold text-subtle">NGN/month</span></div>
              <p className="text-muted">Perfect for small community meetups and workshops.</p>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              <li className="text-sm text-primary flex items-center gap-3">✅ 1 active event</li>
              <li className="text-sm text-primary flex items-center gap-3">✅ Up to 50 registrations</li>
              <li className="text-sm text-primary flex items-center gap-3">✅ Basic analytics</li>
              <li className="text-sm text-primary flex items-center gap-3">✅ Standard listing</li>
            </ul>
            <Link href="/organizer" className="w-full py-4 bg-transparent border border-border text-primary font-black rounded-2xl text-center hover:bg-surface transition-all">
              Start Free
            </Link>
          </div>

          {/* PREMIUM */}
          <div className="p-12 bg-bg2 border-2 border-[#E8A020] rounded-[3rem] relative overflow-hidden flex flex-col shadow-glow-emerald">
            <div className="absolute top-6 right-6 px-3 py-1 bg-[#E8A020] text-[#080A07] text-[10px] font-black rounded-full uppercase">POPULAR</div>
            <div className="mb-8">
              <h3 className="text-sm font-black text-[#E8A020] uppercase tracking-[0.2em] mb-2">Go Professional</h3>
              <div className="text-5xl font-black text-primary mb-4">5,000 <span className="text-lg font-bold text-subtle">NGN/month</span></div>
              <p className="text-muted">Scale your community with unlimited potential.</p>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              <li className="text-sm text-primary flex items-center gap-3">🚀 Unlimited events</li>
              <li className="text-sm text-primary flex items-center gap-3">🚀 Unlimited registrations</li>
              <li className="text-sm text-primary flex items-center gap-3">🚀 Advanced analytics</li>
              <li className="text-sm text-primary flex items-center gap-3">🚀 Priority listing</li>
              <li className="text-sm text-primary flex items-center gap-3">🚀 CSV Export & Verified badge</li>
            </ul>
            <Link href="/pricing" className="w-full py-4 bg-[#E8A020] text-[#080A07] font-black rounded-2xl text-center hover:bg-[#F0B040] transition-all">
              Upgrade Now
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-6 text-center mb-32">
        <h2 className="font-syne text-3xl font-black text-primary mb-20">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="relative">
            <div className="w-20 h-20 bg-bg2 border border-border text-[#E8A020] text-3xl font-black rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">1</div>
            <h4 className="text-xl font-bold text-primary mb-4">Create your profile</h4>
            <p className="text-muted text-sm leading-relaxed">Tell us about your organization and what you do. Get set up in seconds.</p>
          </div>
          <div className="relative">
            <div className="w-20 h-20 bg-bg2 border border-border text-[#E8A020] text-3xl font-black rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">2</div>
            <h4 className="text-xl font-bold text-primary mb-4">Share your link</h4>
            <p className="text-muted text-sm leading-relaxed">Set up your event details and share your unique URL across social media.</p>
          </div>
          <div className="relative">
            <div className="w-20 h-20 bg-bg2 border border-border text-[#E8A020] text-3xl font-black rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">3</div>
            <h4 className="text-xl font-bold text-primary mb-4">Manage attendees</h4>
            <p className="text-muted text-sm leading-relaxed">Watch registrations roll in, track performance, and download attendee data.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto py-24 bg-bg2 border border-border rounded-[4rem] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#EDE8DF 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
          <div className="relative z-10 px-8">
            <h2 className="font-syne text-4xl md:text-5xl font-black text-primary mb-8 tracking-tighter">Ready to host your first event?</h2>
            <p className="text-xl text-muted mb-12 max-w-2xl mx-auto">
              Join hundreds of African organizers already using OppFetch to grow their communities.
            </p>
            <Link href="/organizer" className="px-12 py-5 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:scale-105 transition-all text-xl shadow-glow-emerald inline-block">
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
