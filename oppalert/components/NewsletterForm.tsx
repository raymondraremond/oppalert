'use client'

export default function NewsletterForm() {
  return (
    <form
      style={{
        display: 'flex',
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid #3A4238',
        background: '#222820',
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email address..."
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          padding: '12px 16px',
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
          padding: '0 20px',
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'Syne, sans-serif',
          color: '#0D0F0B',
          cursor: 'pointer',
        }}
      >
        Subscribe
      </button>
    </form>
  )
}
