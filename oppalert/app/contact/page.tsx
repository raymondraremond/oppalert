'use client'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Globe, ArrowRight } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
          <h1 className="font-syne text-5xl md:text-7xl font-black tracking-tighter mb-6 text-primary">
            Get in <span className="text-amber-gradient drop-shadow-glow-amber">Touch</span>
          </h1>
          <p className="text-subtle text-lg font-medium leading-relaxed">
            Have questions about a listing? Want to partner with us? Our team is ready to help you navigate your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Side */}
          <div className="space-y-8 animate-fade-up animate-delay-100">
            <div className="glass-gradient border border-[var(--border)] rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-3xl -z-10" />
              
              <h2 className="font-syne text-3xl font-black text-primary">Contact Information</h2>
              
              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@OppFetch.com', sub: 'Response within 24 hours' },
                  { icon: Phone, label: 'Phone', value: '+234 810 000 0000', sub: 'Mon-Fri, 9am - 5pm WAT' },
                  { icon: MapPin, label: 'Headquarters', value: 'Lagos, Nigeria', sub: 'Remote-first globally' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 group/item">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--icon-bg)] border border-[var(--glass-border)] flex items-center justify-center text-amber group-hover/item:scale-110 transition-transform shadow-inner">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-primary mb-1">{item.value}</p>
                      <p className="text-xs text-subtle font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-[var(--border)]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-6">Our Global Reach</p>
                <div className="flex gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-[var(--icon-bg)] border border-[var(--border)] flex items-center justify-center grayscale opacity-40">
                      <Globe size={18} />
                    </div>
                  ))}
                  <div className="flex -space-x-3 items-center ml-auto">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-bg bg-amber/20" />
                    ))}
                    <span className="text-[10px] font-black text-amber ml-4">+48k Members</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 group overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                   <MessageSquare size={24} className="fill-current" />
                 </div>
                 <h3 className="font-syne text-xl font-black text-primary">Live Support</h3>
              </div>
              <p className="text-sm text-subtle font-medium mb-6">Partnering organizations get access to a dedicated account manager and 24/7 priority support.</p>
              <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                Learn about Partnerships <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Form Side */}
          <div className="animate-fade-up animate-delay-200">
            <div className="glass-gradient border border-[var(--glass-border)] rounded-[3rem] p-10 md:p-14 shadow-premium relative">
              {submitted ? (
                <div className="text-center py-20 animate-fade-up">
                  <div className="w-20 h-20 rounded-[2rem] bg-success/10 text-success flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle size={40} className="stroke-[3]" />
                  </div>
                  <h2 className="font-syne text-3xl font-black text-primary mb-4">Message Received</h2>
                  <p className="text-subtle font-medium">We appreciate you reaching out. A member of our team will contact you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-10 text-amber font-black uppercase tracking-widest text-xs hover:underline decoration-amber/30 underline-offset-8">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="font-syne text-3xl font-black text-primary mb-8">Send a Message</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Full Name</label>
                      <input required className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="Adewale Okafor" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Email Address</label>
                      <input required type="email" className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all" placeholder="adewale@mail.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Subject</label>
                    <select className="w-full bg-[#1A1F15] border border-[var(--glass-border)] rounded-2xl p-4 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all cursor-pointer appearance-none">
                      <option>General Inquiry</option>
                      <option>Partnership & Advertising</option>
                      <option>Technical Support</option>
                      <option>Report an Opportunity</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Your Message</label>
                    <textarea required className="w-full bg-[var(--icon-bg)] border border-[var(--glass-border)] rounded-3xl p-6 text-sm font-bold text-primary focus:outline-none focus:border-amber/30 transition-all h-40 resize-none" placeholder="How can we help you?" />
                  </div>

                  <button className="btn-primary w-full py-5 rounded-2xl shadow-glow-amber text-bg font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Initialize Transmission
                    <Send size={18} className="stroke-[2.5]" />
                  </button>
                  
                  <p className="text-[10px] text-center text-muted font-medium leading-relaxed uppercase tracking-widest mt-6">
                    Response time usually &lt; 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
