'use client'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MessageSquare, Search, ChevronDown, CheckCircle, HelpCircle, LifeBuoy, Zap } from 'lucide-react'
import { useState } from 'react'

export default function HelpPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: "How do I verify if an opportunity is real?",
      a: "OppAlert uses a multi-step verification process. We cross-reference official domain names, verify contact details of the organization, and check against known scam databases before listing any opportunity."
    },
    {
      q: "Is OppAlert free to use for students?",
      a: "Yes! Searching for opportunities, setting up alerts, and reading our career guides is 100% free for all users. We monetize through elite partnerships and featured advisor tools."
    },
    {
      q: "How can I post an event as an organizer?",
      a: "Simply click 'Index Opportunity' in the organizer hub. You can create a base listing for free in minutes. We also offer 'Boost' and 'Elite' options for maximum visibility."
    },
    {
      q: "What countries do you support?",
      a: "Our focus is on 54 African countries, including Nigeria, Ghana, Kenya, and Egypt. However, many indexed listings are international fellowships open to the global African diaspora."
    }
  ]

  return (
    <div className="min-h-screen bg-bg text-primary pt-32 pb-32 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald/5 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-emerald/5 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-24 space-y-8 animate-fade-up">
           <Link href="/" className="group inline-flex items-center gap-3 text-emerald text-[10px] font-black uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          <h4 className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] mb-4">Support Center</h4>
          <h1 className="font-serif text-6xl md:text-8xl font-black mb-8 tracking-tight leading-none">
            How can we <span className="text-emerald italic">assist?</span>
          </h1>
          <div className="relative max-w-2xl mx-auto mt-12 group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald transition-colors" size={24} />
             <input 
               type="text" 
               placeholder="Search our knowledge base..."
               className="w-full bg-surface/30 border border-border/80 rounded-[2.5rem] pl-16 pr-8 py-7 text-lg outline-none focus:border-emerald/50 transition-all font-bold shadow-2xl shadow-black/20" 
             />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 items-start">
           {/* FAQ Section */}
           <div className="space-y-8 animate-fade-up">
              <div className="flex items-center gap-4 mb-12">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
                 <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-muted">Core Intelligence FAQ</h2>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="group relative">
                     <div className={`absolute -inset-0.5 bg-gradient-to-r from-emerald/20 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10 ${activeFaq === i ? 'opacity-100' : ''}`} />
                     <div className={`bg-surface/30 backdrop-blur-xl rounded-[2rem] border border-border/60 overflow-hidden transition-all duration-500 ${activeFaq === i ? 'bg-surface/50 border-emerald/30' : ''}`}>
                        <button 
                          onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                          className="w-full px-10 py-8 flex items-center justify-between text-left transition-colors"
                        >
                           <h3 className="font-bold text-xl md:text-2xl transition-colors group-hover:text-emerald">{faq.q}</h3>
                           <div className={`w-10 h-10 rounded-full bg-surface2 border border-border flex items-center justify-center text-emerald transition-transform duration-500 ${activeFaq === i ? 'rotate-180 bg-emerald text-black border-emerald' : ''}`}>
                              <ChevronDown size={20} />
                           </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                           <div className="px-10 pb-10 text-muted leading-relaxed text-lg font-medium italic opacity-80 border-t border-border/20 pt-8">
                              {faq.a}
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Contact Sidebar */}
           <aside className="sticky top-32 animate-fade-up">
              <div className="p-12 rounded-[4rem] bg-surface/30 backdrop-blur-3xl border border-border/50 relative overflow-hidden shadow-premium">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/5 blur-[80px] rounded-full" />
                 <h2 className="font-serif text-3xl font-bold mb-8">Direct Access.</h2>
                 <p className="text-sm text-muted leading-relaxed mb-12 font-medium">Our tactical response team is on standby for high-priority inquiries.</p>
                 
                 <div className="space-y-10">
                    <a href="mailto:hello@oppalert.com" className="flex items-center gap-6 group">
                       <div className="w-14 h-14 rounded-2xl bg-surface/80 border border-border flex items-center justify-center text-emerald group-hover:bg-emerald group-hover:text-black transition-all shadow-xl">
                          <Mail size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Email Terminal</p>
                          <p className="font-bold text-lg text-primary group-hover:text-emerald transition-colors">hello@oppalert.com</p>
                       </div>
                    </a>
                    <a href="tel:+2348089895943" className="flex items-center gap-6 group">
                       <div className="w-14 h-14 rounded-2xl bg-surface/80 border border-border flex items-center justify-center text-emerald group-hover:bg-emerald group-hover:text-black transition-all shadow-xl">
                          <Phone size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Direct Line</p>
                          <p className="font-bold text-lg text-primary group-hover:text-emerald transition-colors">+234 808 989 5943</p>
                       </div>
                    </a>
                    <div className="flex items-center gap-6 group cursor-pointer">
                       <div className="w-14 h-14 rounded-2xl bg-surface/80 border border-border flex items-center justify-center text-emerald group-hover:scale-110 transition-transform shadow-xl">
                          <MessageSquare size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Live Interface</p>
                          <p className="font-bold text-lg text-primary">Est. response &lt; 2h</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-16 pt-12 border-t border-border/40 text-center">
                    <div className="flex justify-center items-center gap-3">
                       <CheckCircle size={18} className="text-emerald" />
                       <span className="text-[11px] font-black text-muted uppercase tracking-[0.3em]">Verified Support Link</span>
                    </div>
                 </div>
              </div>
           </aside>
        </div>

        {/* Global Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-40">
           {[
             { title: 'Technical Archives', desc: 'Integration protocols, API endpoints, and technical troubleshooting data.', icon: LifeBuoy, color: 'emerald' },
             { title: 'Entity Profile', desc: 'Credential reset, security management, and notification clusters.', icon: HelpCircle, color: 'emerald' },
             { title: 'Safety Protocol', desc: 'Submission screening, verification tokens, and privacy overrides.', icon: Zap, color: 'emerald' }
           ].map((category, i) => (
             <div key={i} className="p-10 rounded-[3rem] bg-surface/30 border border-border/50 hover:border-emerald/30 transition-all cursor-pointer group hover:bg-surface/50">
                <div className={`w-16 h-16 rounded-2xl bg-${category.color}/10 border border-${category.color}/20 flex items-center justify-center text-${category.color} mb-10 group-hover:scale-110 transition-transform shadow-xl`}>
                   <category.icon size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4">{category.title}</h3>
                <p className="text-sm text-muted leading-relaxed font-medium">{category.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
