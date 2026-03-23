'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ManageEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params?.id as string

  const [user, setUser] = useState<any>(null)
  const [event, setEvent] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const getEventStatus = (ev: any): { label: string; color: string; bg: string } => {
    const now = new Date()
    const start = new Date(ev.start_date)
    const end = ev.end_date ? new Date(ev.end_date) : null
    if (!ev.is_published) return { label: 'Draft', color: '#9A9C8E', bg: '#1C2119' }
    if (end && now > end) return { label: 'Past', color: '#555C50', bg: '#141710' }
    if (now >= start && (!end || now <= end)) return { label: 'Live Now', color: '#34C27A', bg: '#0F2E1C' }
    if (start > now) {
      const daysUntil = Math.ceil((start.getTime() - now.getTime()) / 86400000)
      if (daysUntil <= 7) return { label: 'Starting Soon', color: '#E8A020', bg: '#2A1E06' }
      return { label: 'Upcoming', color: '#4A9EE8', bg: '#0D1B2A' }
    }
    return { label: 'Published', color: '#34C27A', bg: '#0F2E1C' }
  }

  const fetchData = useCallback(async (token: string) => {
    try {
      // Fetch event details
      const evRes = await fetch(
        `/api/organizer/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (evRes.ok) {
        const evData = await evRes.json()
        setEvent(evData.data || evData)
      }

      // Fetch registrations
      const regRes = await fetch(
        `/api/organizer/events/${eventId}/registrations`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (regRes.ok) {
        const regData = await regRes.json()
        setRegistrations(regData.data || [])
      }
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (!stored) { router.push('/login'); return }
      const parsed = JSON.parse(stored)
      if (!parsed?.token) { router.push('/login'); return }
      setUser(parsed)
      fetchData(parsed.token)
    } catch {
      router.push('/login')
    }
  }, [router, fetchData])

  // Auto-refresh registrations every 30 seconds when on that tab
  useEffect(() => {
    if (activeTab !== 'registrations') return
    const interval = setInterval(() => {
      if (user?.token) fetchData(user.token)
    }, 30000)
    return () => clearInterval(interval)
  }, [activeTab, user, fetchData])

  // Fetch analytics when switching to analytics tab
  useEffect(() => {
    if (activeTab !== 'analytics' || !user?.token || analytics) return
    setAnalyticsLoading(true)
    fetch(`/api/organizer/events/${eventId}/analytics`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(r => r.json())
      .then(data => setAnalytics(data))
      .catch(() => {})
      .finally(() => setAnalyticsLoading(false))
  }, [activeTab, user, eventId, analytics])

  const handleExport = async () => {
    try {
      const token = user?.token
      const res = await fetch(
        `/api/organizer/events/${eventId}/export`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendees-${eventId}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
    }
  }

  const copyEventLink = async () => {
    if (!event?.slug) return
    const url = `https://oppalert.vercel.app/events/${event.slug}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#555C50', fontSize: 14,
      }}>
        Loading event...
      </div>
    )
  }

  if (!event) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: '#555C50', gap: 16,
      }}>
        <div>Event not found</div>
        <Link href="/organizer">
          <button style={{
            padding: '10px 20px', background: '#E8A020',
            border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 700,
            color: '#090A07', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Back to Dashboard
          </button>
        </Link>
      </div>
    )
  }

  const tabs = ['overview', 'registrations', 'analytics', 'share']

  return (
    <div style={{
      maxWidth: 1000, margin: '0 auto',
      padding: '40px 1.5rem 80px',
    }}>
      <Link href="/organizer" style={{
        textDecoration: 'none', color: '#555C50',
        fontSize: 13, display: 'inline-flex',
        alignItems: 'center', gap: 4, marginBottom: 24,
      }}>
        ← Back to Dashboard
      </Link>

      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 32,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 24, fontWeight: 800, marginBottom: 6,
          }}>
            {event.title}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(() => { const s = getEventStatus(event); return (
              <span style={{
                background: s.bg, color: s.color,
                padding: '3px 12px', borderRadius: 100,
                fontSize: 12, fontWeight: 700,
              }}>{s.label}</span>
            )})()}
            <span style={{
              background: '#1C2119', color: 'var(--muted)',
              padding: '3px 12px', borderRadius: 100,
              fontSize: 12, textTransform: 'capitalize',
            }}>
              {event.event_type}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => user?.token && fetchData(user.token)}
            style={{
              padding: '8px 16px', background: 'transparent',
              border: '1px solid #313D2C', borderRadius: 8,
              fontSize: 13, color: '#9A9C8E',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={handleExport}
            style={{
              padding: '9px 18px', background: 'transparent',
              border: '1px solid #313D2C', borderRadius: 8,
              fontSize: 13, color: 'var(--muted)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Export CSV
          </button>
          <Link href={`/events/${event.slug}`}>
            <button style={{
              padding: '9px 18px', background: '#E8A020',
              border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 700, color: '#090A07',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              View Public Page →
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16, marginBottom: 32,
      }}>
        {[
          {
            label: 'Total Registrations',
            value: registrations.length,
            color: '#34C27A',
          },
          {
            label: 'Capacity',
            value: event.max_capacity
              ? `${registrations.length} / ${event.max_capacity}`
              : 'Unlimited',
            color: '#E8A020',
          },
          {
            label: 'Event Date',
            value: new Date(event.start_date)
              .toLocaleDateString('en-NG'),
            color: '#4A9EE8',
          },
          {
            label: 'Location',
            value: event.is_online ? 'Online' : event.location,
            color: '#8B5CF6',
          },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg2)',
            border: '1px solid #252D22',
            borderRadius: 12, padding: '1rem',
          }}>
            <div style={{
              fontSize: 11, color: '#555C50',
              fontWeight: 700, letterSpacing: '0.5px',
              marginBottom: 6, textTransform: 'uppercase',
            }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 20, fontWeight: 800, color: s.color,
            }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4,
        borderBottom: '1px solid #252D22',
        marginBottom: 24,
      }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '10px 16px',
              background: 'transparent', border: 'none',
              borderBottom: activeTab === t
                ? '2px solid #E8A020' : '2px solid transparent',
              fontSize: 13, fontWeight: 600,
              color: activeTab === t ? '#E8A020' : '#555C50',
              cursor: 'pointer', fontFamily: 'inherit',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid #252D22',
            borderRadius: 12, padding: '1.5rem',
          }}>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 15, fontWeight: 700, marginBottom: 16,
            }}>
              Event Details
            </div>
            {[
              { label: 'Title', value: event.title },
              { label: 'Type', value: event.event_type },
              { label: 'Description', value: event.description },
              { label: 'Start Date', value: new Date(event.start_date).toLocaleString('en-NG') },
              { label: 'Location', value: event.is_online ? 'Online — ' + (event.online_link || 'Link TBD') : event.location },
              { label: 'Price', value: event.is_paid ? 'NGN ' + Number(event.ticket_price).toLocaleString() : 'Free' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr',
                gap: 12, marginBottom: 12,
                paddingBottom: 12,
                borderBottom: '1px solid #1C2119',
              }}>
                <span style={{ fontSize: 13, color: '#555C50', fontWeight: 600 }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 13, color: 'var(--primary)' }}>
                  {item.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registrations tab */}
      {activeTab === 'registrations' && (
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 16,
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>
              {registrations.length} total registrations
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => user?.token && fetchData(user.token)}
                style={{
                  padding: '8px 16px', background: 'transparent',
                  border: '1px solid #313D2C', borderRadius: 8,
                  fontSize: 13, color: '#9A9C8E',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                ↻ Refresh
              </button>
              <button
                onClick={handleExport}
                style={{
                  padding: '8px 16px', background: '#E8A020',
                  border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 700, color: '#090A07',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Export as CSV
              </button>
            </div>
          </div>

          {registrations.length === 0 ? (
            <div style={{
              background: 'var(--bg2)',
              border: '1px solid #252D22',
              borderRadius: 12, padding: '3rem',
              textAlign: 'center', color: '#555C50',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                No registrations yet
              </div>
              <p style={{ fontSize: 13 }}>
                Share your event link to start getting registrations.
              </p>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg2)',
              border: '1px solid #252D22',
              borderRadius: 12, overflow: 'hidden',
            }}>
              <table style={{
                width: '100%', borderCollapse: 'collapse',
                fontSize: 13,
              }}>
                <thead>
                  <tr>
                    {['Name', 'Email', 'Phone', 'Registered'].map(h => (
                      <th key={h} style={{
                        textAlign: 'left',
                        padding: '10px 16px',
                        fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        color: '#555C50',
                        borderBottom: '1px solid #252D22',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r: any) => (
                    <tr key={r.id}>
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #1C2119',
                        color: 'var(--primary)', fontWeight: 500,
                      }}>
                        {r.full_name}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #1C2119',
                        color: 'var(--muted)',
                      }}>
                        {r.email}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #1C2119',
                        color: 'var(--muted)',
                      }}>
                        {r.phone || '—'}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #1C2119',
                        color: '#555C50', fontSize: 12,
                      }}>
                        {new Date(r.registered_at)
                          .toLocaleDateString('en-NG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Analytics tab */}
      {activeTab === 'analytics' && (
        <div>
          {analyticsLoading ? (
            <div style={{
              background: 'var(--bg2)', border: '1px solid #252D22',
              borderRadius: 12, padding: '3rem', textAlign: 'center', color: '#555C50',
            }}>
              Loading analytics...
            </div>
          ) : analytics ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ background: 'var(--bg2)', border: '1px solid #252D22', borderRadius: 12, padding: '1.5rem' }}>
                <div style={{ fontSize: 11, color: '#555C50', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Total Registrations</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#34C27A' }}>{analytics.totalRegistrations}</div>
              </div>
              <div style={{ background: 'var(--bg2)', border: '1px solid #252D22', borderRadius: 12, padding: '1.5rem' }}>
                <div style={{ fontSize: 11, color: '#555C50', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Capacity Fill</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#E8A020' }}>
                  {event.max_capacity ? Math.round((analytics.totalRegistrations / event.max_capacity) * 100) + '%' : 'Unlimited'}
                </div>
                {event.max_capacity && (
                  <div style={{ height: 6, background: '#1C2119', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: Math.min(100, (analytics.totalRegistrations / event.max_capacity) * 100) + '%',
                      background: analytics.totalRegistrations >= event.max_capacity ? '#F05050' : '#E8A020',
                      borderRadius: 3,
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                )}
              </div>
              <div style={{ background: 'var(--bg2)', border: '1px solid #252D22', borderRadius: 12, padding: '1.5rem' }}>
                <div style={{ fontSize: 11, color: '#555C50', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Page Views</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#4A9EE8' }}>{analytics.pageViews}</div>
              </div>
              {analytics.last7Days && analytics.last7Days.length > 0 && (
                <div style={{ background: 'var(--bg2)', border: '1px solid #252D22', borderRadius: 12, padding: '1.5rem', gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: '#555C50', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>Registrations — Last 7 Days</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
                    {analytics.last7Days.map((d: any, i: number) => {
                      const max = Math.max(...analytics.last7Days.map((x: any) => parseInt(x.count)))
                      const h = max > 0 ? Math.round((parseInt(d.count) / max) * 64) : 4
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{ fontSize: 10, color: '#555C50' }}>{d.count}</div>
                          <div style={{ width: '100%', height: h, background: '#34C27A', borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                          <div style={{ fontSize: 9, color: '#555C50' }}>{new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: 'var(--bg2)', border: '1px solid #252D22', borderRadius: 12, padding: '3rem', textAlign: 'center', color: '#555C50' }}>
              No analytics data available yet.
            </div>
          )}
        </div>
      )}

      {/* Share tab */}
      {activeTab === 'share' && (
        <div>
          <div style={{
            background: 'var(--bg2)',
            border: '1px solid #252D22',
            borderRadius: 12, padding: '1.5rem',
            marginBottom: 20,
          }}>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 15, fontWeight: 700, marginBottom: 12,
            }}>
              Your Event Link
            </div>
            <div style={{
              display: 'flex', gap: 10,
              alignItems: 'center', flexWrap: 'wrap',
            }}>
              <div style={{
                flex: 1, background: '#1C2119',
                border: '1px solid #252D22',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 13, color: '#E8A020',
                wordBreak: 'break-all',
              }}>
                https://oppalert.vercel.app/events/{event.slug}
              </div>
              <button
                onClick={copyEventLink}
                style={{
                  padding: '10px 20px',
                  background: copied ? '#0F2E1C' : '#E8A020',
                  border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 700,
                  color: copied ? '#34C27A' : '#090A07',
                  cursor: 'pointer', fontFamily: 'inherit',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap',
          }}>
            <a 
              href={`https://twitter.com/intent/tweet?text=Join%20me%20at%20${encodeURIComponent(event.title)}%20on%20OppAlert!%20Register%20here:&url=https://oppalert.vercel.app/events/${event.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{
                padding: '10px 20px',
                background: '#1a1a2e',
                border: '1px solid #2E3530',
                borderRadius: 8, fontSize: 13,
                color: 'var(--primary)', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                Share on X/Twitter
              </button>
            </a>
            
            <a
              href={`https://wa.me/?text=${encodeURIComponent(event.title + ' — Register here: https://oppalert.vercel.app/events/' + event.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{
                padding: '10px 20px',
                background: '#0F2E1C',
                border: '1px solid #1A3D2A',
                borderRadius: 8, fontSize: 13,
                color: '#34C27A', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                Share on WhatsApp
              </button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
