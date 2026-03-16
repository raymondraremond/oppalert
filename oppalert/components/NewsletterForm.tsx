'use client'
import { useState } from 'react'
import { Check, Send } from 'lucide-react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div
        className="animate-fade-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '14px 20px',
          background: '#0F2E1C',
          border: '1px solid #1A4A2E',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          color: '#3DAA6A',
        }}
      >
        <Check size={18} />
        You're subscribed! Check your inbox.
      </div>
    )
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email address..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          padding: '14px 16px',
          color: '#F0EDE6',
          fontSize: 14,
          outline: 'none',
          fontFamily: 'DM Sans, sans-serif',
        }}
      />
      <button
        type="submit"
        style={{
          background: '#E8A020',
          border: 'none',
          padding: '0 22px',
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'Syne, sans-serif',
          color: '#0D0F0B',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Send size={14} />
        Subscribe
      </button>
    </form>
  )
}
