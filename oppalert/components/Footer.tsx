'use client'
import Link from 'next/link'
import { Twitter, Linkedin, Instagram } from 'lucide-react'

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
            <p style={{ fontSize: 13, color: '#6A6B62', lineHeight: 1.7, marginBottom: 16 }}>
              The #1 platform for discovering verified opportunities across Africa.
              Scholarships, jobs, fellowships, grants and more.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: <Twitter size={16} />, label: 'Twitter', href: 'https://twitter.com' },
                { icon: <Linkedin size={16} />, label: 'LinkedIn', href: 'https://linkedin.com' },
                { icon: <Instagram size={16} />, label: 'Instagram', href: 'https://instagram.com' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="social-icon-link"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: '#222820',
                    border: '1px solid #2E3530',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6A6B62',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#3D2E0A';
                    (e.currentTarget as HTMLElement).style.borderColor = '#4A3510';
                    (e.currentTarget as HTMLElement).style.color = '#E8A020';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#222820';
                    (e.currentTarget as HTMLElement).style.borderColor = '#2E3530';
                    (e.currentTarget as HTMLElement).style.color = '#6A6B62';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
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
              { label: 'Newsletter', href: '/#newsletter' },
              { label: 'Mobile App', href: '/' },
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
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#E8A020')}
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
                    style={{ fontSize: 13, color: '#6A6B62', padding: '4px 0', cursor: 'pointer', transition: 'color 0.15s' }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#E8A020')}
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
              <Link 
                key={l}
                href={`/${l.toLowerCase().replace(/ /g, '-')}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{ fontSize: 13, color: '#6A6B62', padding: '4px 0', cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#E8A020')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6A6B62')}
                >
                  {l}
                </div>
              </Link>
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
            <Link href="/privacy" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span style={{ cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#A8A89A')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6A6B62')}
              >
                Privacy Policy
              </span>
            </Link>
            <Link href="/terms" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span style={{ cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#A8A89A')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6A6B62')}
              >
                Terms of Service
              </span>
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
