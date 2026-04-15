import Link from 'next/link'
import { SearchX, ArrowRight, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6 text-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-emerald/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-md animate-fade-up">
        <div className="w-24 h-24 rounded-[2rem] bg-[var(--icon-bg)] border border-[var(--glass-border)] flex items-center justify-center mx-auto mb-8 shadow-inner rotate-12 group hover:rotate-0 transition-transform duration-500">
          <SearchX size={48} className="text-muted group-hover:text-emerald transition-colors" />
        </div>
        
        <h1 className="font-syne text-4xl font-black text-primary tracking-tighter mb-4">
          Lost in <span className="text-emerald">Space?</span>
        </h1>
        
        <p className="text-subtle text-lg font-medium leading-relaxed mb-10">
          The opportunity you&apos;re looking for might have expired or been moved to a new niche. Let&apos;s get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/opportunities">
            <button className="btn-primary px-8 py-4 rounded-2xl shadow-glow-emerald font-black uppercase tracking-widest text-xs flex items-center gap-2">
              Browse Listings
              <ArrowRight size={16} className="stroke-[3]" />
            </button>
          </Link>
          <Link href="/">
            <button className="btn-ghost px-8 py-4 rounded-2xl border-[var(--glass-border)] text-primary font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[var(--icon-bg)] transition-all">
              <Home size={16} />
              Return Home
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
