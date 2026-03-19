'use client'
import { Bell } from 'lucide-react'
import NewsletterForm from './NewsletterForm'

export default function NewsletterSection() {
  return (
    <section id="newsletter" className="py-32 px-6">
      <div className="max-w-4xl mx-auto rounded-[3rem] p-12 md:p-20 relative overflow-hidden group" style={{backgroundColor: 'var(--icon-bg)', border: '1px solid var(--border)'}}>
        <div className="absolute top-0 right-0 w-80 h-80 blur-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000" style={{backgroundColor: 'rgba(232, 160, 32, 0.08)'}} />
        <div className="absolute bottom-0 left-0 w-80 h-80 blur-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000" style={{backgroundColor: 'var(--icon-bg)'}} />
        
        <div className="text-center max-w-xl mx-auto relative z-10">
          <div className="w-20 h-20 rounded-[2rem] bg-amber-gradient text-bg flex items-center justify-center mx-auto mb-10 shadow-glow-amber animate-pulse">
            <Bell size={36} className="stroke-[2.5]" />
          </div>
          <h2 className="font-syne text-4xl md:text-5xl font-black mb-6 text-primary">
            Weekly alerts, <span className="text-amber">zero noise.</span>
          </h2>
          <p className="text-subtle text-lg font-medium mb-12">
            Join 48,000+ African students and graduates. Get the opportunities you actually want, delivered to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
