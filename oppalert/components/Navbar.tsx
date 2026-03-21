'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobile, setShowMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const path = usePathname()
  const router = useRouter()

  // Read user from localStorage
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
    // Load user immediately
    loadUser()

    // Listen for storage changes (login/logout in other tabs)
    const handleStorage = () => loadUser()
    window.addEventListener('storage', handleStorage)

    // Scroll detection
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(e.target as Node)) {
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

  // Reload user when path changes (page navigation)
  useEffect(() => {
    loadUser()
    setShowMobile(false)
    setShowDropdown(false)
  }, [path])

  const handleLogout = () => {
    localStorage.removeItem('user')
    document.cookie = 
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    setUser(null)
    setShowDropdown(false)
    setShowMobile(false)
    router.push('/')
  }

  const isAdmin = user?.plan === 'admin'
  const isLoggedIn = !!user

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.fullName) return "U"
    return user.fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const navLinks = [
    { href: '/opportunities', label: 'Opportunities' },
    { href: '/events', label: 'Events' },
    { href: '/pricing', label: 'Pricing' },
  ]

  return (
    <>
      <header
        data-navbar
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: scrolled
            ? 'rgba(8,10,7,0.98)'
            : 'rgba(8,10,7,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #252D22',
          height: 60,
          transition: 'all 0.3s ease',
          colorScheme: 'dark',
        }}
      >
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 
                  'linear-gradient(135deg, #E8A020, #C87020)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 14,
                color: '#090A07',
                fontFamily: 'Syne, sans-serif',
              }}>
                O
              </div>
              <span style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 18,
                fontWeight: 800,
                color: '#EDE8DF',
              }}>
                Opp<span style={{ color: '#E8A020' }}>Alert</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{
            display: 'flex',
            gap: 4,
            alignItems: 'center',
          }}
            className="hide-mobile"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: path.startsWith(link.href)
                    ? '#EDE8DF'
                    : '#9A9C8E',
                  background: path.startsWith(link.href)
                    ? '#1C2119'
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  {link.label}
                </div>
              </Link>
            ))}

            {/* Show Organizer link when logged in */}
            {isLoggedIn && (
              <Link href="/organizer" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: path.startsWith('/organizer')
                    ? '#E8A020'
                    : '#9A9C8E',
                  background: path.startsWith('/organizer')
                    ? '#2A1E06'
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  Organizer
                </div>
              </Link>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
            className="hide-mobile"
          >
            {isLoggedIn ? (
              // Logged in — show avatar with dropdown
              <div
                ref={dropdownRef}
                style={{ position: 'relative' }}
              >
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#2A1E06',
                    border: '2px solid #E8A020',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#E8A020',
                    cursor: 'pointer',
                    fontFamily: 'Syne, sans-serif',
                    userSelect: 'none',
                  }}
                >
                  {getInitials()}
                </div>

                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 44,
                    background: '#141710',
                    border: '1px solid #252D22',
                    borderRadius: 12,
                    padding: 8,
                    minWidth: 200,
                    zIndex: 200,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}>
                    {/* User info */}
                    <div style={{
                      padding: '8px 12px 10px',
                      borderBottom: '1px solid #252D22',
                      marginBottom: 4,
                    }}>
                      <div style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#EDE8DF',
                        marginBottom: 2,
                      }}>
                        {user?.fullName || 'User'}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: '#555C50',
                      }}>
                        {user?.email}
                      </div>
                      <div style={{
                        marginTop: 6,
                        display: 'inline-block',
                        background: user?.plan === 'admin'
                          ? 'linear-gradient(135deg, #E8A020, #C87020)'
                          : user?.plan === 'premium'
                            ? '#2A1E06'
                            : '#1C2119',
                        color: user?.plan === 'admin'
                          ? '#090A07'
                          : user?.plan === 'premium'
                            ? '#E8A020'
                            : '#9A9C8E',
                        padding: '2px 10px',
                        borderRadius: 100,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                      }}>
                        {user?.plan === 'admin'
                          ? 'FOUNDER'
                          : user?.plan === 'premium'
                            ? 'PREMIUM'
                            : 'FREE'}
                      </div>
                    </div>

                    {/* Dropdown links */}
                    {[
                      { href: '/dashboard', label: '📊 Dashboard' },
                      { href: '/organizer', label: '🎪 Organizer' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        style={{ textDecoration: 'none' }}
                        onClick={() => setShowDropdown(false)}
                      >
                        <div style={{
                          padding: '8px 12px',
                          fontSize: 13,
                          color: '#EDE8DF',
                          borderRadius: 8,
                          cursor: 'pointer',
                          transition: 'background 0.1s',
                        }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.background = '#1C2119')
                          }
                          onMouseLeave={e =>
                            (e.currentTarget.style.background = 'transparent')
                          }
                        >
                          {item.label}
                        </div>
                      </Link>
                    ))}

                    {/* Admin link only for admins */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        style={{ textDecoration: 'none' }}
                        onClick={() => setShowDropdown(false)}
                      >
                        <div style={{
                          padding: '8px 12px',
                          fontSize: 13,
                          color: '#E8A020',
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.background = '#2A1E06')
                          }
                          onMouseLeave={e =>
                            (e.currentTarget.style.background = 'transparent')
                          }
                        >
                          ⚙️ Admin Panel
                        </div>
                      </Link>
                    )}

                    {/* Upgrade for free users */}
                    {user?.plan === 'free' && (
                      <Link
                        href="/pricing"
                        style={{ textDecoration: 'none' }}
                        onClick={() => setShowDropdown(false)}
                      >
                        <div style={{
                          margin: '4px 8px',
                          padding: '8px 12px',
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#090A07',
                          background: '#E8A020',
                          borderRadius: 8,
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}>
                          ⚡ Upgrade to Premium
                        </div>
                      </Link>
                    )}

                    {/* Logout */}
                    <div
                      onClick={handleLogout}
                      style={{
                        padding: '8px 12px',
                        fontSize: 13,
                        color: '#F05050',
                        borderRadius: 8,
                        cursor: 'pointer',
                        marginTop: 4,
                        borderTop: '1px solid #252D22',
                      }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.background = '#280C0C')
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      → Sign Out
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Logged out — show login and register
              <>
                <Link href="/login">
                  <button style={{
                    padding: '7px 16px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    background: 'transparent',
                    border: '1px solid #313D2C',
                    color: '#9A9C8E',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}>
                    Log In
                  </button>
                </Link>
                <Link href="/register">
                  <button style={{
                    padding: '7px 16px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    background: '#E8A020',
                    border: 'none',
                    color: '#090A07',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}>
                    Join Free →
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setShowMobile(!showMobile)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              color: '#EDE8DF',
              fontSize: 20,
              display: 'none',
            }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {showMobile ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobile && (
          <div style={{
            background: '#0F1210',
            borderTop: '1px solid #252D22',
            padding: '16px 1.5rem',
          }}>
            {/* Mobile nav links */}
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{ textDecoration: 'none' }}
                onClick={() => setShowMobile(false)}
              >
                <div style={{
                  padding: '12px 0',
                  fontSize: 15,
                  fontWeight: 500,
                  color: path.startsWith(link.href)
                    ? '#E8A020'
                    : '#9A9C8E',
                  borderBottom: '1px solid #1C2119',
                }}>
                  {link.label}
                </div>
              </Link>
            ))}

            {isLoggedIn ? (
              // Mobile logged in state
              <>
                <Link
                  href="/dashboard"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setShowMobile(false)}
                >
                  <div style={{
                    padding: '12px 0',
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#9A9C8E',
                    borderBottom: '1px solid #1C2119',
                  }}>
                    📊 Dashboard
                  </div>
                </Link>
                <Link
                  href="/organizer"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setShowMobile(false)}
                >
                  <div style={{
                    padding: '12px 0',
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#9A9C8E',
                    borderBottom: '1px solid #1C2119',
                  }}>
                    🎪 Organizer
                  </div>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    style={{ textDecoration: 'none' }}
                    onClick={() => setShowMobile(false)}
                  >
                    <div style={{
                      padding: '12px 0',
                      fontSize: 15,
                      fontWeight: 500,
                      color: '#E8A020',
                      borderBottom: '1px solid #1C2119',
                    }}>
                      ⚙️ Admin Panel
                    </div>
                  </Link>
                )}
                <div style={{
                  padding: '12px 0',
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#2A1E06',
                    border: '2px solid #E8A020',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#E8A020',
                    flexShrink: 0,
                  }}>
                    {getInitials()}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#EDE8DF',
                    }}>
                      {user?.fullName}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: '#555C50',
                    }}>
                      {user?.plan === 'admin'
                        ? 'Founder'
                        : user?.plan === 'premium'
                          ? 'Premium Member'
                          : 'Free Member'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'transparent',
                    border: '1px solid #3A1010',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#F05050',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    marginTop: 8,
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              // Mobile logged out state
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginTop: 16,
              }}>
                <Link
                  href="/login"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setShowMobile(false)}
                >
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid #313D2C',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#9A9C8E',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}>
                    Log In
                  </button>
                </Link>
                <Link
                  href="/register"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setShowMobile(false)}
                >
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: '#E8A020',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#090A07',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}>
                    Join Free →
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  )
}
