'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2, Github, Globe } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })

        if (!res.ok) {
          const msg = await res.text()
          throw new Error(msg || 'Something went wrong')
        }
        
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        })

        if (result?.error) throw new Error(result.error)
        
        router.push('/dashboard')
        router.refresh()
      } else {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        })

        if (result?.error) throw new Error('Invalid email or password')

        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-amber/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-[480px] animate-fade-up">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <h2 className="font-syne text-4xl font-black text-[#F0EDE6] tracking-tighter transition-all group-hover:scale-105">
              Opp<span className="text-amber">Alert</span>
            </h2>
            <div className="h-1 w-0 group-hover:w-full bg-amber-gradient mx-auto transition-all duration-500 rounded-full" />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="glass-gradient border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-3xl -z-10" />
          
          <div className="mb-10 text-center">
            <h1 className="font-syne text-2xl font-black text-white mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create Account'}
            </h1>
            <p className="text-sm text-subtle font-medium">
              {mode === 'login' 
                ? 'Join 48,000+ others chasing excellence.' 
                : 'Your journey to a global career starts here.'}
            </p>
          </div>

          {/* Combined Tabs */}
          <div className="grid grid-cols-2 bg-white/5 border border-white/5 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setMode('login')}
              className={`py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-amber-gradient text-bg shadow-glow-amber' : 'text-muted-dark hover:text-white'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-amber-gradient text-bg shadow-glow-amber' : 'text-muted-dark hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-bold text-center animate-fade-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-dark ml-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-amber transition-colors" />
                  <input
                    type="text"
                    placeholder="Adewale Okafor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[#F0EDE6] text-sm focus:outline-none focus:border-amber/30 focus:ring-1 focus:ring-amber/10 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-dark ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-amber transition-colors" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[#F0EDE6] text-sm focus:outline-none focus:border-amber/30 focus:ring-1 focus:ring-amber/10 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-dark">Password</label>
                {mode === 'login' && (
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-amber hover:opacity-80">Forgot?</button>
                )}
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-amber transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-[#F0EDE6] text-sm focus:outline-none focus:border-amber/30 focus:ring-1 focus:ring-amber/10 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-5 rounded-2xl shadow-glow-amber text-bg font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Proceed to Dashboard' : 'Confirm & Create'}
                  <ArrowRight size={18} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Social Proof/Login Divider */}
          <div className="flex items-center gap-4 my-10">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-dark">Social Connect</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => signIn('google')}
              className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F0EDE6]">Google</span>
            </button>
            <button 
              onClick={() => signIn('github')}
              className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group"
            >
              <Github size={20} className="text-[#F0EDE6] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F0EDE6]">GitHub</span>
            </button>
          </div>
        </div>

        {/* Legal Text */}
        <p className="text-[10px] text-center text-muted-dark font-medium mt-10 max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
          By continuing, you agree to our <Link href="/terms" className="text-subtle hover:text-white transition-colors underline decoration-white/20 underline-offset-4">Terms</Link> & <Link href="/privacy" className="text-subtle hover:text-white transition-colors underline decoration-white/20 underline-offset-4">Privacy</Link>.
        </p>
      </div>
    </main>
  )
}
