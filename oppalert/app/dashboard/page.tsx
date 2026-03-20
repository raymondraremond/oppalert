'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [savedOpps, setSavedOpps] = useState<any[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [savedLoading, setSavedLoading] = useState(true)
  const [alerts, setAlerts] = useState({
    newOpps: true,
    deadlines: true,
    digest: true,
    instant: false,
  })

  useEffect(() => {
    // Get user from localStorage
    try {
      const stored = localStorage.getItem('user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}

    // Fetch saved opportunities
    const fetchSaved = async () => {
      try {
        setSavedLoading(true)

        // Get token - try localStorage first, then cookie
        let token: string | null = null

        try {
          const stored = localStorage.getItem('user')
          if (stored) {
            const parsed = JSON.parse(stored)
            if (parsed.token) token = parsed.token
          }
        } catch {}

        if (!token) {
          const cookies = document.cookie.split('; ')
          const found = cookies.find(c => c.startsWith('token='))
          if (found) token = found.split('=')[1]
        }

        if (!token) {
          setSavedLoading(false)
          return
        }

        const res = await fetch('/api/user/saved', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })

        if (!res.ok) {
          setSavedLoading(false)
          return
        }

        const data = await res.json()

        // Handle both array and object responses
        const opps = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : []

        setSavedOpps(opps)
        setSavedCount(opps.length)
      } catch (err) {
        console.error('fetchSaved error:', err)
      } finally {
        setSavedLoading(false)
      }
    }

    fetchSaved()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/'
  }

  const handleRemoveSaved = async (oppId: string) => {
    try {
      let token: string | null = null
      try {
        const stored = localStorage.getItem('user')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.token) token = parsed.token
        }
      } catch {}
      if (!token) {
        const cookies = document.cookie.split('; ')
        const found = cookies.find(c => c.startsWith('token='))
        if (found) token = found.split('=')[1]
      }
      if (!token) return

      await fetch('/api/user/saved', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oppId }),
      })

      setSavedOpps(prev => prev.filter((o: any) => o.id !== oppId && o.opportunity_id !== oppId))
      setSavedCount(prev => prev - 1)
    } catch (err) {
      console.error('Remove saved error:', err)
    }
  }

  const isPremium = user?.plan === 'premium' || user?.plan === 'admin'
  const isAdmin = user?.plan === 'admin'

  const getBadgeStyle = () => {
    if (user?.plan === 'admin') return {
      background: 'linear-gradient(135deg, #E8A020, #C87020)',
      color: '#0D0F0B', fontWeight: 800,
      borderRadius: 100, padding: '3px 14px', fontSize: 11, letterSpacing: 1,
      display: 'inline-block',
    }
    if (user?.plan === 'premium') return {
      background: '#2A1E06', color: '#E8A020',
      border: '1px solid rgba(232,160,32,0.3)',
      borderRadius: 100, padding: '3px 14px', fontSize: 11,
      display: 'inline-block',
    }
    return {
      background: '#1C2119', color: '#9A9C8E',
      borderRadius: 100, padding: '3px 14px', fontSize: 11,
      display: 'inline-block',
    }
  }

  const getBadgeText = () => {
    if (user?.plan === 'admin') return 'FOUNDER'
    if (user?.plan === 'premium') return 'PREMIUM MEMBER'
    return 'FREE MEMBER'
  }

  const navItems = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'saved', label: `♡ Saved (${savedCount})` },
    { id: 'alerts', label: '🔔 Smart Alerts' },
    { id: 'profile', label: '👤 My Profile' },
  ]

  return (
    <div style={{
      maxWidth: 1100, margin: '0 auto',
      padding: '32px 1.5rem',
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      gap: 28,
      minHeight: 'calc(100vh - 60px)',
    }}>

      {/* ── SIDEBAR ── */}
      <aside>
        <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #252D22', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 14,
            background: '#2A1E06',
            border: '2px solid #E8A020',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800, fontSize: 20,
            color: '#E8A020', margin: '0 auto 12px',
            fontFamily: 'Syne, sans-serif',
          }}>
            {user?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
            {user?.fullName || 'User'}
          </div>
          <div style={getBadgeStyle()}>{getBadgeText()}</div>
          {!isPremium && (
            <Link href="/pricing">
              <button style={{
                marginTop: 12, width: '100%',
                padding: '8px', background: '#E8A020',
                border: 'none', borderRadius: 8,
                fontSize: 12, fontWeight: 700,
                color: '#090A07', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                ⚡ Upgrade to Premium
              </button>
            </Link>
          )}
        </div>

        {navItems.map(item => (
          <div key={item.id} onClick={() => setActiveTab(item.id)}
            style={{
              padding: '10px 14px', borderRadius: 8,
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              marginBottom: 2, transition: 'all 0.15s',
              background: activeTab === item.id ? '#2A1E06' : 'transparent',
              color: activeTab === item.id ? '#E8A020' : '#9A9C8E',
            }}>
            {item.label}
          </div>
        ))}

        {isAdmin && (
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '10px 14px', borderRadius: 8,
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              marginBottom: 2, color: '#E8A020',
              border: '1px solid rgba(232,160,32,0.2)',
              marginTop: 8,
            }}>
              ⚙️ Admin Panel
            </div>
          </Link>
        )}

        <div onClick={handleLogout} style={{
          padding: '10px 14px', borderRadius: 8,
          cursor: 'pointer', fontSize: 13,
          color: '#F05050', marginTop: 16, opacity: 0.8,
        }}>
          → Sign Out
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
              Welcome, <span style={{ color: '#E8A020' }}>{user?.fullName?.split(' ')[0] || 'there'}</span>
            </h2>
            <p style={{ fontSize: 14, color: '#555C50', marginBottom: 28 }}>
              Discover opportunities and start saving them.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                {
                  icon: '♡',
                  value: savedCount,
                  label: 'SAVED ITEMS',
                },
                {
                  icon: '🕐',
                  value: 0,
                  label: 'URGENT DEADLINES',
                },
                {
                  icon: '🔔',
                  value: isPremium ? 'Unlimited' : `${savedCount} / 5`,
                  label: 'SAVE LIMIT',
                },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#0F1210',
                  border: '1px solid #252D22',
                  borderRadius: 16, padding: '1.5rem',
                }}>
                  <div style={{ fontSize: 20, marginBottom: 12, opacity: 0.4 }}>{s.icon}</div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 32, fontWeight: 800, marginBottom: 6,
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: '#555C50', letterSpacing: '0.8px', fontWeight: 600 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Latest Opportunities */}
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              ✨ Latest Opportunities
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Link href="/opportunities">
                <button style={{
                  background: '#E8A020', border: 'none',
                  borderRadius: 10, padding: '10px 24px',
                  fontSize: 13, fontWeight: 700,
                  color: '#090A07', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Browse All Opportunities →
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* SAVED TAB */}
        {activeTab === 'saved' && (
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
              Saved <span style={{ color: '#E8A020' }}>Items</span>
            </h2>
            <p style={{ fontSize: 13, color: '#555C50', marginBottom: 24 }}>
              {savedCount} saved {savedCount === 1 ? 'opportunity' : 'opportunities'}
            </p>

            {savedLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    background: '#141710', border: '1px solid #252D22',
                    borderRadius: 16, padding: '1.25rem', height: 200,
                    animation: 'skeleton-pulse 1.5s ease infinite',
                  }} />
                ))}
              </div>
            ) : savedOpps.length === 0 ? (
              <div style={{
                background: '#0F1210', border: '1px solid #252D22',
                borderRadius: 16, padding: '3rem 2rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤍</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  No saved items yet
                </h3>
                <p style={{ fontSize: 13, color: '#555C50', marginBottom: 20 }}>
                  Browse opportunities and save the ones you want to apply to.
                </p>
                <Link href="/opportunities">
                  <button style={{
                    background: '#E8A020', border: 'none',
                    borderRadius: 10, padding: '10px 24px',
                    fontSize: 13, fontWeight: 700,
                    color: '#090A07', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}>
                    Browse Opportunities
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {savedOpps.map((opp: any) => {
                  const oppId = opp.id || opp.opportunity_id
                  return (
                    <div key={oppId} style={{
                      background: '#141710', border: '1px solid #252D22',
                      borderRadius: 16, padding: '1.25rem',
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>{opp.icon || '🌍'}</div>
                      <div style={{
                        fontFamily: 'Syne, sans-serif', fontSize: 14,
                        fontWeight: 700, marginBottom: 4, color: '#EDE8DF', lineHeight: 1.3,
                      }}>
                        {opp.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#555C50', marginBottom: 12 }}>
                        {opp.organization}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                        <span style={{
                          background: '#2A1E06', color: '#E8A020',
                          padding: '2px 9px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                        }}>
                          {opp.category}
                        </span>
                        <span style={{
                          background: '#1C2119', color: '#9A9C8E',
                          padding: '2px 9px', borderRadius: 100, fontSize: 11,
                        }}>
                          {opp.funding_type}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#555C50', marginBottom: 14 }}>
                        ⏰ {opp.days_remaining || 30} days left
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/opportunities/${oppId}`} style={{ flex: 1, textDecoration: 'none' }}>
                          <button style={{
                            width: '100%', padding: '8px',
                            background: '#E8A020', border: 'none',
                            borderRadius: 8, fontSize: 12, fontWeight: 700,
                            color: '#090A07', cursor: 'pointer', fontFamily: 'inherit',
                          }}>
                            View →
                          </button>
                        </Link>
                        <button onClick={() => handleRemoveSaved(oppId)} style={{
                          padding: '8px 12px', background: 'transparent',
                          border: '1px solid #252D22', borderRadius: 8,
                          fontSize: 12, color: '#F05050',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
              Smart <span style={{ color: '#E8A020' }}>Alerts</span>
            </h2>
            <p style={{ fontSize: 13, color: '#555C50', marginBottom: 24 }}>
              Control what notifications you receive.
            </p>

            {!isPremium && (
              <div style={{
                background: 'linear-gradient(135deg, #2A1E06, #141710)',
                border: '1px solid rgba(232,160,32,0.2)',
                borderRadius: 12, padding: '14px 18px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: 16,
                marginBottom: 20, flexWrap: 'wrap',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#E8A020', marginBottom: 2 }}>
                    ⚡ Unlock Instant Alerts
                  </div>
                  <p style={{ fontSize: 12, color: '#9A9C8E', margin: 0 }}>
                    Upgrade to get real-time notifications before free users.
                  </p>
                </div>
                <Link href="/pricing">
                  <button style={{
                    background: '#E8A020', border: 'none',
                    borderRadius: 8, padding: '8px 16px',
                    fontSize: 12, fontWeight: 700,
                    color: '#090A07', cursor: 'pointer',
                    fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}>
                    Upgrade
                  </button>
                </Link>
              </div>
            )}

            {[
              { key: 'newOpps', icon: '📧', label: 'New opportunity alerts', sub: 'Notified when new listings match your preferences', premium: false },
              { key: 'deadlines', icon: '⏰', label: 'Deadline reminders', sub: 'Reminders 7 days before saved opportunity deadlines', premium: false },
              { key: 'digest', icon: '📰', label: 'Weekly digest', sub: 'A weekly roundup of the best opportunities', premium: false },
              { key: 'instant', icon: '⚡', label: 'Instant alerts', sub: 'Real-time notification the moment an opportunity goes live', premium: true },
            ].map(a => (
              <div key={a.key} style={{
                background: '#141710', border: '1px solid #252D22',
                borderRadius: 10, padding: '14px 16px',
                display: 'flex', alignItems: 'center',
                marginBottom: 10, gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {a.label}
                    {a.premium && (
                      <span style={{
                        background: '#2A1E06', color: '#E8A020',
                        padding: '2px 8px', borderRadius: 100,
                        fontSize: 10, fontWeight: 600, marginLeft: 8,
                      }}>
                        Premium
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#555C50', marginTop: 2 }}>{a.sub}</div>
                </div>
                <div
                  onClick={() => {
                    if (a.premium && !isPremium) return
                    setAlerts(prev => ({ ...prev, [a.key]: !prev[a.key as keyof typeof prev] }))
                  }}
                  style={{
                    width: 42, height: 24,
                    background: alerts[a.key as keyof typeof alerts] ? '#E8A020' : '#1C2119',
                    borderRadius: 100, cursor: a.premium && !isPremium ? 'not-allowed' : 'pointer',
                    border: `1px solid ${alerts[a.key as keyof typeof alerts] ? '#E8A020' : '#252D22'}`,
                    position: 'relative', transition: 'all 0.2s', flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute', width: 18, height: 18,
                    borderRadius: '50%',
                    background: alerts[a.key as keyof typeof alerts] ? '#090A07' : '#555C50',
                    top: 2,
                    left: alerts[a.key as keyof typeof alerts] ? 21 : 2,
                    transition: 'all 0.2s',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 24 }}>
              My <span style={{ color: '#E8A020' }}>Profile</span>
            </h2>
            <div style={{ background: '#141710', border: '1px solid #252D22', borderRadius: 12, padding: '1.5rem', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
                Personal Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#555C50', display: 'block', marginBottom: 6 }}>First Name</label>
                  <input defaultValue={user?.fullName?.split(' ')[0] || ''} style={{ width: '100%', padding: '10px 14px', background: '#1C2119', border: '1px solid #252D22', borderRadius: 8, color: '#EDE8DF', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#555C50', display: 'block', marginBottom: 6 }}>Last Name</label>
                  <input defaultValue={user?.fullName?.split(' ').slice(1).join(' ') || ''} style={{ width: '100%', padding: '10px 14px', background: '#1C2119', border: '1px solid #252D22', borderRadius: 8, color: '#EDE8DF', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#555C50', display: 'block', marginBottom: 6 }}>Email</label>
                <input defaultValue={user?.email || ''} type="email" style={{ width: '100%', padding: '10px 14px', background: '#1C2119', border: '1px solid #252D22', borderRadius: 8, color: '#EDE8DF', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <button style={{ background: '#E8A020', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700, color: '#090A07', cursor: 'pointer', fontFamily: 'inherit' }}>
                Save Changes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
