import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function PremiumBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #3D2E0A, #1A1208, #0F1208)',
        border: '1px solid #4A3510',
        borderRadius: 14,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#E8A020', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={14} />
          Go Premium
        </div>
        <p style={{ fontSize: 13, color: '#A8A89A', margin: 0 }}>
          Get <strong style={{ color: '#E8A020' }}>instant alerts</strong> for new listings before
          free users. Early access, unlimited saves.
        </p>
      </div>
      <Link href="/pricing">
        <button
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          Upgrade ₦1,500/mo
        </button>
      </Link>
    </div>
  )
}
