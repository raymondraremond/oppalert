import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export default function PremiumBanner() {
  return (
    <div className="relative overflow-hidden glass-gradient border border-amber/20 rounded-2xl p-6 mb-8 group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber/10 blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-gradient text-bg flex items-center justify-center shrink-0 shadow-glow-amber group-hover:rotate-3 transition-transform">
            <Zap size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-syne text-lg font-black text-amber uppercase tracking-wider mb-1">
              Unlock Elite Opportunities
            </h3>
            <p className="text-sm text-subtle font-medium leading-relaxed max-w-xl">
              Get <span className="text-white font-bold">instant Telegram & Email alerts</span>. 
              Be the first to apply to scholarships and remote jobs before they go viral.
            </p>
          </div>
        </div>
        
        <Link href="/pricing" className="shrink-0 w-full md:w-auto">
          <button className="btn-primary w-full py-3.5 px-8 text-sm font-black uppercase tracking-widest rounded-xl shadow-glow-amber hover:scale-[1.02] active:scale-[0.98] transition-all">
            Upgrade for ₦1,500
            <ArrowRight size={16} className="ml-2 stroke-[3]" />
          </button>
        </Link>
      </div>
    </div>
  )
}
