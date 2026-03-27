'use client'
import Link from 'next/link'
import { ArrowLeft, Code2, Terminal, Cpu, Key, FileJson, Share2, Copy, Check, Zap, Braces } from 'lucide-react'
import { useState } from 'react'

export default function ApiDocsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const endpoints = [
    { method: 'GET', path: '/api/opportunities', desc: 'Query the global index of verified African opportunity clusters with advanced filtering.' },
    { method: 'GET', path: '/api/events', desc: 'Retrieve upcoming elite workshops, bootcamps, and networking summits.' },
    { method: 'POST', path: '/api/newsletter', desc: 'Securely register a new node for the weekly intelligence digest.' }
  ]

  return (
    <div className="min-h-screen bg-bg text-primary pt-32 pb-40 px-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber/5 blur-[150px] rounded-full -z-10 animate-pulse-soft" />
      <div className="absolute bottom-1/4 left-[-10%] w-[500px] h-[500px] bg-emerald/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto max-w-7xl">
        <div className="max-w-4xl mb-24 space-y-8 animate-fade-up">
           <Link href="/" className="group inline-flex items-center gap-3 text-amber text-[10px] font-black uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          <h4 className="text-[10px] font-black text-amber uppercase tracking-[0.4em] mb-4">Developer Interface</h4>
          <h1 className="font-serif text-6xl md:text-8xl font-black mb-8 tracking-tight leading-none">
            API <span className="text-amber italic">Engine.</span>
          </h1>
          <p className="text-xl text-muted font-medium max-w-2xl leading-relaxed">
            Architect high-impact tools and interfaces on top of Africa&apos;s most verified opportunity data cluster. Secure. Scalable. Essential.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-20 items-start">
           <div className="space-y-20 animate-fade-up">
              
              {/* Authentication */}
              <section className="space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-1 bg-amber/30 rounded-full" />
                    <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-muted flex items-center gap-3">
                      <Terminal size={18} className="text-amber" /> Authentication Protocol
                    </h2>
                 </div>
                 <p className="text-muted text-lg font-medium leading-relaxed opacity-90">Public discovery endpoints are accessible without restricted tokens. For high-frequency neural access or private data streams, include your signed terminal key in the header.</p>
                 <div className="bg-surface/30 backdrop-blur-xl border border-border/60 rounded-[2rem] p-10 font-mono text-sm group relative shadow-premium overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-[60px] opacity-40" />
                    <div className="flex items-center gap-4 relative z-10">
                       <span className="text-emerald/80 font-black">Authorization:</span> 
                       <span className="text-amber">Bearer</span> 
                       <span className="text-primary font-bold tracking-widest opacity-40">NEXUS_SIG_XXXX_TERMINAL</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')} 
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-surface2 border border-border rounded-2xl text-muted hover:text-amber transition-all shadow-xl active:scale-90"
                    >
                       {copied === 'auth' ? <Check size={18} className="text-emerald" /> : <Copy size={18} />}
                    </button>
                 </div>
              </section>

              {/* Endpoints */}
              <section className="space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-1 bg-amber/30 rounded-full" />
                    <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-muted flex items-center gap-3">
                      <Cpu size={18} className="text-amber" /> Direct Data Nodes
                    </h2>
                 </div>
                 <div className="space-y-6">
                    {endpoints.map((ep, i) => (
                      <div key={i} className="group relative">
                         <div className="absolute -inset-0.5 bg-gradient-to-r from-amber/20 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />
                         <div className="bg-surface/30 backdrop-blur-xl border border-border/60 rounded-[2rem] overflow-hidden transition-all duration-500 hover:bg-surface/50 group/item">
                            <div className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                               <div className="flex items-center gap-6">
                                  <span className={`text-[9px] font-black px-4 py-1.5 rounded-full shadow-inner ${ep.method === 'GET' ? 'bg-emerald/10 text-emerald border border-emerald/20' : 'bg-amber/10 text-amber border border-amber/20'}`}>
                                    {ep.method}
                                  </span>
                                  <code className="text-[13px] font-black text-primary font-mono opacity-80 group-hover/item:text-amber transition-colors">{ep.path}</code>
                               </div>
                               <Braces size={16} className="text-muted opacity-20 group-hover/item:opacity-60 transition-opacity" />
                            </div>
                            <div className="px-8 py-6 text-[15px] text-muted font-medium opacity-80 italic">
                               {ep.desc}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              {/* Sample Response */}
              <section className="space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-1 bg-amber/30 rounded-full" />
                    <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-muted flex items-center gap-3">
                      <FileJson size={18} className="text-amber" /> Response Architecture
                    </h2>
                 </div>
                 <div className="bg-surface/30 backdrop-blur-xl border border-border/60 rounded-[2.5rem] p-10 font-mono text-[13px] leading-relaxed text-muted relative overflow-hidden shadow-premium">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald/5 blur-[80px]" />
                    <pre className="relative z-10"><code className="language-json">{`{
  "status": "success",
  "data": {
    "id": "opp_7x2y9z_cluster",
    "title": "Google Africa Research Initiative",
    "category": "Fellowship",
    "deadline": "2025-01-24",
    "verified": true,
    "sig_token": "verified_nexus_cluster"
  }
}`}</code></pre>
                 </div>
              </section>
           </div>

           {/* Sidebar */}
           <aside className="sticky top-32 space-y-10 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <div className="p-12 rounded-[3.5rem] bg-surface/30 backdrop-blur-3xl border border-border/50 relative overflow-hidden shadow-premium">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-[80px] rounded-full animate-pulse-soft" />
                 <div className="w-16 h-16 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber mb-10 shadow-glow-amber">
                    <Key size={32} />
                 </div>
                 <h3 className="font-serif text-3xl font-bold text-primary mb-6 leading-none">Access Keys.</h3>
                 <p className="text-sm text-muted font-medium leading-relaxed mb-10 opacity-80">Elite developers and research institutions can apply for persistent high-rate terminal keys for global data synchronization.</p>
                 <Link href="/contact" className="w-full flex items-center justify-center bg-amber text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-amber/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Initiate API Request
                 </Link>
              </div>

              <div className="p-10 rounded-[3rem] bg-surface/30 backdrop-blur-3xl border border-border/50 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-[60px] rounded-full" />
                 <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-8">Node Limits</h4>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <Zap size={20} className="text-amber" />
                          <span className="text-sm font-black text-primary uppercase tracking-widest">Global Tier</span>
                       </div>
                       <span className="text-xs font-mono font-black text-amber">100/m</span>
                    </div>
                    <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                       <div className="h-full bg-amber/40 w-1/4 rounded-full" />
                    </div>
                    <p className="text-[10px] text-muted italic font-medium opacity-60">Automatic reset every 60 seconds.</p>
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </div>
  )
}
