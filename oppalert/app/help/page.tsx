'use client'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MessageSquare, Search, ChevronDown, CheckCircle, HelpCircle, LifeBuoy } from 'lucide-react'
import { useState } from 'react'

export default function HelpPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: "How do I verify if an opportunity is real?",
      a: "OppFetch uses a multi-step verification process. We cross-reference official domain names, verify contact details of the organization, and check against known scam databases before listing any opportunity."
    },
    {
      q: "Is OppFetch free to use for students?",
      a: "Yes! Searching for opportunities, setting up alerts, and reading our career guides is 100% free for all users. We monetize through organic partnerships and featured organizer tools."
    },
    {
      q: "How can I post an event as an organizer?",
      a: "Simply click 'Post Listing' in the organizer hub. You can create a basic listing for free in minutes. We also offer 'Boost' and 'Premium' options for higher reach."
    },
    {
      q: "What countries do you support?",
      a: "We primary focus on 54 African countries, including Nigeria, Ghana, Kenya, South Africa, and Egypt. However, many opportunities listed are international fellowships open to all."
    }
  ]

  return (
    <div className="min-h-screen bg-[#080A07] text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
           <Link href="/" className="inline-flex items-center gap-2 text-amber text-xs font-black uppercase tracking-widest mb-8 hover:underline">
            <ArrowLeft size={14} /> Back to Hub
          </Link>
          <h1 className="font-syne text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            How can we <span className="text-amber">help?</span>
          </h1>
          <div className="relative max-w-xl mx-auto mt-12">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
             <input 
               type="text" 
               placeholder="Search help articles..."
               className="w-full bg-white/5 border border-white/5 rounded-3xl pl-16 pr-6 py-6 text-lg outline-none focus:border-amber/50 transition-all font-medium" 
             />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
           {/* FAQ Section */}
           <div className="space-y-6 animate-fade-up">
              <h2 className="text-2xl font-black uppercase tracking-widest text-white/40 mb-10">Frequently Asked Questions</h2>
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card rounded-3xl border border-white/5 overflow-hidden group">
                   <button 
                     onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                     className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                   >
                      <h3 className="font-bold text-lg">{faq.q}</h3>
                      <ChevronDown className={`text-amber transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} size={20} />
                   </button>
                   {activeFaq === i && (
                     <div className="px-8 pb-8 text-subtle leading-relaxed text-base animate-fade-down">
                        {faq.a}
                     </div>
                   )}
                </div>
              ))}
           </div>

           {/* Contact Sidebar */}
           <aside className="sticky top-32 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="p-10 rounded-[3rem] bg-bg2 border border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/5 blur-[80px] rounded-full" />
                 <h2 className="text-2xl font-black mb-8">Contact Support</h2>
                 <p className="text-sm text-subtle leading-relaxed mb-10">Our dedicated team is ready to assist you with any inquiries or technical issues.</p>
                 
                 <div className="space-y-8">
                    <a href="mailto:oppFetch@gmail.com" className="flex items-center gap-6 group">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                          <Mail size={22} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Email Us</p>
                          <p className="font-bold text-primary group-hover:text-amber transition-colors">oppFetch@gmail.com</p>
                       </div>
                    </a>
                    <a href="tel:+2348089895943" className="flex items-center gap-6 group">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald group-hover:scale-110 transition-transform">
                          <Phone size={22} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Call Support</p>
                          <p className="font-bold text-primary group-hover:text-emerald transition-colors">+234 808 989 5943</p>
                       </div>
                    </a>
                    <div className="flex items-center gap-6 group cursor-pointer">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                          <MessageSquare size={22} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Live Chat</p>
                          <p className="font-bold text-primary">Typical response &lt; 2h</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 pt-10 border-t border-white/5 text-center">
                    <div className="flex justify-center gap-3 mb-4">
                       <CheckCircle size={16} className="text-emerald" />
                       <span className="text-[10px] font-black text-muted uppercase tracking-widest">Verified Support Link</span>
                    </div>
                 </div>
              </div>
           </aside>
        </div>

        {/* Categories of Help */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-32">
           {[
             { title: 'Technical Guide', desc: 'Integration docs, API endpoints, and technical troubleshooting.', icon: LifeBuoy },
             { title: 'User Account', desc: 'Password reset, profile management, and notification settings.', icon: UserIcon },
             { title: 'Safety & Trust', desc: 'Reporting scams, verification badges, and privacy controls.', icon: ShieldIcon }
           ].map((category, i) => (
             <div key={i} className="p-8 rounded-[2rem] border border-white/5 hover:border-amber/20 transition-all cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-amber mb-8 group-hover:bg-amber group-hover:text-[#080A07] transition-all">
                   <category.icon size={28} />
                </div>
                <h3 className="text-xl font-black mb-4">{category.title}</h3>
                <p className="text-sm text-subtle leading-relaxed">{category.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function ShieldIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}
