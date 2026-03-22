'use client'
import { useState, useEffect } from 'react'
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
  }, [])

  const fetchData = async (token: string) => {
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
  }

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

  const tabs = ['overview', 'registrations', 'share']

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
            <span style={{
              background: event.is_published ? '#0F2E1C' : '#1C2119',
              color: event.is_published ? '#34C27A' : '#9A9C8E',
              padding: '3px 12px', borderRadius: 100,
              fontSize: 12, fontWeight: 600,
            }}>
              {event.is_published ? 'Published' : 'Draft'}
            </span>
            <span style={{
              background: '#1C2119', color: '#9A9C8E',
              padding: '3px 12px', borderRadius: 100,
              fontSize: 12, textTransform: 'capitalize',
            }}>
              {event.event_type}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleExport}
            style={{
              padding: '9px 18px', background: 'transparent',
              border: '1px solid #313D2C', borderRadius: 8,
              fontSize: 13, color: '#9A9C8E',
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
            background: '#141710',
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
            background: '#141710',
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
                <span style={{ fontSize: 13, color: '#EDE8DF' }}>
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
            <div style={{ fontSize: 14, color: '#9A9C8E' }}>
              {registrations.length} total registrations
            </div>
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

          {registrations.length === 0 ? (
            <div style={{
              background: '#141710',
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
              background: '#141710',
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
                        color: '#EDE8DF', fontWeight: 500,
                      }}>
                        {r.full_name}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #1C2119',
                        color: '#9A9C8E',
                      }}>
                        {r.email}
                      </td>
                      <td style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #1C2119',
                        color: '#9A9C8E',
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

      {/* Share tab */}
      {activeTab === 'share' && (
        <div>
          <div style={{
            background: '#141710',
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
                color: '#EDE8DF', cursor: 'pointer',
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
