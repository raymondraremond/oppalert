'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateEventPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: 'bootcamp',
    location: '',
    isOnline: false,
    onlineLink: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxCapacity: '',
    isPaid: false,
    ticketPrice: '',
    tags: '',
    isPublished: false,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (!stored) {
        router.push('/login?next=/organizer/create')
        return
      }
      const parsed = JSON.parse(stored)
      if (!parsed?.token) {
        router.push('/login?next=/organizer/create')
        return
      }
      setUser(parsed)
    } catch {
      router.push('/login?next=/organizer/create')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement
    const value = target.type === 'checkbox' 
      ? target.checked 
      : target.value
    setForm(prev => ({ ...prev, [target.name]: value }))
  }

  const handleSubmit = async (isPublished: boolean) => {
    setError('')
    setSubmitting(true)

    try {
      if (!form.title.trim()) {
        setError('Event title is required')
        setSubmitting(false)
        return
      }
      if (!form.startDate) {
        setError('Start date is required')
        setSubmitting(false)
        return
      }

      const token = user?.token
      if (!token) {
        setError('You must be logged in to create an event')
        setSubmitting(false)
        return
      }

      const res = await fetch('/api/organizer/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          isPublished,
          tags: form.tags
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create event. Please try again.')
        return
      }

      setSuccess({
        slug: data.slug,
        title: data.title,
        published: isPublished,
      })
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Create event error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#555C50', fontSize: 14,
      }}>
        Loading...
      </div>
    )
  }

  if (!user) return null

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{
          background: '#141710',
          border: '1px solid #252D22',
          borderRadius: 16, padding: '2.5rem',
          maxWidth: 500, width: '100%',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 22, fontWeight: 800,
            marginBottom: 8,
          }}>
            {success.published 
              ? 'Event Published!' 
              : 'Event Saved as Draft!'}
          </h2>
          <p style={{
            fontSize: 14, color: '#9A9C8E',
            marginBottom: 24, lineHeight: 1.7,
          }}>
            {success.published
              ? 'Your event is now live and accepting registrations.'
              : 'Your event has been saved. Publish it when ready.'}
          </p>

          {success.published && (
            <div style={{
              background: '#0F1210',
              border: '1px solid #252D22',
              borderRadius: 10, padding: '12px',
              marginBottom: 20,
            }}>
              <div style={{
                fontSize: 11, color: '#555C50',
                marginBottom: 6, fontWeight: 700,
                letterSpacing: '0.5px',
              }}>
                YOUR EVENT LINK
              </div>
              <div style={{
                fontSize: 13, color: '#E8A020',
                wordBreak: 'break-all',
              }}>
                oppalert.vercel.app/events/{success.slug}
              </div>
              <button
                onClick={async () => {
                  const url = `https://oppalert.vercel.app/events/${success.slug}`
                  try {
                    await navigator.clipboard.writeText(url)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  } catch {
                    // Fallback for browsers that block clipboard
                    const el = document.createElement('textarea')
                    el.value = url
                    document.body.appendChild(el)
                    el.select()
                    document.execCommand('copy')
                    document.body.removeChild(el)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }
                }}
                style={{
                  marginTop: 10, padding: '6px 16px',
                  background: copied ? '#0F2E1C' : '#E8A020',
                  border: 'none', borderRadius: 6,
                  fontSize: 12, fontWeight: 700,
                  color: copied ? '#34C27A' : '#090A07',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link href="/organizer" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '10px 20px', background: '#E8A020',
                border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 700,
                color: '#090A07', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                View Dashboard
              </button>
            </Link>
            <button
              onClick={() => {
                setSuccess(null)
                setForm({
                  title: '',
                  description: '',
                  eventType: 'bootcamp',
                  location: '',
                  isOnline: false,
                  onlineLink: '',
                  startDate: '',
                  endDate: '',
                  registrationDeadline: '',
                  maxCapacity: '',
                  isPaid: false,
                  ticketPrice: '',
                  tags: '',
                  isPublished: false,
                })
              }}
              style={{
                padding: '10px 20px', background: 'transparent',
                border: '1px solid #313D2C', borderRadius: 8,
                fontSize: 13, color: '#9A9C8E',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: '#1C2119',
    border: '1px solid #252D22',
    borderRadius: 8, color: '#EDE8DF',
    fontSize: 14, outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block', fontSize: 12,
    fontWeight: 700, color: '#9A9C8E',
    marginBottom: 6, letterSpacing: '0.3px',
  }

  return (
    <div style={{
      maxWidth: 700, margin: '0 auto',
      padding: '40px 1.5rem 80px',
    }}>
      <Link href="/organizer" style={{
        textDecoration: 'none', color: '#555C50',
        fontSize: 13, display: 'inline-flex',
        alignItems: 'center', gap: 4, marginBottom: 24,
      }}>
        ← Back to Dashboard
      </Link>

      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 26, fontWeight: 800, marginBottom: 6,
      }}>
        Create New <span style={{ color: '#E8A020' }}>Event</span>
      </h1>
      <p style={{ fontSize: 14, color: '#555C50', marginBottom: 32 }}>
        Fill in the details below to create your event.
      </p>

      {error && (
        <div style={{
          background: '#1A0808',
          border: '1px solid rgba(240,80,80,0.3)',
          borderRadius: 10, padding: '12px 16px',
          color: '#F05050', fontSize: 14, marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Title */}
        <div>
          <label style={labelStyle}>Event Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Data Science Bootcamp Lagos 2025"
            style={inputStyle}
          />
        </div>

        {/* Type */}
        <div>
          <label style={labelStyle}>Event Type *</label>
          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="bootcamp">Bootcamp</option>
            <option value="workshop">Workshop</option>
            <option value="webinar">Webinar</option>
            <option value="meetup">Meetup</option>
            <option value="conference">Conference</option>
            <option value="hackathon">Hackathon</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your event..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Dates */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 16,
        }}>
          <div>
            <label style={labelStyle}>Start Date & Time *</label>
            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>End Date & Time</label>
            <input
              type="datetime-local"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Registration Deadline */}
        <div>
          <label style={labelStyle}>Registration Deadline</label>
          <input
            type="datetime-local"
            name="registrationDeadline"
            value={form.registrationDeadline}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Location */}
        <div>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 14, cursor: 'pointer', marginBottom: 12,
          }}>
            <input
              type="checkbox"
              name="isOnline"
              checked={form.isOnline}
              onChange={handleChange}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ fontWeight: 600 }}>
              {"This is an online event"}
            </span>
          </label>

          {form.isOnline ? (
            <div>
              <label style={labelStyle}>Online Link</label>
              <input
                name="onlineLink"
                value={form.onlineLink}
                onChange={handleChange}
                placeholder="https://zoom.us/j/..."
                style={inputStyle}
              />
            </div>
          ) : (
            <div>
              <label style={labelStyle}>Location / Venue</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Lagos Business School, Victoria Island"
                style={inputStyle}
              />
            </div>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label style={labelStyle}>Max Capacity</label>
          <input
            type="number"
            name="maxCapacity"
            value={form.maxCapacity}
            onChange={handleChange}
            placeholder="Leave empty for unlimited"
            style={inputStyle}
          />
        </div>

        {/* Pricing */}
        <div>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 14, cursor: 'pointer', marginBottom: 12,
          }}>
            <input
              type="checkbox"
              name="isPaid"
              checked={form.isPaid}
              onChange={handleChange}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ fontWeight: 600 }}>
              {"This is a paid event"}
            </span>
          </label>

          {form.isPaid && (
            <div>
              <label style={labelStyle}>Ticket Price (NGN)</label>
              <input
                type="number"
                name="ticketPrice"
                value={form.ticketPrice}
                onChange={handleChange}
                placeholder="e.g. 5000"
                style={inputStyle}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Python, Machine Learning, Data (comma-separated)"
            style={inputStyle}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            style={{
              flex: 1, padding: '13px',
              background: 'transparent',
              border: '1px solid #313D2C',
              borderRadius: 10, fontSize: 14,
              fontWeight: 600, color: '#9A9C8E',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            style={{
              flex: 1, padding: '13px',
              background: submitting ? '#9A7010' : '#E8A020',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 700,
              color: '#090A07',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {submitting ? 'Publishing...' : 'Publish Now →'}
          </button>
        </div>
      </div>
    </div>
  )
}
