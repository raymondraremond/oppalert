'use client'
import { useState, useEffect } from 'react'

const affiliates = [
  {
    id: 1,
    badge: 'Scholarship Prep',
    title: 'Ace Your IELTS',
    description: 'Most scholarships require IELTS 6.5+. Thousands of Africans passed with this course.',
    cta: 'Start Free Trial →',
    url: 'https://www.ielts.org',
    highlight: '#4A9EE8',
    tag: 'Most Popular',
  },
  {
    id: 2,
    badge: 'Career Tools',
    title: 'Build a CV That Gets Interviews',
    description: 'Canva Pro has 500+ ATS-friendly CV templates trusted by African professionals.',
    cta: 'Try Canva Pro →',
    url: 'https://www.canva.com/affiliates',
    highlight: '#9B59B6',
    tag: 'Recommended',
  },
  {
    id: 3,
    badge: 'Remote Jobs',
    title: 'Get Hired on Toptal',
    description: 'The top 3% of freelancers earn $50-200/hr remotely. Join the network.',
    cta: 'Apply Now →',
    url: 'https://www.toptal.com/#accept-only-talented-coders',
    highlight: '#2ECC71',
    tag: 'High Earning',
  },
  {
    id: 4,
    badge: 'Upskill',
    title: 'Coursera Financial Aid',
    description: 'Get certified from Google, IBM, Meta for free using financial aid. 95% approved.',
    cta: 'Get Certified Free →',
    url: 'https://www.coursera.org',
    highlight: '#E8A020',
    tag: 'Free Option',
  },
  {
    id: 5,
    badge: 'For Founders',
    title: 'Launch Your Startup Faster',
    description: 'Notion + Webflow + Stripe — the startup stack. Get 6 months free with GitHub Student.',
    cta: 'Claim Student Pack →',
    url: 'https://education.github.com/pack',
    highlight: '#E05252',
    tag: 'Students Only',
  },
]

export default function AffiliateCard() {
  const [current, setCurrent] = useState(0)
  
  // Auto-rotate every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % affiliates.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])
  
  const aff = affiliates[current]
  
  return (
    <div style={{
      background: 'var(--bg2)',
      border: `1px solid ${aff.highlight}30`,
      borderRadius: 12,
      padding: '1.25rem',
      marginBottom: 16,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle glow accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        right: 0, height: 2,
        background: aff.highlight,
        borderRadius: '12px 12px 0 0',
      }} />
      
      {/* Tag */}
      <div style={{
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        color: aff.highlight,
        marginBottom: 8,
      }}>
        {aff.badge} · {aff.tag}
      </div>
      
      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-syne), sans-serif',
        fontSize: 14, fontWeight: 700,
        marginBottom: 6, color: 'var(--primary)',
      }}>
        {aff.title}
      </div>
      
      {/* Description */}
      <p style={{
        fontSize: 12, color: 'var(--muted)',
        lineHeight: 1.6, marginBottom: 14,
      }}>
        {aff.description}
      </p>
      
      {/* CTA Button */}
      <a href={aff.url} target="_blank" 
         rel="noopener noreferrer sponsored"
         style={{ textDecoration: 'none' }}>
        <button style={{
          width: '100%', padding: '8px',
          background: aff.highlight,
          border: 'none', borderRadius: 8,
          fontSize: 12, fontWeight: 700,
          color: '#0D0F0B', cursor: 'pointer',
          fontFamily: 'var(--font-syne), sans-serif',
        }}>
          {aff.cta}
        </button>
      </a>
      
      {/* Dots indicator */}
      <div style={{
        display: 'flex', gap: 4,
        justifyContent: 'center', marginTop: 12,
      }}>
        {affiliates.map((_, i) => (
          <div key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 5, height: 5,
              borderRadius: '50%', cursor: 'pointer',
              background: i === current 
                ? aff.highlight : '#2E3530',
              transition: 'background 0.2s',
            }}
          />
        ))}
      </div>
      
      {/* Disclosure */}
      <div style={{
        fontSize: 9, color: '#3A4238',
        textAlign: 'center', marginTop: 8,
      }}>
        Sponsored · We may earn a commission
      </div>
    </div>
  )
}
