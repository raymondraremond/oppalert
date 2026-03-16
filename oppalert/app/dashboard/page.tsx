'use client'
import { useState } from 'react'
import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import { opportunities } from '@/lib/data'

const navItems = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'saved', label: '♡ Saved (3)' },
  { id: 'alerts', label: '🔔 Alert Settings' },
  { id: 'profile', label: '👤 Profile' },
]

const deadlines = opportunities.filter((o) => o.days <= 20).slice(0, 3)
const savedOpps = opportunities.slice(0, 3)
const recommended = opportunities.slice(0, 3)

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [alerts, setAlerts] = useState({
    newOpps: true,
    deadlines: true,
    digest: true,
    instant: false,
  })

  const toggleAlert = (key: keyof typeof alerts) => {
    if (key === 'instant') return // premium only
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '32px 1.5rem',
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 24,
        minHeight: 'calc(100vh - 60px)',
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside>
        {/* User info */}
        <div
          style={{
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '1px solid #2E3530',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#3D2E0A',
              border: '2px solid #E8A020',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              color: '#E8A020',
              marginBottom: 10,
              fontFamily: 'Syne, sans-serif',
            }}
          >
            AO
          </div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Adewale Okafor</div>
          <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 2 }}>Free Plan</div>
          <Link href="/pricing">
            <button
              className="btn-primary"
              style={{ marginTop: 10, padding: '4px 12px', fontSize: 11, fontWeight: 700 }}
            >
              Upgrade →
            </button>
          </Link>
        </div>

        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.15s',
              marginBottom: 2,
              background: activeTab === item.id ? '#3D2E0A' : 'transparent',
              color: activeTab === item.id ? '#E8A020' : '#A8A89A',
            }}
          >
            {item.label}
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: '#E05252',
            marginTop: 16,
            opacity: 0.7,
          }}
        >
          → Log Out
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div>
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 22,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              Good morning, Adewale 👋
            </h2>

            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
                marginBottom: 28,
              }}
            >
              {[
                { num: '3', label: 'Saved', change: '+1 this week', color: '#F0EDE6' },
                { num: '2', label: 'Applied', change: '1 pending review', color: '#F0EDE6' },
                { num: '3', label: 'Deadlines soon', change: 'Within 7 days', color: '#E05252' },
                { num: '28', label: 'Alerts received', change: 'This month', color: '#F0EDE6' },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: '#141710',
                    border: '1px solid #2E3530',
                    borderRadius: 12,
                    padding: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 28,
                      fontWeight: 800,
                      color: s.color,
                    }}
                  >
                    {s.num}
                  </div>
                  <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 4 }}>{s.label}</div>
                  <div
                    style={{ fontSize: 11, color: s.change.includes('soon') || s.change.includes('7') ? '#E05252' : '#3DAA6A', marginTop: 6 }}
                  >
                    {s.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Deadlines */}
            <div
              style={{
                background: '#141710',
                border: '1px solid #2E3530',
                borderRadius: 12,
                padding: '1.25rem',
                marginBottom: 24,
              }}
            >
              <div
                style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, fontFamily: 'Syne, sans-serif' }}
              >
                ⏰ Deadlines This Week
              </div>
              {deadlines.map((opp) => (
                <Link
                  key={opp.id}
                  href={`/opportunities/${opp.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #222820',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontSize: 20 }}>{opp.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{opp.title}</div>
                        <div style={{ fontSize: 11, color: '#6A6B62' }}>{opp.org}</div>
                      </div>
                    </div>
                    <span className={`badge ${opp.days <= 7 ? 'badge-red' : 'badge-amber'}`}>
                      {opp.days}d left
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recommended */}
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, fontFamily: 'Syne, sans-serif' }}
              >
                ✨ Recommended For You
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 16,
                }}
              >
                {recommended.map((opp) => (
                  <OpportunityCard key={opp.id} opp={opp} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SAVED */}
        {activeTab === 'saved' && (
          <div>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 22,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              Saved Opportunities
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {savedOpps.map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
            </div>
          </div>
        )}

        {/* ALERTS */}
        {activeTab === 'alerts' && (
          <div>
            <h2
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 6 }}
            >
              Alert Preferences
            </h2>
            <p style={{ fontSize: 14, color: '#6A6B62', marginBottom: 24 }}>
              Control what notifications you receive and how frequently.
            </p>

            {/* Premium banner */}
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
                  ⚡ Unlock Instant Alerts
                </div>
                <p style={{ fontSize: 13, color: '#A8A89A', margin: 0 }}>
                  Free plan limits you to daily digests. Premium gives real-time notifications.
                </p>
              </div>
              <Link href="/pricing">
                <button
                  className="btn-primary"
                  style={{ padding: '7px 16px', fontSize: 13, fontWeight: 700 }}
                >
                  Upgrade
                </button>
              </Link>
            </div>

            {[
              {
                key: 'newOpps' as const,
                icon: '📧',
                label: 'New opportunity alerts',
                sub: 'Get notified when new listings match your preferences',
                premium: false,
              },
              {
                key: 'deadlines' as const,
                icon: '⏰',
                label: 'Deadline reminders',
                sub: 'Receive reminders 7 days before saved opportunity deadlines',
                premium: false,
              },
              {
                key: 'digest' as const,
                icon: '📰',
                label: 'Weekly digest',
                sub: 'A weekly roundup of the best opportunities',
                premium: false,
              },
              {
                key: 'instant' as const,
                icon: '⚡',
                label: 'Instant alerts',
                sub: 'Real-time push + email the moment an opportunity goes live',
                premium: true,
              },
            ].map((a) => (
              <div
                key={a.key}
                style={{
                  background: '#141710',
                  border: '1px solid #2E3530',
                  borderRadius: 10,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 10,
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 20 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {a.label}
                    {a.premium && (
                      <span className="badge badge-amber" style={{ marginLeft: 8 }}>
                        Premium
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 2 }}>{a.sub}</div>
                </div>
                <div
                  className={`toggle-wrap${alerts[a.key] ? ' on' : ''}`}
                  onClick={() => toggleAlert(a.key)}
                />
              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div>
            <h2
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 24 }}
            >
              Profile Settings
            </h2>
            <div
              style={{
                background: '#141710',
                border: '1px solid #2E3530',
                borderRadius: 12,
                padding: '1.5rem',
                marginBottom: 20,
              }}
            >
              <div
                style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: 'Syne, sans-serif' }}
              >
                Personal Information
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: '#A8A89A',
                      display: 'block',
                      marginBottom: 6,
                      fontWeight: 500,
                    }}
                  >
                    First Name
                  </label>
                  <input className="input" defaultValue="Adewale" />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: '#A8A89A',
                      display: 'block',
                      marginBottom: 6,
                      fontWeight: 500,
                    }}
                  >
                    Last Name
                  </label>
                  <input className="input" defaultValue="Okafor" />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}
                >
                  Email
                </label>
                <input className="input" type="email" defaultValue="adewale@example.com" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}
                >
                  Country
                </label>
                <select className="input">
                  <option>Nigeria</option>
                  <option>Ghana</option>
                  <option>Kenya</option>
                  <option>South Africa</option>
                  <option>Ethiopia</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}
                >
                  Professional Status
                </label>
                <select className="input">
                  <option>University Student</option>
                  <option>Recent Graduate</option>
                  <option>Job Seeker</option>
                  <option>Professional</option>
                  <option>Startup Founder</option>
                </select>
              </div>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}>
                Save Changes
              </button>
            </div>

            <div
              style={{
                background: '#141710',
                border: '1px solid #2E3530',
                borderRadius: 12,
                padding: '1.5rem',
              }}
            >
              <div
                style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: 'Syne, sans-serif' }}
              >
                Opportunity Preferences
              </div>
              <div style={{ marginBottom: 8, fontSize: 13, color: '#A8A89A' }}>
                Select your interests:
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {['Scholarships', 'Fellowships', 'Remote Jobs', 'Grants', 'Internships', 'Startup Funding'].map(
                  (cat, i) => (
                    <div
                      key={cat}
                      style={{
                        background: i < 3 ? '#3D2E0A' : '#222820',
                        color: i < 3 ? '#E8A020' : '#A8A89A',
                        border: `1px solid ${i < 3 ? '#4A3510' : '#2E3530'}`,
                        borderRadius: 8,
                        padding: '5px 12px',
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {cat}
                    </div>
                  )
                )}
              </div>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}>
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
