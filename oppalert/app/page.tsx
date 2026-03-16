'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import Footer from '@/components/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import { opportunities, getFeatured } from '@/lib/data'
import {
  GraduationCap,
  Briefcase,
  Globe,
  Coins,
  FlaskConical,
  Rocket,
  UserPlus,
  Search,
  Bookmark,
  Bell,
  ArrowRight,
} from 'lucide-react'

const stats = [
  { num: '2,400+', label: 'Opportunities' },
  { num: '48K+', label: 'Active Users' },
  { num: '54', label: 'Countries Covered' },
  { num: '98%', label: 'Verified Listings' },
]

const catIcons: Record<string, React.FC<any>> = {
  scholarship: GraduationCap,
  job: Briefcase,
  fellowship: Globe,
  grant: Coins,
  internship: FlaskConical,
  startup: Rocket,
}

const cats = [
  { icon: 'scholarship', label: 'Scholarships', count: '420 open', slug: 'scholarship' },
  { icon: 'job', label: 'Remote Jobs', count: '830 open', slug: 'job' },
  { icon: 'fellowship', label: 'Fellowships', count: '185 open', slug: 'fellowship' },
  { icon: 'grant', label: 'Grants', count: '240 open', slug: 'grant' },
  { icon: 'internship', label: 'Internships', count: '310 open', slug: 'internship' },
  { icon: 'startup', label: 'Startup Funding', count: '92 open', slug: 'startup' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Create Account',
    desc: 'Sign up free and set your preferences — category, country, and funding type.',
    icon: UserPlus,
  },
  {
    step: '02',
    title: 'Discover',
    desc: 'Browse verified listings or let smart filters surface the most relevant opportunities.',
    icon: Search,
  },
  {
    step: '03',
    title: 'Save & Apply',
    desc: 'Bookmark opportunities and get deadline reminders before they close.',
    icon: Bookmark,
  },
  {
    step: '04',
    title: 'Get Alerts',
    desc: 'Premium users get instant alerts for new listings — before the crowd sees them.',
    icon: Bell,
  },
]

