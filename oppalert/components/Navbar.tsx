'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ArrowRight, User as UserIcon, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

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
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('oppalert_user')
    localStorage.removeItem('oppalert_token')
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    window.dispatchEvent(new Event('oppalert_auth'))
    setShowUserMenu(false)
    router.push('/')
  }

  const initials = (() => {
    if (!user) return ''
    const name = user.fullName || user.name || user.email || ''
    const parts = name.split(' ')
    return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase() || 'U'
  })()

  const isAdmin = user?.plan === 'admin'

  // Build nav links — only show Admin to admin users
  const navLinks = [
    { label: 'Opportunities', href: '/opportunities' },
    { label: 'Pricing', href: '/pricing' },
    ...(isAdmin ? [{ label: 'Admin', href: '/admin' }] : []),
  ]

  return (
    <>
      <header data-navbar style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        colorScheme: 'dark' as any,
        background: scrolled
          ? 'rgba(8,10,7,0.97)'
          : 'rgba(8,10,7,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled
          ? '1px solid #2E3530'
          : '1px solid transparent',
        height: 80,
        transition: 'all 0.3s ease',
        color: '#EDE8DF',
      }}>
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-gradient flex items-center justify-center shadow-glow-amber group-hover:scale-110 transition-transform duration-500">
               <span className="w-2 h-2 rounded-full bg-bg shadow-inner animate-pulse" />
            </div>
            <div className="font-syne text-2xl font-extrabold tracking-tight" style={{color: '#EDE8DF'}}>
              Opp<span className="text-amber drop-shadow-glow-amber">Alert</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center backdrop-blur-xl px-2 py-1.5 rounded-2xl" style={{backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)'}}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`nav-link text-[13px] font-bold px-6 py-2.5 rounded-xl transition-all duration-300 ${
                  path === link.href ? 'active bg-amber shadow-glow-amber' : ''
                }`} style={{
                  color: path === link.href ? '#0D0F0B' : '#9A9C8E',
                }}>
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <div className="flex gap-3 items-center">
                {/* User Avatar with Dropdown — this is the ONLY place logout lives */}
                <div className="relative" ref={userMenuRef} data-dropdown>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 rounded-full bg-amber-gradient flex items-center justify-center font-syne text-xs font-black hover:scale-110 transition-transform cursor-pointer"
                    style={{color: '#0D0F0B'}}
                  >
                    {initials}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-14 w-56 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-fade-up" style={{background: '#141710', borderColor: '#252D22'}}>
                      {/* User email - not clickable */}
                      <div className="px-5 py-4 border-b" style={{borderColor: '#252D22'}}>
                        <p className="text-sm font-bold truncate" style={{color: '#EDE8DF'}}>{user.fullName || user.name || 'User'}</p>
                        <p className="text-[11px] truncate" style={{color: '#9A9C8E'}}>{user.email}</p>
                      </div>
                      <div className="py-2">
                        {/* Dashboard link */}
                        <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-5 py-3 text-sm transition-colors" style={{color: '#9A9C8E'}}>
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        {/* Admin Panel - only for admin */}
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-5 py-3 text-sm transition-colors" style={{color: '#9A9C8E'}}>
                            <Shield size={16} />
                            Admin Panel
                          </Link>
                        )}
                        {/* Post a Listing — visible to all */}
                        <Link href="/post-listing" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-5 py-3 text-sm transition-colors" style={{color: '#9A9C8E'}}>
                          <ArrowRight size={16} />
                          Post a Listing
                        </Link>
                        {/* Divider */}
                        <div className="my-1 mx-4" style={{borderTop: '1px solid #252D22'}} />
                        {/* Sign Out */}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors"
                          style={{color: '#EF4444'}}
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button className="text-[13px] font-bold transition-colors px-4 py-2" style={{color: '#9A9C8E'}}>
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
            <ThemeToggle />
          </div>

          {/* Mobile Toggle Container */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button className="p-2 hover:text-amber" style={{color: '#9A9C8E'}} onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 flex flex-col md:hidden ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`} style={{background: 'rgba(13,15,11,0.97)', backdropFilter: 'blur(20px)', color: '#EDE8DF'}}>
        <div className="p-6 flex justify-between items-center h-[80px]">
          <div className="font-syne text-xl font-extrabold">Opp<span className="text-amber">Alert</span></div>
          <button onClick={() => setIsOpen(false)}><X size={28} /></button>
        </div>
        <div className="flex-1 flex flex-col p-8 gap-4 overflow-y-auto">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-3xl font-syne font-extrabold hover:text-amber transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/post-listing" className="text-3xl font-syne font-extrabold hover:text-amber transition-colors">
            Post Listing
          </Link>
          <div className="mt-auto flex flex-col gap-4">
             {user ? (
               <>
                 <Link href="/dashboard" className="btn-primary py-4 text-base uppercase tracking-widest text-center">Dashboard</Link>
                 <button onClick={handleLogout} className="btn-ghost py-4 text-base font-bold border-danger/20" style={{color: '#EF4444'}}>Sign Out</button>
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
