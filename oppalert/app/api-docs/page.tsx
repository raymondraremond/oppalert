'use client'
import Link from 'next/link'
import { ArrowLeft, Code2, Terminal, Cpu, Key, FileJson, Share2, Copy, Check, Zap } from 'lucide-react'
import { useState } from 'react'

export default function ApiDocsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const endpoints = [
    { method: 'GET', path: '/api/opportunities', desc: 'List all verified opportunities with filters.' },
    { method: 'GET', path: '/api/events', desc: 'Retrieve upcoming events and workshops.' },
    { method: 'POST', path: '/api/newsletter', desc: 'Subscribe a new email to the newsletter.' }
  ]

  return (
    <div className="min-h-screen bg-[#080A07] text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16 animate-fade-up">
           <Link href="/" className="inline-flex items-center gap-2 text-amber text-xs font-black uppercase tracking-widest mb-8 hover:underline">
            <ArrowLeft size={14} /> Back to Hub
          </Link>
          <h1 className="font-syne text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            API <span className="text-amber">Reference.</span>
          </h1>
          <p className="text-xl text-subtle leading-relaxed">
            Build high-impact tools on top of Africa&apos;s most verified opportunity data engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
           <div className="space-y-12 animate-fade-up">
              <section>
                 <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                   <Terminal size={24} className="text-amber" /> Authentication
                 </h2>
                 <p className="text-subtle mb-6 leading-relaxed">Most public endpoints are accessible without a key. However, for high-frequency access or private data, you must include your API Key in the request header.</p>
                 <div className="bg-[#141710] border border-white/5 rounded-2xl p-6 font-mono text-sm group relative">
                    <span className="text-emerald">Authorization:</span> <span className="text-amber">Bearer</span> YOUR_API_KEY
                    <button onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                       {copied === 'auth' ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                    </button>
                 </div>
              </section>

              <section>
                 <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                   <Cpu size={24} className="text-amber" /> Core Endpoints
                 </h2>
                 <div className="space-y-4">
                    {endpoints.map((ep, i) => (
                      <div key={i} className="glass-card border border-white/5 rounded-2xl overflow-hidden hover:border-amber/20 transition-all group">
                         <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                            <div className="flex items-center gap-4">
                               <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${ep.method === 'GET' ? 'bg-emerald/10 text-emerald' : 'bg-amber/10 text-amber'}`}>{ep.method}</span>
                               <code className="text-xs font-bold text-primary">{ep.path}</code>
                            </div>
                            <Share2 size={14} className="text-white/20" />
                         </div>
                         <div className="px-6 py-4 text-sm text-subtle">
                            {ep.desc}
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              <section>
                 <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                   <FileJson size={24} className="text-amber" /> Sample Response
                 </h2>
                 <div className="bg-[#141710] border border-white/5 rounded-[2rem] p-8 font-mono text-xs leading-relaxed text-subtle overflow-x-auto">
                    <pre>{`{
  "status": "success",
  "data": {
    "id": "opp_7x2y9z",
    "title": "Google Africa PhD Fellowship",
    "category": "Fellowship",
    "deadline": "2024-12-31",
    "verified": true
  }
}`}</pre>
                 </div>
              </section>
           </div>

           <aside className="space-y-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="p-8 rounded-[2.5rem] bg-bg2 border border-white/5">
                 <div className="w-12 h-12 rounded-2xl bg-amber-gradient flex items-center justify-center text-[#080A07] mb-6 shadow-glow-amber">
                    <Key size={22} />
                 </div>
                 <h3 className="text-xl font-black mb-4">Request Access</h3>
                 <p className="text-xs text-subtle leading-relaxed mb-6">Developers can apply for high-rate API keys for research and non-profit integration.</p>
                 <Link href="/contact" className="w-full inline-flex items-center justify-center bg-white/5 border border-white/10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-amber/50 transition-all">
                    Apply for Key
                 </Link>
              </div>

              <div className="p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-[60px] rounded-full" />
                 <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Rate Limits</h4>
                 <div className="flex items-center gap-4 mb-2">
                    <Zap size={16} className="text-amber" />
                    <span className="text-sm font-bold">100 req/min</span>
                 </div>
                 <p className="text-[10px] text-muted italic">Standard public tier</p>
              </div>
           </aside>
        </div>
      </div>
    </div>
  )
}
