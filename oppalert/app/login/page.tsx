'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Invalid email or password')
        return
      }
      document.cookie = `token=${data.token}; path=/; max-age=2592000; SameSite=Lax`
      localStorage.setItem('user', JSON.stringify({
        id: data.user?.id || '',
        email: data.user?.email || email,
        fullName: data.user?.fullName || 
                  data.user?.full_name || '',
        plan: data.user?.plan || 
              data.user?.status || 'free',
        token: data.token,
      }))
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        return
      }
      document.cookie = `token=${data.token}; path=/; max-age=2592000; SameSite=Lax`
      localStorage.setItem('user', JSON.stringify({
        id: data.user?.id || '',
        email: data.user?.email || email,
        fullName: data.user?.fullName || 
                  data.user?.full_name || fullName,
        plan: data.user?.plan || 
              data.user?.status || 'free',
        token: data.token,
      }))
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-bg">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <ScrollReveal>
        <div className="w-full max-w-[440px] bg-surface/30 border border-border/60 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/5 blur-3xl -z-10" />
          
          <Link href="/" className="block text-center mb-10 transition-transform active:scale-95">
             <div className="font-serif text-2xl font-bold tracking-tight">
               Opp<span className="text-emerald italic">Alert</span>
             </div>
          </Link>

          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl font-bold text-primary mb-3">
              {tab === 'login' ? 'Welcome back' : 'Create Account'}
            </h1>
            <p className="text-muted text-sm leading-relaxed opacity-70">
              {tab === 'login'
                ? 'Continue your journey to a global career.'
                : 'Join the next generation of global talent.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-surface2 rounded-2xl p-1.5 mb-8 border border-border/50">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  tab === t 
                  ? 'bg-surface text-emerald border border-emerald/20 shadow-lg' 
                  : 'text-muted hover:text-primary'
                }`}
              >
                {t === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-xs font-medium mb-6 flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center">!</div>
              {error}
            </div>
          )}

          <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {tab === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-surface2 border border-border rounded-2xl text-primary text-sm focus:border-emerald/50 outline-none transition-all placeholder:text-muted/30 font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-surface2 border border-border rounded-2xl text-primary text-sm focus:border-emerald/50 outline-none transition-all placeholder:text-muted/30 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-surface2 border border-border rounded-2xl text-primary text-sm focus:border-emerald/50 outline-none transition-all placeholder:text-muted/30 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-emerald text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald/10 disabled:opacity-50 disabled:cursor-not-allowed group mt-8"
            >
              {loading
                ? 'Processing...' 
                : (
                  <span className="flex items-center justify-center gap-2">
                    {tab === 'login' ? 'Proceed to Dashboard' : 'Create My Account'}
                    <ArrowRight size={16} />
                  </span>
                )}
            </button>
          </form>

          <p className="text-center text-[10px] text-muted/50 mt-10 font-bold uppercase tracking-widest leading-relaxed">
            By continuing, you participate in our<br />
            <Link href="/terms" className="text-muted hover:text-emerald underline decoration-emerald/30">Terms of Service</Link> & <Link href="/privacy" className="text-muted hover:text-emerald underline decoration-emerald/30">Privacy Policy</Link>
          </p>
        </div>
      </ScrollReveal>
    </main>
  )
}
