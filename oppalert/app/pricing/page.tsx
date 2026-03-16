'use client'
import { useState } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { Check, Minus, Zap, ChevronDown, ArrowRight } from 'lucide-react'

const freeFeatures = [
  { label: 'Browse all listings', included: true },
  { label: 'Save up to 5 opportunities', included: true },
  { label: 'Weekly email digest', included: true },
  { label: 'Basic filters', included: true },
  { label: 'Instant alerts', included: false },
  { label: 'Early access listings (24h ahead)', included: false },
  { label: 'Advanced filters & search', included: false },
  { label: 'Deadline SMS reminders', included: false },
]

const premiumFeatures = [
  { label: 'Everything in Free', included: true },
  { label: 'Instant alerts — before the crowd', included: true, bold: true },
  { label: 'Early access listings (24h ahead)', included: true },
  { label: 'Unlimited saved opportunities', included: true },
  { label: 'Advanced filters & search', included: true },
  { label: 'Deadline SMS reminders', included: true },
  { label: 'Priority support', included: true },
]

const faqs = [
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards via Stripe. Nigerian users can also pay via Paystack in Naira (₦1,500/month).',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, absolutely. Cancel from your dashboard at any time with no hidden fees. You keep access until the end of your billing period.',
  },
  {
    q: 'What does "early access" mean?',
    a: 'Premium users see new opportunities 24 hours before they appear to free users. Many high-demand listings fill fast — being first matters.',
  },
  {
    q: 'Is there a student discount?',
    a: "We already offer one of the lowest prices in the industry. We're exploring additional discounts — join our newsletter to be notified.",
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div
            className="animate-fade-up"
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
              marginBottom: 20,
            }}
          >
            <Zap size={12} />
            Simple pricing, powerful features
          </div>
          <h1
            className="animate-fade-up animate-delay-100"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              marginBottom: 12,
            }}
          >
            Simple, <span style={{ color: '#E8A020' }}>honest</span> pricing
          </h1>
          <p className="animate-fade-up animate-delay-200" style={{ fontSize: 15, color: '#A8A89A' }}>
            Start for free. Upgrade when you need more power.
          </p>
        </div>

        {/* Plans */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 48,
          }}
        >
          {/* FREE */}
          <div
            className="animate-fade-up animate-delay-200"
            style={{
              background: 'linear-gradient(145deg, #171A13, #141710)',
              border: '1px solid #2E3530',
              borderRadius: 20,
              padding: '2rem',
            }}
          >
            <span className="badge badge-gray">Free</span>
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 44,
                fontWeight: 800,
                margin: '16px 0 4px',
              }}
            >
              $0
              <span style={{ fontSize: 16, fontWeight: 400, color: '#6A6B62' }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: '#6A6B62', marginBottom: 24 }}>
              For casual opportunity seekers
            </p>
            {freeFeatures.map((f) => (
              <div
                key={f.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid #1A1F15',
                  fontSize: 13,
                  color: f.included ? '#A8A89A' : '#4A4B42',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: f.included ? 'rgba(61,170,106,0.15)' : 'transparent',
                  }}
                >
                  {f.included ? (
                    <Check size={12} style={{ color: '#3DAA6A' }} />
                  ) : (
                    <Minus size={12} style={{ color: '#4A4B42' }} />
                  )}
                </span>
                {f.label}
              </div>
            ))}
            <Link href="/login">
              <button
                className="btn-ghost"
                style={{ width: '100%', marginTop: 24, padding: '12px', fontSize: 14, gap: 6 }}
              >
                Get Started Free
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          {/* PREMIUM */}
          <div
            className="animate-fade-up animate-delay-300"
            style={{
              background: 'linear-gradient(145deg, #1A1508, #141710)',
              border: '2px solid #4A3510',
              borderRadius: 20,
              padding: '2rem',
              position: 'relative',
              boxShadow: '0 0 30px rgba(232,160,32,0.06)',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 0 }}>
              <span className="badge badge-amber">Premium</span>
              <span className="badge badge-green">Most Popular</span>
            </div>
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 44,
                fontWeight: 800,
                color: '#E8A020',
                margin: '16px 0 4px',
              }}
            >
              $3
              <span style={{ fontSize: 16, fontWeight: 400, color: '#6A6B62' }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: '#6A6B62', marginBottom: 24 }}>
              or ₦1,500/month · billed monthly
            </p>
            {premiumFeatures.map((f) => (
              <div
                key={f.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid #1A1F15',
                  fontSize: 13,
                  color: '#A8A89A',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(61,170,106,0.15)',
                  }}
                >
                  <Check size={12} style={{ color: '#3DAA6A' }} />
                </span>
                <span style={(f as any).bold ? { color: '#F0EDE6', fontWeight: 600 } : {}}>
                  {f.label}
                </span>
              </div>
            ))}
            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: 24, padding: '13px', fontSize: 15, fontWeight: 700, gap: 6 }}
            >
              Upgrade to Premium
              <ArrowRight size={15} />
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#6A6B62', marginTop: 10 }}>
              Cancel anytime. No commitments.
            </p>
          </div>
        </div>

        {/* For Organizations */}
        <div
          style={{
            background: 'linear-gradient(145deg, #171A13, #141710)',
            border: '1px solid #2E3530',
            borderRadius: 20,
            padding: '2rem',
            display: 'flex',
            gap: 32,
            alignItems: 'center',
            marginBottom: 60,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1 }}>
            <span className="badge badge-blue" style={{ marginBottom: 12, display: 'inline-flex' }}>
              For Organizations
            </span>
            <h3
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 20,
                fontWeight: 800,
                marginBottom: 8,
              }}
            >
              Post an Opportunity
            </h3>
            <p style={{ fontSize: 13, color: '#6A6B62', lineHeight: 1.7 }}>
              Reach 48,000+ qualified students, graduates, and professionals across Africa. Featured
              listing packages include homepage placement, email blast, and priority visibility.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              {[
                { name: 'Basic Featured', price: '$25', desc: '7-day category highlight' },
                { name: 'Homepage Featured', price: '$75', desc: 'Homepage slot + 7 days' },
                { name: 'Premium Highlight', price: '$150', desc: 'Banner + email blast + 14 days' },
              ].map((pkg) => (
                <div
                  key={pkg.name}
                  style={{
                    background: '#222820',
                    border: '1px solid #2E3530',
                    borderRadius: 12,
                    padding: '12px 16px',
                    minWidth: 140,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 12, color: '#6A6B62', marginBottom: 4 }}>{pkg.name}</div>
                  <div
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 20,
                      fontWeight: 800,
                      color: '#E8A020',
                    }}
                  >
                    {pkg.price}
                  </div>
                  <div style={{ fontSize: 11, color: '#6A6B62', marginTop: 2 }}>{pkg.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn-ghost" style={{ padding: '10px 20px', fontSize: 13, whiteSpace: 'nowrap', gap: 6 }}>
            Post a listing
            <ArrowRight size={14} />
          </button>
        </div>

        {/* FAQ - Accordion */}
        <div>
          <h2
            className="section-title"
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            Frequently Asked <span>Questions</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 640, margin: '0 auto' }}>
            {faqs.map((f, i) => (
              <div key={f.q} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: '#6A6B62',
                      transition: 'transform 0.2s',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                      flexShrink: 0,
                    }}
                  />
                </div>
                <div className={`faq-answer${openFaq === i ? ' open' : ''}`}>
                  <div style={{ fontSize: 13, color: '#A8A89A', lineHeight: 1.7 }}>{f.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
