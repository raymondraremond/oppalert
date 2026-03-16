'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const path = usePathname()

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(13,15,11,0.92)',
        backdropFilter: 'blur(16px)',
        borderColor: '#2E3530',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 20,
            fontWeight: 800,
            color: '#F0EDE6',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#E8A020',
              display: 'inline-block',
            }}
          />
          Opp<span style={{ color: '#E8A020' }}>Alert</span>
        </div>
      </Link>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <Link href="/opportunities">
          <div className={`nav-link${path.startsWith('/opportunities') ? ' active' : ''}`}>
            Opportunities
          </div>
        </Link>
        <Link href="/pricing">
          <div className={`nav-link${path === '/pricing' ? ' active' : ''}`}>Pricing</div>
        </Link>
        <Link href="/admin">
          <div className={`nav-link${path === '/admin' ? ' active' : ''}`}>Admin</div>
        </Link>
      </nav>

      {/* Auth */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Link href="/dashboard">
          <button
            className="btn-ghost"
            style={{ padding: '6px 14px', fontSize: 13, fontWeight: 600 }}
          >
            Log in
          </button>
        </Link>
        <Link href="/dashboard">
          <button
            className="btn-primary"
            style={{ padding: '7px 16px', fontSize: 13, fontWeight: 700 }}
          >
            Get Started
          </button>
        </Link>
      </div>
    </header>
  )
}
