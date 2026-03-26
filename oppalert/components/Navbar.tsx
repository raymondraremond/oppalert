'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobile, setShowMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const path = usePathname()
  const router = useRouter()

  const loadUser = () => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.email) {
          setUser(parsed)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    loadUser()
    const handleStorage = () => loadUser()
    window.addEventListener('storage', handleStorage)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    loadUser()
    setShowMobile(false)
    setShowDropdown(false)
  }, [path])

  const handleLogout = () => {
    localStorage.removeItem('user')
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setUser(null)
    setShowDropdown(false)
    setShowMobile(false)
    router.push('/')
  }

  const isAdmin = user !== null && user.plan === 'admin'
  const isLoggedIn = !!user

  const getInitials = () => {
    if (!user?.fullName && !user?.full_name) return 'U'
    const name = user.fullName || user.full_name
    return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const navLinks = [
    { href: '/opportunities', label: 'Opportunities' },
    { href: '/events', label: 'Events' },
    { href: '/pricing', label: 'Pricing' },
  ]

  const navLinkStyle = (href: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 4px',
    margin: '0 8px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color 0.15s ease, background 0.15s ease',
    textDecoration: 'none',
  })

  // Do not show navbar on login/register pages
  if (path === '/login' || path === '/register') return null

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'var(--glass)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      height: 60,
      transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem',
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--amber), #C87020)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 18, color: '#090A07', fontFamily: 'Syne, sans-serif', paddingBottom: 2,
            }}>o</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
              Opp<span style={{ color: 'var(--amber)' }}>Fetch</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hide-mobile" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              style={navLinkStyle(link.href)}
              className={`nav-link-modern ${path.startsWith(link.href) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link 
              href="/organizer" 
              style={navLinkStyle('/organizer')}
              className={`nav-link-modern ${path.startsWith('/organizer') ? 'active' : ''}`}
            >
              Organizer
            </Link>
          )}
          {isAdmin && (
            <Link 
              href="/admin" 
              style={navLinkStyle('/admin')}
              className={`nav-link-modern text-amber font-bold ${path.startsWith('/admin') ? 'active' : ''}`}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Auth/User */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <ThemeToggle />
          {isLoggedIn ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <div onClick={() => setShowDropdown(!showDropdown)} style={{
                width: 36, height: 36, borderRadius: '50%', background: 'var(--amber-dim)',
                border: '2px solid var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: 'var(--amber)', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', userSelect: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              >{getInitials()}</div>
              {showDropdown && (
                <div style={{
                  position: 'absolute', right: 0, top: 44, background: 'var(--bg2)',
                  border: '1px solid var(--border)', borderRadius: 12, padding: 8, minWidth: 200,
                  zIndex: 200, boxShadow: 'var(--card-shadow, 0 8px 32px rgba(0,0,0,0.2))',
                }}>
                  <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 2 }}>{user?.fullName || user?.full_name || 'User'}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{user?.email}</div>
                  </div>
                  {[
                    { href: '/dashboard', label: '📊 Dashboard' },
                    { href: '/organizer', label: '🎪 Organizer' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setShowDropdown(false)}>
                      <div style={{ padding: '8px 12px', fontSize: 13, color: 'var(--primary)', borderRadius: 8, cursor: 'pointer' }}>{item.label}</div>
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link href="/admin" style={{ textDecoration: 'none' }} onClick={() => setShowDropdown(false)}>
                      <div style={{ padding: '8px 12px', fontSize: 13, color: 'var(--amber)', borderRadius: 8, cursor: 'pointer' }}>⚙️ Admin Panel</div>
                    </Link>
                  )}
                  <div onClick={handleLogout} style={{ padding: '8px 12px', fontSize: 13, color: 'var(--danger)', borderRadius: 8, cursor: 'pointer', marginTop: 4, borderTop: '1px solid var(--border)' }}>→ Sign Out</div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login"><button className="btn-animate" style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>Log In</button></Link>
              <Link href="/register"><button className="btn-animate" style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: 'var(--amber)', border: 'none', color: '#090A07', cursor: 'pointer', fontFamily: 'inherit' }}>{"Join Free \u2192"}</button></Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="show-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ThemeToggle />
          <button onClick={() => setShowMobile(!showMobile)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--primary)', fontSize: 20 }}>
            {showMobile ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobile && (
        <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '16px 1.5rem' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }} onClick={() => setShowMobile(false)}>
              <div style={{ padding: '12px 0', fontSize: 15, fontWeight: 500, color: path.startsWith(link.href) ? 'var(--amber)' : 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{link.label}</div>
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" style={{ textDecoration: 'none' }} onClick={() => setShowMobile(false)}>
                <div style={{ padding: '12px 0', fontSize: 15, fontWeight: 500, color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>📊 Dashboard</div>
              </Link>
              <Link href="/organizer" style={{ textDecoration: 'none' }} onClick={() => setShowMobile(false)}>
                <div style={{ padding: '12px 0', fontSize: 15, fontWeight: 500, color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>🎪 Organizer</div>
              </Link>
              {isAdmin && (
                <Link href="/admin" style={{ textDecoration: 'none' }} onClick={() => setShowMobile(false)}>
                  <div style={{ padding: '12px 0', fontSize: 15, fontWeight: 500, color: 'var(--amber)', borderBottom: '1px solid var(--border)' }}>⚙️ Admin Panel</div>
                </Link>
              )}
              <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--danger-dim)', borderRadius: 8, fontSize: 13, color: 'var(--danger)', cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}>Sign Out</button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <Link href="/login" style={{ textDecoration: 'none' }} onClick={() => setShowMobile(false)}><button style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontWeight: 600, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>Log In</button></Link>
              <Link href="/register" style={{ textDecoration: 'none' }} onClick={() => setShowMobile(false)}><button style={{ width: '100%', padding: '12px', background: 'var(--amber)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#090A07', cursor: 'pointer', fontFamily: 'inherit' }}>Join Free →</button></Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
