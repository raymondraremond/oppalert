'use client'
import Link from 'next/link'
import { ArrowLeft, Download, ShieldCheck, Palette, Type, Image, ExternalLink, Zap, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function BrandAssetsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const colors = [
    { name: 'Amber Primary', hex: '#E8A020', desc: 'Main brand accent for call-to-actions.' },
    { name: 'Deep Background', hex: '#080A07', desc: 'Primary background for dark mode.' },
    { name: 'Emerald Secondary', hex: '#34C27A', desc: 'Used for success states and growth indicators.' }
  ]

  return (
    <div className="min-h-screen bg-[#080A07] text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16 animate-fade-up">
           <Link href="/" className="inline-flex items-center gap-2 text-amber text-xs font-black uppercase tracking-widest mb-8 hover:underline">
            <ArrowLeft size={14} /> Back to Hub
          </Link>
          <h1 className="font-syne text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Brand <span className="text-amber">Assets.</span>
          </h1>
          <p className="text-xl text-subtle leading-relaxed">
            Resources and guidelines for representing the OppFetch brand professionally.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
           {/* Logos */}
           <section className="animate-fade-up">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                 <Image size={24} className="text-amber" /> Logo Variations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-12 rounded-[2rem] bg-bg2 border border-white/5 flex flex-col items-center justify-center text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-amber-gradient flex items-center justify-center text-[#080A07] font-black text-2xl mb-6 shadow-glow-amber group-hover:scale-110 transition-transform">
                       O
                    </div>
                    <img src="/logo-icon.png" alt="OppFetch Icon" className="hidden" />
                    <p className="text-xs font-bold text-muted uppercase tracking-widest mb-6">Primary Icon</p>
                    <button className="flex items-center gap-2 text-[10px] font-black text-amber uppercase tracking-widest hover:underline">
                       <Download size={14} /> Download PNG
                    </button>
                 </div>
                 <div className="p-12 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center group">
                    <div className="font-syne text-3xl font-black mb-6 tracking-tighter">
                       Opp<span className="text-amber">Fetch</span>
                    </div>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest mb-6">Full Wordmark</p>
                    <button className="flex items-center gap-2 text-[10px] font-black text-amber uppercase tracking-widest hover:underline">
                       <Download size={14} /> Download SVG
                    </button>
                 </div>
              </div>
           </section>

           {/* Colors */}
           <section className="animate-fade-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                 <Palette size={24} className="text-amber" /> Color Palette
              </h2>
              <div className="space-y-4">
                 {colors.map((color, i) => (
                   <div key={i} className="glass-card border border-white/5 rounded-2xl p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: color.hex }} />
                         <div>
                            <h4 className="font-bold">{color.name}</h4>
                            <p className="text-[10px] text-muted uppercase tracking-widest mt-1">{color.hex}</p>
                         </div>
                      </div>
                      <button onClick={() => copyToClipboard(color.hex, color.hex)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                         {copied === color.hex ? <Check size={16} className="text-emerald" /> : <Copy size={16} className="text-white/20" />}
                      </button>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        {/* Guidelines */}
        <div className="p-16 rounded-[4rem] bg-bg2 border border-white/5 relative overflow-hidden animate-fade-in">
           <div className="absolute top-0 left-0 w-64 h-64 bg-amber/5 blur-[100px] rounded-full" />
           <div className="max-w-2xl mx-auto text-center">
              <ShieldCheck size={48} className="text-amber mx-auto mb-8" />
              <h2 className="font-syne text-4xl font-black mb-6 tracking-tight">Usage Guidelines</h2>
                 <p className="text-subtle mb-10 leading-relaxed text-lg">
                    Please do not modify the logo colors, aspect ratio, or typography. Use the &quot;Syne&quot; font for headers and &quot;Inter&quot; for body text to maintain platform consistency.
                 </p>
              <div className="flex flex-wrap justify-center gap-8">
                 <div className="flex items-center gap-3">
                    <Check className="text-emerald" size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">Official Partner Badge</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Check className="text-emerald" size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">Brand Compliance kit</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
