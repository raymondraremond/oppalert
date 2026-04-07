'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, FileText, FileSearch, Copy, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AICareerAssistantProps {
  opportunityId: string
  oppTitle: string
}

export default function AICareerAssistant({ opportunityId, oppTitle }: AICareerAssistantProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<{ type: string; content: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (type: 'resume' | 'cover_letter') => {
    setLoading(type)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/ai/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, opportunityId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to generate content')
      }

      setResult({ type, content: data.content })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  const copyToClipboard = () => {
    if (!result) return
    navigator.clipboard.writeText(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-surface/30 border border-border rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[80px] -z-10 group-hover:scale-110 transition-transform duration-700" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center text-amber shadow-inner animate-pulse-soft">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="font-syne text-2xl font-bold text-primary italic">AI Career Assistant</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber">Premium Alpha Feature</p>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed mb-10 max-w-md">
        Optimize your application with AI. Generate a tailored resume summary or cover letter based on this listing and your profile.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => handleGenerate('resume')}
          disabled={!!loading}
          className="flex items-center justify-center gap-3 p-5 rounded-[1.5rem] bg-surface2 border border-border hover:border-amber/40 hover:bg-surface transition-all group/btn disabled:opacity-50"
        >
          {loading === 'resume' ? (
            <div className="w-5 h-5 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
          ) : (
            <FileText size={20} className="text-amber group-hover/btn:scale-110 transition-transform" />
          )}
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Tailor Resume</span>
        </button>

        <button
          onClick={() => handleGenerate('cover_letter')}
          disabled={!!loading}
          className="flex items-center justify-center gap-3 p-5 rounded-[1.5rem] bg-surface2 border border-border hover:border-amber/40 hover:bg-surface transition-all group/btn disabled:opacity-50"
        >
          {loading === 'cover_letter' ? (
            <div className="w-5 h-5 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
          ) : (
            <FileSearch size={20} className="text-amber group-hover/btn:scale-110 transition-transform" />
          )}
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Cover Letter</span>
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 mb-6"
          >
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="text-xs font-medium text-red-500 leading-relaxed">
              {error}
              {error.includes('complete your profile') && (
                <Link href="/dashboard" className="block mt-2 underline font-bold">Update Profile →</Link>
              )}
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={copyToClipboard}
                className="p-2.5 bg-bg/80 backdrop-blur-md border border-border rounded-xl text-primary hover:text-amber transition-colors shadow-lg"
              >
                {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
              </button>
            </div>
            
            <div className="bg-bg/50 border border-border rounded-[2rem] p-8 max-h-[400px] overflow-y-auto scrollbar-hide relative group/result">
              <div className="absolute inset-0 bg-amber/5 opacity-0 group-hover/result:opacity-100 transition-opacity pointer-events-none" />
              <pre className="text-sm text-primary/90 whitespace-pre-wrap font-mono leading-relaxed">
                {result.content}
              </pre>
            </div>
            <p className="text-[10px] text-muted font-bold mt-4 text-center uppercase tracking-widest opacity-60">
              Drafted by AI based on your profile
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
