import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import Footer from '@/components/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import { opportunities, getFeatured } from '@/lib/data'

const stats = [
  { num: '2,400+', label: 'Opportunities' },
  { num: '48K+', label: 'Active Users' },
  { num: '54', label: 'Countries Covered' },
  { num: '98%', label: 'Verified Listings' },
]

const cats = [
  { icon: '🎓', label: 'Scholarships', count: '420 open', slug: 'scholarship' },
  { icon: '💼', label: 'Remote Jobs', count: '830 open', slug: 'job' },
  { icon: '🌍', label: 'Fellowships', count: '185 open', slug: 'fellowship' },
  { icon: '💰', label: 'Grants', count: '240 open', slug: 'grant' },
  { icon: '🔬', label: 'Internships', count: '310 open', slug: 'internship' },
  { icon: '🚀', label: 'Startup Funding', count: '92 open', slug: 'startup' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Create Account',
    desc: 'Sign up free and set your preferences — category, country, and funding type.',
  },
  {
    step: '02',
    title: 'Discover',
    desc: 'Browse verified listings or let smart filters surface the most relevant opportunities.',
  },
  {
    step: '03',
    title: 'Save & Apply',
    desc: 'Bookmark opportunities and get deadline reminders before they close.',
  },
  {
    step: '04',
    title: 'Get Alerts',
    desc: 'Premium users get instant alerts for new listings — before the crowd sees them.',
  },
]

export default function HomePage() {
  const featured = getFeatured(6)

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ padding: '70px 1.5rem 0', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        {/* Announcement pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#3D2E0A',
            border: '1px solid #4A3510',
            borderRadius: 100,
            padding: '5px 14px',
            fontSize: 12,
            fontWeight: 600,
            color: '#E8A020',
            marginBottom: 24,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8A020' }} />
          Now live — 2,400+ verified opportunities
        </div>

        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            marginBottom: 20,
          }}
        >
          Never miss an{' '}
          <br />
          <span style={{ color: '#E8A020' }}>opportunity</span> again
        </h1>

        <p
          style={{
            fontSize: 16,
            color: '#A8A89A',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto 32px',
          }}
        >
          Discover verified scholarships, remote jobs, fellowships, grants, and more — all in one
          place. Built for African students, graduates, and founders.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          <Link href="/opportunities">
            <button
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: 15, fontWeight: 700 }}
            >
              Explore Opportunities →
            </button>
          </Link>
          <Link href="/pricing">
            <button className="btn-ghost" style={{ padding: '12px 24px', fontSize: 14 }}>
              Get Free Alerts
            </button>
          </Link>
        </div>

        {/* Quick category tags */}
        <div
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52 }}
        >
          {cats.map((c) => (
            <Link key={c.slug} href={`/opportunities?cat=${c.slug}`} style={{ textDecoration: 'none' }}>
              <div className="badge badge-gray" style={{ padding: '5px 12px', cursor: 'pointer', fontSize: 12 }}>
                {c.icon} {c.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            justifyContent: 'center',
            flexWrap: 'wrap',
            paddingBottom: 52,
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#E8A020',
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED OPPORTUNITIES ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 60px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <h2 className="section-title">
            Featured <span>Opportunities</span>
          </h2>
          <Link href="/opportunities">
            <button className="btn-ghost btn-sm" style={{ fontSize: 13, padding: '6px 14px' }}>
              View all →
            </button>
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {featured.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 className="section-title">
            Browse by <span>Category</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {cats.map((c) => (
            <Link key={c.slug} href={`/opportunities?cat=${c.slug}`} style={{ textDecoration: 'none' }}>
              <div className="cat-card">
                <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: '#6A6B62' }}>{c.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 className="section-title">
            How <span>It Works</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {howItWorks.map((s) => (
            <div
              key={s.step}
              style={{ padding: '1.5rem', background: '#141710', borderRadius: 12, border: '1px solid #2E3530' }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: '#E8A020',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 14,
                  color: '#0D0F0B',
                  marginBottom: 14,
                  fontFamily: 'Syne, sans-serif',
                }}
              >
                {s.step}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#6A6B62', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section id="newsletter" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 60px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #3D2E0A, #0F1208)',
            border: '1px solid #4A3510',
            borderRadius: 16,
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          <h3
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Get weekly opportunity alerts
          </h3>
          <p style={{ fontSize: 14, color: '#A8A89A', marginBottom: 20 }}>
            Join 48,000+ students and professionals receiving curated opportunities every week.
          </p>
          <NewsletterForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}
