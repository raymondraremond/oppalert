import Link from 'next/link'

export default function PremiumBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #3D2E0A, #0F1208)',
        border: '1px solid #4A3510',
        borderRadius: 12,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#E8A020', marginBottom: 2 }}>
          ⚡ Go Premium
        </div>
        <p style={{ fontSize: 13, color: '#A8A89A', margin: 0 }}>
          Get <strong style={{ color: '#E8A020' }}>instant alerts</strong> for new listings before
          free users. Early access, unlimited saves.
        </p>
      </div>
      <Link href="/pricing">
        <button
          className="btn-primary"
          style={{ padding: '7px 16px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          Upgrade ₦1,500/mo
        </button>
      </Link>
    </div>
  )
}
