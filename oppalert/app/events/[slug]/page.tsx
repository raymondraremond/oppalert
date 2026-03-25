'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [regForm, setRegForm] = useState({
    fullName: '', email: '', phone: '',
  })
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)

  // Fire-and-forget view tracking
  useEffect(() => {
    if (!slug || slug.startsWith('sample-')) return
    fetch(`/api/events/${slug}/view`, { method: 'POST' }).catch(() => {})
  }, [slug])

  useEffect(() => {
    if (!slug) return

    // Handle sample events
    if (slug.startsWith('sample-')) {
      setEvent({
        title: slug.replace('sample-', '').replace(/-/g, ' '),
        description: 'Sample event description',
        event_type: 'bootcamp',
        start_date: new Date().toISOString(),
        location: 'Lagos, Nigeria',
        is_online: false,
        max_capacity: 100,
        current_registrations: 0,
        is_paid: false,
        ticket_price: 0,
        organizer_name: 'OppFetch',
        is_published: true,
        slug,
      })
      setLoading(false)
      return
    }

    // Fetch real event
    fetch(`/api/events/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.data) {
          setEvent(data.data)
        } else {
          setError('Event not found')
        }
      })
      .catch(() => setError('Failed to load event'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    setRegLoading(true)

    try {
      if (!regForm.fullName || !regForm.email) {
        setRegError('Name and email are required')
        return
      }

      const res = await fetch(
        `/api/events/${slug}/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: regForm.fullName,
            email: regForm.email,
            phone: regForm.phone,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setRegError(data.error || 'Registration failed')
        return
      }

      setRegSuccess(true)
    } catch {
      setRegError('Something went wrong. Please try again.')
    } finally {
      setRegLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#555C50',
      }}>
        Loading event...
      </div>
    )
  }

  if (error || !event) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: '#555C50', gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>🎪</div>
        <div>Event not found</div>
        <Link href="/events">
          <button style={{
            padding: '10px 20px', background: '#E8A020',
            border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 700,
            color: '#090A07', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Browse Events
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: 1000, margin: '0 auto',
      padding: '40px 1.5rem 80px',
    }}>
      <Link href="/events" style={{
        textDecoration: 'none', color: '#555C50',
        fontSize: 13, display: 'inline-flex',
        alignItems: 'center', gap: 4, marginBottom: 24,
      }}>
        ← All Events
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 32, alignItems: 'start',
      }}>

        {/* Left — Event details */}
        <div>
          <div style={{
            display: 'inline-flex', padding: '3px 10px',
            borderRadius: 100, marginBottom: 16,
            background: '#2A1E0622', color: '#E8A020',
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>
            {event.event_type}
          </div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(22px, 4vw, 36px)',
            fontWeight: 800, marginBottom: 8,
            lineHeight: 1.2,
          }}>
            {event.title}
          </h1>

          <div style={{
            fontSize: 14, color: '#555C50', marginBottom: 24,
          }}>
            Organized by {event.organizer_name || 'OppFetch'}
          </div>

          <div style={{
            display: 'flex', flexWrap: 'wrap',
            gap: 12, marginBottom: 28,
          }}>
            {[
              { icon: '📅', text: new Date(event.start_date || new Date()).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
              { icon: event.is_online ? '🌐' : '📍', text: event.is_online ? 'Online' : event.location },
              { icon: '👥', text: event.max_capacity ? (event.max_capacity - (event.current_registrations || 0)) + ' spots left' : 'Unlimited spots' },
              { icon: '💰', text: event.is_paid ? 'NGN ' + Number(event.ticket_price).toLocaleString() : 'Free' },
            ].map(chip => (
              <div key={chip.text} style={{
                background: 'var(--bg2)',
                border: '1px solid #252D22',
                borderRadius: 8, padding: '6px 14px',
                fontSize: 13, color: 'var(--muted)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {chip.icon} {chip.text}
              </div>
            ))}
          </div>

          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 16, fontWeight: 700, marginBottom: 12,
          }}>
            About this event
          </div>
          <p style={{
            fontSize: 14, color: 'var(--muted)',
            lineHeight: 1.8,
          }}>
            {event.description}
          </p>
        </div>

        {/* Right — Registration card */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid #252D22',
          borderRadius: 16, padding: '1.5rem',
          position: 'sticky', top: 80,
        }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 18, fontWeight: 800, marginBottom: 16,
          }}>
            {event.is_paid
              ? 'NGN ' + Number(event.ticket_price).toLocaleString()
              : 'Free Event'}
          </div>

          {regSuccess ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 16, fontWeight: 700,
                color: '#34C27A', marginBottom: 8,
              }}>
                Registration Confirmed!
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                Check your email for confirmation details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              {regError && (
                <div style={{
                  background: '#1A0808',
                  border: '1px solid rgba(240,80,80,0.3)',
                  borderRadius: 8, padding: '10px 14px',
                  color: '#F05050', fontSize: 13,
                  marginBottom: 14,
                }}>
                  {regError}
                </div>
              )}

              {[
                { name: 'fullName', placeholder: 'Full Name', type: 'text' },
                { name: 'email', placeholder: 'Email Address', type: 'email' },
                { name: 'phone', placeholder: 'Phone Number (optional)', type: 'tel' },
              ].map(field => (
                <input
                  key={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={regForm[field.name as keyof typeof regForm]}
                  onChange={e => setRegForm(prev => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))}
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: '#1C2119',
                    border: '1px solid #252D22',
                    borderRadius: 8, color: 'var(--primary)',
                    fontSize: 14, outline: 'none',
                    fontFamily: 'inherit', marginBottom: 10,
                    boxSizing: 'border-box',
                  }}
                />
              ))}

              <button
                type="submit"
                disabled={regLoading}
                style={{
                  width: '100%', padding: '13px',
                  background: regLoading ? '#9A7010' : '#E8A020',
                  border: 'none', borderRadius: 10,
                  fontSize: 14, fontWeight: 700,
                  color: '#090A07',
                  cursor: regLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', marginTop: 4,
                }}
              >
                {regLoading ? 'Registering...' : 'Register Now →'}
              </button>

              <p style={{
                fontSize: 11, color: '#555C50',
                textAlign: 'center', marginTop: 10,
              }}>
                Free registration · No credit card needed
              </p>
            </form>
          )}
        </div>

        {/* Share bar — below registration card */}
        <div style={{
          background: '#141710',
          border: '1px solid #252D22',
          borderRadius: 12,
          padding: '1rem',
          marginTop: 12,
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: '#555C50',
            marginBottom: 10, letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}>
            Share this event
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const url = window.location.href
                navigator.clipboard.writeText(url)
                  .then(() => {
                    const btn = document.getElementById('copyBtn')
                    if (btn) {
                      btn.textContent = 'Copied!'
                      btn.style.color = '#34C27A'
                      setTimeout(() => {
                        btn.textContent = 'Copy Link'
                        btn.style.color = '#9A9C8E'
                      }, 2000)
                    }
                  })
                  .catch(() => {})
              }}
              id="copyBtn"
              style={{
                padding: '7px 14px', background: 'transparent',
                border: '1px solid #252D22', borderRadius: 8,
                fontSize: 12, color: '#9A9C8E',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Copy Link
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this event on OppFetch!')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{
                padding: '7px 14px', background: 'transparent',
                border: '1px solid #252D22', borderRadius: 8,
                fontSize: 12, color: '#9A9C8E',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Share on X
              </button>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('Check out this event: ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button style={{
                padding: '7px 14px', background: 'transparent',
                border: '1px solid #1A3D2A', borderRadius: 8,
                fontSize: 12, color: '#34C27A',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Share on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
