import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h1
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        Page not found
      </h1>
      <p style={{ fontSize: 15, color: '#A8A89A', marginBottom: 28 }}>
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link href="/">
        <button className="btn-primary" style={{ padding: '11px 24px', fontSize: 14 }}>
          ← Back to Home
        </button>
      </Link>
    </div>
  )
}
