'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, User as UserIcon, LogOut } from 'lucide-react'

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('oppalert_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const path = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(getStoredUser())
    const handler = () => setUser(getStoredUser())
    window.addEventListener('oppalert_auth', handler)
    return () => window.removeEventListener('oppalert_auth', handler)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setIsOpen(false), [path])

  const handleLogout = async () => {
    localStorage.removeItem('oppalert_user')
    localStorage.removeItem('oppalert_token')
    // Clear the cookie via API
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    window.dispatchEvent(new Event('oppalert_auth'))
    router.push('/')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-[80px] flex items-center ${
          scrolled ? 'glass border-b border-white/10 shadow-premium' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-gradient flex items-center justify-center shadow-glow-amber group-hover:scale-110 transition-transform duration-500">
               <span className="w-2 h-2 rounded-full bg-bg shadow-inner animate-pulse" />
            </div>
            <div className="font-syne text-2xl font-extrabold text-[#F0EDE6] tracking-tight">
              Opp<span className="text-amber drop-shadow-glow-amber">Alert</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center bg-white/5 backdrop-blur-xl px-2 py-1.5 rounded-2xl border border-white/10">
            {[
              { label: 'Opportunities', href: '/opportunities' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Admin', href: '/admin' }
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`text-[13px] font-bold px-6 py-2.5 rounded-xl transition-all duration-300 ${
                  path === link.href ? 'bg-amber text-bg shadow-glow-amber' : 'text-muted hover:text-primary hover:bg-white/5'
                }`}>
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <button className="btn-ghost px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider flex items-center gap-2">
                    <UserIcon size={14} className="text-amber" />
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-[13px] font-bold text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all flex items-center gap-2"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-[13px] font-bold text-muted hover:text-primary transition-colors px-4 py-2">
                    Log in
                  </button>
                </Link>
                <Link href="/register">
                  <button className="btn-primary px-7 py-3 text-[13px] font-extrabold uppercase tracking-widest flex items-center gap-2">
                    Join Free
                    <ArrowRight size={14} />
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-muted hover:text-amber" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 glass transition-all duration-500 flex flex-col md:hidden ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="p-6 flex justify-between items-center h-[80px]">
          <div className="font-syne text-xl font-extrabold">Opp<span className="text-amber">Alert</span></div>
          <button onClick={() => setIsOpen(false)}><X size={28} /></button>
        </div>
        <div className="flex-1 flex flex-col p-8 gap-4 overflow-y-auto">
          {['Opportunities', 'Pricing', 'Admin'].map((l) => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="text-3xl font-syne font-extrabold hover:text-amber transition-colors">
              {l}
            </Link>
          ))}
          <div className="mt-auto flex flex-col gap-4">
             {user ? (
               <>
                 <Link href="/dashboard" className="btn-primary py-4 text-base uppercase tracking-widest text-center">Dashboard</Link>
                 <button onClick={handleLogout} className="btn-ghost py-4 text-base font-bold text-danger border-danger/20">Sign Out</button>
               </>
             ) : (
               <>
                 <Link href="/login" className="btn-ghost py-4 text-base font-bold text-center">Log in</Link>
                 <Link href="/register" className="btn-primary py-4 text-base font-extrabold uppercase tracking-widest text-center">Join Free</Link>
               </>
             )}
          </div>
        </div>
      </div>
    </>
  )
}
