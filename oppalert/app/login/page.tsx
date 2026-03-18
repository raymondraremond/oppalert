'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'

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
      const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login'
      const body = mode === 'signup'
        ? { email, password, fullName: name }
        : { email, password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Store token and user in localStorage for Navbar
      localStorage.setItem('oppalert_token', data.token)
      localStorage.setItem('oppalert_user', JSON.stringify(data.user))

      // Notify Navbar
      window.dispatchEvent(new Event('oppalert_auth'))

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-amber/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-[480px] animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <h2 className="font-syne text-4xl font-black text-primary tracking-tighter transition-all group-hover:scale-105">
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

          {/* Tabs */}
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
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-primary text-sm focus:outline-none focus:border-amber/30 focus:ring-1 focus:ring-amber/10 transition-all font-medium"
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
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-primary text-sm focus:outline-none focus:border-amber/30 focus:ring-1 focus:ring-amber/10 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-dark">Password</label>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-amber transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-primary text-sm focus:outline-none focus:border-amber/30 focus:ring-1 focus:ring-amber/10 transition-all font-medium"
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
                  {mode === 'login' ? 'Proceed to Dashboard' : 'Create My Account'}
                  <ArrowRight size={18} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-[10px] text-center text-muted-dark font-medium mt-10 max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
          By continuing, you agree to our <Link href="/terms" className="text-subtle hover:text-white transition-colors underline decoration-white/20 underline-offset-4">Terms</Link> &amp; <Link href="/privacy" className="text-subtle hover:text-white transition-colors underline decoration-white/20 underline-offset-4">Privacy</Link>.
        </p>
      </div>
    </main>
  )
}
