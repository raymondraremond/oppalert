import Link from "next/link"

export default function EventsCreateLandingPage() {
  const features = [
    { icon: "🔗", title: "Unique Registration Link", desc: "Get a custom URL for your event that you can share anywhere." },
    { icon: "📊", title: "Real-time Analytics", desc: "Track views and registrations as they happen in your dashboard." },
    { icon: "📧", title: "Attendee Management", desc: "See your list of attendees and send updates easily." },
    { icon: "📥", title: "Export Attendee Data", desc: "Download your attendee list as CSV for offline use." },
    { icon: "🎫", title: "Free and Paid Events", desc: "Host free community meetups or sell tickets for premium workshops." },
    { icon: "✅", title: "Verified Organizer Badge", desc: "Build trust with a gold verified tick on your profile." },
  ]

  return (
    <div className="min-h-screen bg-[#080A07] pt-24 pb-20">
      {/* HERO */}
      <section className="container mx-auto px-6 text-center mb-24">
        <h1 className="text-4xl md:text-7xl font-black text-[#EDE8DF] mb-6 leading-tight">
          Host Your Event on <span className="text-[#E8A020]">OppAlert</span>
        </h1>
        <p className="text-xl text-[#9A9C8E] max-w-3xl mx-auto mb-10">
          Reach thousands of African students and professionals. From small workshops to large conferences, we provide the tools to make your event a success.
        </p>
        <Link href="/organizer/setup" className="px-10 py-4 bg-[#E8A020] text-[#080A07] font-black rounded-xl text-lg hover:bg-[#F0B040] transition-all transform hover:scale-105 inline-block">
          Get Started for Free →
        </Link>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-[#141710] border border-[#252D22] rounded-3xl hover:border-[#E8A020]/30 transition-colors">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-[#EDE8DF] font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-[#9A9C8E] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="container mx-auto px-6 mb-32">
        <div className="max-w-xl mx-auto p-1 text-transparent bg-gradient-to-r from-[#E8A020] to-[#F97316] rounded-[2rem]">
          <div className="bg-[#080A07] p-10 md:p-14 rounded-[1.9rem] text-center">
            <h2 className="text-[10px] font-black text-[#E8A020] uppercase tracking-[0.3em] mb-4">Organizer Premium</h2>
            <div className="text-5xl font-black text-[#EDE8DF] mb-4">₦5,000<span className="text-lg text-[#555C50] font-bold">/month</span></div>
            <p className="text-[#9A9C8E] mb-8">Everything you need to host professional events and build your brand.</p>
            
            <ul className="text-left space-y-4 mb-10 max-w-xs mx-auto">
              <li className="text-[#EDE8DF] text-sm flex items-center gap-3">
                <span className="text-[#E8A020]">✓</span> Unlimited events
              </li>
              <li className="text-[#EDE8DF] text-sm flex items-center gap-3">
                <span className="text-[#E8A020]">✓</span> Verified organizer badge
              </li>
              <li className="text-[#EDE8DF] text-sm flex items-center gap-3">
                <span className="text-[#E8A020]">✓</span> Featured event placements
              </li>
              <li className="text-[#EDE8DF] text-sm flex items-center gap-3">
                <span className="text-[#E8A020]">✓</span> Custom registration fields
              </li>
            </ul>

            <Link href="/pricing" className="w-full py-4 bg-[#EDE8DF] text-[#080A07] font-black rounded-xl hover:bg-white transition-colors block">
              Upgrade Now
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-[#EDE8DF] mb-16">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="relative">
            <div className="w-16 h-16 bg-[#222820] text-[#E8A020] rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">1</div>
            <h4 className="text-[#EDE8DF] font-bold mb-3">Create your profile</h4>
            <p className="text-[#9A9C8E] text-sm">Tell us about your organization and what you do.</p>
            <div className="hidden md:block absolute top-8 left-[65%] w-[70%] h-[2px] bg-gradient-to-r from-[#222820] to-transparent"></div>
          </div>
          <div className="relative">
            <div className="w-16 h-16 bg-[#222820] text-[#E8A020] rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">2</div>
            <h4 className="text-[#EDE8DF] font-bold mb-3">Set up your event</h4>
            <p className="text-[#9A9C8E] text-sm">Add details, dates, and ticket information.</p>
            <div className="hidden md:block absolute top-8 left-[65%] w-[70%] h-[2px] bg-gradient-to-r from-[#222820] to-transparent"></div>
          </div>
          <div>
            <div className="w-16 h-16 bg-[#222820] text-[#E8A020] rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">3</div>
            <h4 className="text-[#EDE8DF] font-bold mb-3">Share your link</h4>
            <p className="text-[#9A9C8E] text-sm">Use your unique URL to collect registrations.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
