'use client'
import Link from 'next/link'
import { ArrowLeft, Download, ShieldCheck, Palette, Type, Image as ImageIcon, ExternalLink, Zap, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function BrandAssetsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const colors = [
    { name: 'Emerald Primary', hex: '#E8A020', desc: 'Main brand accent for call-to-actions and highlights.' },
    { name: 'Deep Background', hex: '#0D0F0B', desc: 'Primary core background for the dark interface.' },
    { name: 'Emerald Secondary', hex: '#34C27A', desc: 'Used for success states, verification, and growth.' },
    { name: 'Terra Accents', hex: '#D88030', desc: 'Warm structural accents for gradient depth.' }
  ]

  return (
    <div className="min-h-screen bg-bg text-primary pt-32 pb-40 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald/5 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-emerald/5 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto max-w-7xl">
        <div className="max-w-4xl mb-24 space-y-8 animate-fade-up">
           <Link href="/" className="group inline-flex items-center gap-3 text-emerald text-[10px] font-black uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          <h4 className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] mb-4">Identity Standards</h4>
          <h1 className="font-serif text-6xl md:text-8xl font-black mb-8 tracking-tight leading-none">
            Brand <span className="text-emerald italic">Assets.</span>
          </h1>
          <p className="text-xl text-muted font-medium max-w-2xl leading-relaxed">
            Resources, tokens, and guidelines for representing the OppAlert nexus with absolute precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-40">
           {/* Logos */}
           <section className="space-y-12 animate-fade-up">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-1 bg-emerald/30 rounded-full" />
                 <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-muted flex items-center gap-3">
                   <ImageIcon size={18} className="text-emerald" /> Logo Variations
                 </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-16 rounded-[3rem] bg-surface/30 backdrop-blur-xl border border-border/60 flex flex-col items-center justify-center text-center group hover:bg-surface/50 transition-all duration-500 shadow-premium">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-emerald text-black flex items-center justify-center font-black text-4xl mb-10 shadow-glow-emerald group-hover:scale-110 transition-transform duration-500">
                       O
                    </div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-8">Primary Node Icon</p>
                    <button className="flex items-center gap-3 text-[10px] font-black text-emerald uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                       <Download size={14} /> Download PNG
                    </button>
                 </div>
                 <div className="p-16 rounded-[3rem] bg-surface/30 backdrop-blur-xl border border-border/60 flex flex-col items-center justify-center text-center group hover:bg-surface/50 transition-all duration-500 shadow-premium">
                    <div className="font-serif text-4xl font-black mb-10 tracking-tight text-primary">
                       Opp<span className="text-emerald italic">Alert</span>
                    </div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-8">Full Wordmark</p>
                    <button className="flex items-center gap-3 text-[10px] font-black text-emerald uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                       <Download size={14} /> Download SVG
                    </button>
                 </div>
              </div>
           </section>

           {/* Colors */}
           <section className="space-y-12 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-1 bg-emerald/30 rounded-full" />
                 <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-muted flex items-center gap-3">
                    <Palette size={18} className="text-emerald" /> Color Tokens
                 </h2>
              </div>
              <div className="space-y-6">
                 {colors.map((color, i) => (
                   <div key={i} className="group relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald/20 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />
                      <div className="bg-surface/30 backdrop-blur-xl border border-border/60 rounded-[2.5rem] p-8 flex items-center justify-between hover:bg-surface/50 transition-all duration-500 shadow-premium">
                         <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-2xl shadow-xl transition-transform group-hover:scale-110 border border-white/10" style={{ backgroundColor: color.hex }} />
                            <div>
                               <h4 className="font-serif text-xl font-bold text-primary">{color.name}</h4>
                               <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-1 italic">{color.hex}</p>
                            </div>
                         </div>
                         <button onClick={() => copyToClipboard(color.hex, color.hex)} className="w-12 h-12 bg-surface2 border border-border rounded-xl flex items-center justify-center text-muted hover:text-emerald transition-all shadow-xl active:scale-90">
                            {copied === color.hex ? <Check size={18} className="text-emerald" /> : <Copy size={18} />}
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        {/* Usage Integrity */}
        <div className="relative group animate-fade-up">
           <div className="absolute -inset-1 bg-gradient-to-r from-emerald/20 to-emerald/20 rounded-[4rem] blur-xl opacity-30" />
           <div className="relative p-20 md:p-32 rounded-[4rem] bg-surface/30 backdrop-blur-3xl border border-border/60 text-center overflow-hidden shadow-premium">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(232,160,32,0.02),transparent)] pointer-events-none" />
              
              <ShieldCheck size={64} className="text-emerald mx-auto mb-10 animate-pulse-soft" />
              <h2 className="font-serif text-5xl font-black text-primary mb-10 tracking-tight leading-none">Usage Integrity.</h2>
              <p className="text-xl text-muted font-medium max-w-2xl mx-auto leading-relaxed mb-16 opacity-80 italic">
                Our visual identity is a promise of verification. Maintain its precision using `Outfit` for headers and `Inter` for data vectors. Never modify aspect ratios or primary hex values.
              </p>
              
              <div className="flex flex-wrap justify-center gap-12">
                 {[
                   'Official Hub Badge',
                   'Brand Compliance Kit',
                   'Verification Tokens'
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 group/item">
                      <div className="w-8 h-8 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald group-hover/item:scale-110 transition-transform shadow-xl">
                        <Check size={16} />
                      </div>
                      <span className="text-[11px] font-black text-muted uppercase tracking-[0.3em]">{item}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
