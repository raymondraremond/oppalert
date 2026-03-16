import Link from 'next/link'
import { SearchX, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #222820, #1A1F15)',
            border: '1px solid #2E3530',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <SearchX size={36} style={{ color: '#6A6B62' }} />
        </div>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            fontSize: 15,
            color: '#6A6B62',
            maxWidth: 380,
            margin: '0 auto 28px',
            lineHeight: 1.7,
          }}
        >
          The page you're looking for doesn't exist or has been moved. Try browsing our opportunities instead.
        </p>
        <Link href="/">
          <button
            className="btn-primary"
            style={{ padding: '13px 28px', fontSize: 14, fontWeight: 700, gap: 8 }}
          >
            Go Back Home
            <ArrowRight size={15} />
          </button>
        </Link>
      </div>
    </div>
  )
}