export default function HomePage() {
  const featured = getFeatured(6)
  const revealRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {/* ── HERO ── */}
      <section
        style={{
          padding: '60px 1.5rem 0',
          maxWidth: 900,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div className="hero-glow" />

        {/* Announcement pill */}
        <div
          className="animate-fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #3D2E0A, #2A2008)',
            border: '1px solid #4A3510',
            borderRadius: 100,
            padding: '6px 16px',
            fontSize: 12,
            fontWeight: 600,
            color: '#E8A020',
            marginBottom: 28,
            position: 'relative',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#E8A020',
              boxShadow: '0 0 8px rgba(232,160,32,0.6)',
            }}
          />
          Now live — 2,400+ verified opportunities
        </div>

        <h1
          className="animate-fade-up animate-delay-100"
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-2px',
            marginBottom: 20,
            position: 'relative',
          }}
        >
          Never miss an{' '}
          <br />
          <span
            style={{
              color: '#E8A020',
              textShadow: '0 0 40px rgba(232,160,32,0.2)',
            }}
          >
            opportunity
          </span>{' '}
          again
        </h1>

        <p
          className="animate-fade-up animate-delay-200"
          style={{
            fontSize: 17,
            color: '#A8A89A',
            lineHeight: 1.7,
            maxWidth: 540,
            margin: '0 auto 36px',
          }}
        >
          Discover verified scholarships, remote jobs, fellowships, grants, and more — all in one
          place. Built for African students, graduates, and founders.
        </p>

        <div
          className="animate-fade-up animate-delay-300"
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 44,
          }}
        >
          <Link href="/opportunities">
            <button
              className="btn-primary"
              style={{ padding: '13px 28px', fontSize: 15, fontWeight: 700, gap: 8 }}
            >
              Explore Opportunities
              <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/pricing">
            <button className="btn-ghost" style={{ padding: '13px 28px', fontSize: 14, gap: 8 }}>
              <Bell size={15} />
              Get Free Alerts
            </button>
          </Link>
        </div>

        {/* Quick category tags */}
        <div
          className="animate-fade-up animate-delay-400"
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 56,
          }}
        >
          {cats.map((c) => {
            const Icon = catIcons[c.icon]
            return (
              <Link
                key={c.slug}
                href={`/opportunities?cat=${c.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="badge badge-gray"
                  style={{
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: 12,
                    gap: 5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={13} />
                  {c.label}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Stats */}
        <div
          className="animate-fade-up animate-delay-500"
          style={{
            display: 'flex',
            gap: 40,
            justifyContent: 'center',
            flexWrap: 'wrap',
            paddingBottom: 56,
          }}
        >
          {stats.map((s, i) => (
            <div key={s.label} className="stat-item">
              <div
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 34,
                  fontWeight: 800,
                  color: '#E8A020',
                  textShadow: '0 0 20px rgba(232,160,32,0.15)',
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 4, fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED OPPORTUNITIES ── */}
      <section
        className="reveal"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 64px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <h2 className="section-title" style={{ fontSize: 22 }}>
            Featured <span>Opportunities</span>
          </h2>
          <Link href="/opportunities">
            <button
              className="btn-ghost btn-sm"
              style={{ fontSize: 13, padding: '6px 14px', gap: 4 }}
            >
              View all
              <ArrowRight size={14} />
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
      <section
        className="reveal"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 64px' }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 className="section-title" style={{ fontSize: 22 }}>
            Browse by <span>Category</span>
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          {cats.map((c) => {
            const Icon = catIcons[c.icon]
            return (
              <Link
                key={c.slug}
                href={`/opportunities?cat=${c.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="cat-card">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #3D2E0A, #2A2008)',
                      border: '1px solid #4A3510',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                    }}
                  >
                    <Icon size={22} style={{ color: '#E8A020' }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: '#6A6B62' }}>{c.count}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="reveal"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 64px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="section-title" style={{ fontSize: 22 }}>
            How <span>It Works</span>
          </h2>
          <p style={{ fontSize: 14, color: '#6A6B62', marginTop: 8 }}>
            Four simple steps to never miss an opportunity
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {howItWorks.map((s) => {
            const StepIcon = s.icon
            return (
              <div key={s.step} className="step-card">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: 'linear-gradient(135deg, #E8A020, #C87020)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    boxShadow: '0 4px 12px rgba(232,160,32,0.25)',
                  }}
                >
                  <StepIcon size={20} style={{ color: '#0D0F0B' }} />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#E8A020',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                    fontFamily: 'Syne, sans-serif',
                  }}
                >
                  Step {s.step}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#6A6B62', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── USER REVIEWS ── */}
      <section
        className="reveal"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 64px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="section-title" style={{ fontSize: 22 }}>
            Loved by <span>Thousands</span>
          </h2>
          <p style={{ fontSize: 14, color: '#6A6B62', marginTop: 8 }}>
            See what our users say about OppAlert
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {[
            {
              name: 'Chioma Eze',
              initials: 'CE',
              role: 'Final Year Student, UNILAG',
              stars: 5,
              text: 'OppAlert helped me discover the Chevening Scholarship weeks before my classmates even heard about it. The instant alerts are a game-changer — I got my application in early and was selected!',
              color: '#3DAA6A',
            },
            {
              name: 'Kwame Asante',
              initials: 'KA',
              role: 'Software Engineer, Accra',
              stars: 5,
              text: "I've landed two remote job offers through opportunities I found here. The filtering is excellent — I only see roles that actually match my skills and location preferences. Best career tool I've used.",
              color: '#4A9EE8',
            },
            {
              name: 'Fatima Al-Hassan',
              initials: 'FA',
              role: 'Startup Founder, Nairobi',
              stars: 5,
              text: 'As a founder, finding grant funding used to take hours of research. OppAlert consolidates everything in one place. The premium plan paid for itself 100x over with the grants we secured.',
              color: '#E8A020',
            },
          ].map((review) => (
            <div
              key={review.name}
              style={{
                background: 'linear-gradient(145deg, #171A13, #141710)',
                border: '1px solid #2E3530',
                borderRadius: 16,
                padding: '1.5rem',
                transition: 'all 0.3s',
                position: 'relative',
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                {Array.from({ length: review.stars }).map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#E8A020"
                    stroke="none"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: 13,
                  color: '#A8A89A',
                  lineHeight: 1.8,
                  marginBottom: 18,
                  fontStyle: 'italic',
                }}
              >
                "{review.text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: `${review.color}20`,
                    border: `2px solid ${review.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: review.color,
                    fontFamily: 'Syne, sans-serif',
                    flexShrink: 0,
                  }}
                >
                  {review.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{review.name}</div>
                  <div style={{ fontSize: 11, color: '#6A6B62' }}>{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section
        id="newsletter"
        className="reveal"
        style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 64px' }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #3D2E0A, #1A1208, #0F1208)',
            border: '1px solid #4A3510',
            borderRadius: 20,
            padding: '3rem 2.5rem',
            textAlign: 'center',
            maxWidth: 580,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle glow overlay */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 300,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232,160,32,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #E8A020, #C87020)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 16px rgba(232,160,32,0.3)',
              }}
            >
              <Bell size={22} style={{ color: '#0D0F0B' }} />
            </div>
            <h3
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 8,
              }}
            >
              Get weekly opportunity alerts
            </h3>
            <p style={{ fontSize: 14, color: '#A8A89A', marginBottom: 24 }}>
              Join 48,000+ students and professionals receiving curated opportunities every week.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
