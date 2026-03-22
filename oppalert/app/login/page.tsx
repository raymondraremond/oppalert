'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: '#080A07',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#141710',
        border: '1px solid #252D22',
        borderRadius: 20,
        padding: '2.5rem 2rem',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            textAlign: 'center',
            fontFamily: 'Syne, sans-serif',
            fontSize: 20, fontWeight: 800,
            marginBottom: 8,
          }}>
            Opp<span style={{ color: '#E8A020' }}>Alert</span>
          </div>
        </Link>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 22, fontWeight: 800,
          textAlign: 'center', marginBottom: 6,
        }}>
          {tab === 'login' ? 'Welcome back' : 'Create Account'}
        </h1>
        <p style={{
          textAlign: 'center', fontSize: 13,
          color: '#555C50', marginBottom: 24,
        }}>
          {tab === 'login'
            ? 'Join 48,000+ others chasing excellence.'
            : 'Your journey to a global career starts here.'}
        </p>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: '#1C2119',
          borderRadius: 10, padding: 4, marginBottom: 24,
        }}>
          {(['login', 'register'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              style={{
                flex: 1, padding: '8px',
                background: tab === t ? '#2A1E06' : 'transparent',
                border: tab === t
                  ? '1px solid rgba(232,160,32,0.3)'
                  : '1px solid transparent',
                borderRadius: 8,
                fontSize: 13, fontWeight: 600,
                color: tab === t ? '#E8A020' : '#555C50',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
                textTransform: 'capitalize',
              }}
            >
              {t === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            background: '#1A0808',
            border: '1px solid rgba(240,80,80,0.3)',
            borderRadius: 8, padding: '10px 14px',
            color: '#F05050', fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={tab === 'login' 
          ? handleLogin : handleRegister}>
          {tab === 'register' && (
            <div style={{ marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#1C2119',
                  border: '1px solid #252D22',
                  borderRadius: 8, color: '#EDE8DF',
                  fontSize: 14, outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 14px',
                background: '#1C2119',
                border: '1px solid #252D22',
                borderRadius: 8, color: '#EDE8DF',
                fontSize: 14, outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 14px',
                background: '#1C2119',
                border: '1px solid #252D22',
                borderRadius: 8, color: '#EDE8DF',
                fontSize: 14, outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#9A7010' : '#E8A020',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 700,
              color: '#090A07',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {loading
              ? 'Please wait...'
              : tab === 'login'
                ? 'Proceed to Dashboard'
                : 'Create My Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', fontSize: 12,
          color: '#3A4238', marginTop: 16,
        }}>
          By continuing, you agree to our{' '}
          <Link href="/terms" style={{ color: '#555C50' }}>
            Terms
          </Link>{' '}
          &{' '}
          <Link href="/privacy" style={{ color: '#555C50' }}>
            Privacy
          </Link>
        </p>
      </div>
    </div>
  )
}
