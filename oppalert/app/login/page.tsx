import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
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
        
        // Auto sign in after signup
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        })

        if (result?.error) {
          throw new Error(result.error)
        }
        
        router.push('/dashboard')
        router.refresh()
      } else {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        })

        if (result?.error) {
          throw new Error('Invalid email or password')
        }

        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  if (isLoading && !error) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 70px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <Loader2 className="animate-spin mb-4 text-amber" size={48} />
        <p style={{ fontSize: 14, color: '#A8A89A' }}>
          {mode === 'login' ? 'Authenticating...' : 'Creating your account...'}
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{ width: '100%', maxWidth: 420, position: 'relative' }}
        className="animate-fade-up"
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#F0EDE6' }}>
              Opp<span style={{ color: '#E8A020' }}>Alert</span>
            </div>
          </Link>
        </div>

        {/* Mode Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#141710',
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            border: '1px solid #2E3530',
          }}
        >
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 9,
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'DM Sans, sans-serif',
                background: mode === m ? 'linear-gradient(135deg, #E8A020, #C87020)' : 'transparent',
                color: mode === m ? '#0D0F0B' : '#6A6B62',
              }}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div
          style={{
            background: 'rgba(20, 23, 16, 0.8)',
            backdropFilter: 'blur(16px)',
            border: '1px solid #2E3530',
            borderRadius: 16,
            padding: '2rem',
          }}
        >
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 6,
            }}
          >
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ fontSize: 14, color: '#A8A89A', marginBottom: 24 }}>
            {mode === 'login'
              ? 'Sign in to access your saved opportunities and alerts.'
              : 'Join 48,000+ professionals discovering opportunities.'}
          </p>

          {error && (
            <div 
              style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                color: '#ef4444', 
                padding: '12px', 
                borderRadius: '8px', 
                fontSize: '13px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}
                >
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6A6B62',
                    }}
                  />
                  <input
                    className="input"
                    type="text"
                    placeholder="e.g. Adewale Okafor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label
                style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6A6B62',
                  }}
                />
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: mode === 'login' ? 8 : 24 }}>
              <label
                style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6A6B62',
                  }}
                />
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6A6B62',
                    padding: 2,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div
                style={{
                  textAlign: 'right',
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: '#E8A020',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: 15,
                fontWeight: 700,
                gap: 8,
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {mode === 'login' ? 'Log In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '20px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#2E3530' }} />
            <span style={{ fontSize: 12, color: '#6A6B62' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#2E3530' }} />
          </div>

          {/* Social Login */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              {
                name: 'Google',
                svg: (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                ),
              },
              {
                name: 'GitHub',
                svg: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#F0EDE6">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                ),
              },
            ].map((provider) => (
               <button
                key={provider.name}
                type="button"
                className="btn-ghost"
                onClick={() => handleSocialLogin(provider.name.toLowerCase())}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: 13,
                  fontWeight: 500,
                  gap: 8,
                }}
              >
                {provider.svg}
                {provider.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <p style={{ textAlign: 'center', fontSize: 12, color: '#6A6B62', marginTop: 20 }}>
          By continuing, you agree to OppAlert's{' '}
          <Link href="/terms" style={{ color: '#A8A89A', textDecoration: 'none' }}>Terms of Service</Link> and{' '}
          <Link href="/privacy" style={{ color: '#A8A89A', textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
