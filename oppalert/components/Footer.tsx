'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #2E3530',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 32,
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 18,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              Opp<span style={{ color: '#E8A020' }}>Alert</span>
            </div>
            <p style={{ fontSize: 13, color: '#6A6B62', lineHeight: 1.7 }}>
              The #1 platform for discovering verified opportunities across Africa.
              Scholarships, jobs, fellowships, grants and more.
            </p>
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#6A6B62',
                marginBottom: 12,
              }}
            >
              Product
            </div>
            {[
              { label: 'Opportunities', href: '/opportunities' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Newsletter', href: '#newsletter' },
              { label: 'Mobile App', href: '#' },
            ].map((l) => (
              <Link key={l.label} href={l.href} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    fontSize: 13,
                    color: '#6A6B62',
                    padding: '4px 0',
                    cursor: 'pointer',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#A8A89A')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6A6B62')}
                >
                  {l.label}
                </div>
              </Link>
            ))}
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#6A6B62',
                marginBottom: 12,
              }}
            >
              Categories
            </div>
            {['Scholarships', 'Remote Jobs', 'Fellowships', 'Grants & Funding', 'Internships'].map(
              (l) => (
                <Link
                  key={l}
                  href={`/opportunities?cat=${l.toLowerCase().replace(' & ', '_').replace(' ', '_')}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{ fontSize: 13, color: '#6A6B62', padding: '4px 0', cursor: 'pointer' }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#A8A89A')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6A6B62')}
                  >
                    {l}
                  </div>
                </Link>
              )
            )}
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#6A6B62',
                marginBottom: 12,
              }}
            >
              Company
            </div>
            {['About', 'Blog', 'Post an Opportunity', 'Contact'].map((l) => (
              <div
                key={l}
                style={{ fontSize: 13, color: '#6A6B62', padding: '4px 0', cursor: 'pointer' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#A8A89A')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6A6B62')}
              >
                {l}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 20,
            borderTop: '1px solid #2E3530',
            fontSize: 12,
            color: '#6A6B62',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span>© {new Date().getFullYear()} OppAlert. All rights reserved.</span>
          <span style={{ display: 'flex', gap: 16 }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
