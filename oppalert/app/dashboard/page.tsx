'use client'
import { useState } from 'react'
import Link from 'next/link'
import OpportunityCard from '@/components/OpportunityCard'
import { opportunities } from '@/lib/data'
import {
  BarChart3,
  Heart,
  Bell,
  User,
  LogOut,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  Check,
  Mail,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'saved', label: 'Saved (3)', icon: Heart },
  { id: 'alerts', label: 'Alert Settings', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
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
  const [profileSaved, setProfileSaved] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)
  const [selectedCats, setSelectedCats] = useState<string[]>(['Scholarships', 'Fellowships', 'Remote Jobs'])

  // Profile Form State
  const [firstName, setFirstName] = useState('Adewale')
  const [lastName, setLastName] = useState('Okafor')
  const [email, setEmail] = useState('adewale@example.com')
  const [country, setCountry] = useState('Nigeria')
  const [status, setStatus] = useState('University Student')
  
  const toggleAlert = (key: keyof typeof alerts) => {
    if (key === 'instant') return // premium only
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleCat = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleSaveProfile = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handleSavePrefs = () => {
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 2000)
  }

  const sidebar = (
    <>
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
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3D2E0A, #2A1A06)',
            border: '2px solid #E8A020',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 16,
            color: '#E8A020',
            marginBottom: 10,
            fontFamily: 'Syne, sans-serif',
            boxShadow: '0 0 15px rgba(232,160,32,0.15)',
          }}
        >
          AO
        </div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Adewale Okafor</div>
        <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 2 }}>Free Plan</div>
        <Link href="/pricing">
          <button
            className="btn-primary"
            style={{ marginTop: 10, padding: '5px 14px', fontSize: 11, fontWeight: 700, gap: 4 }}
          >
            <Zap size={11} />
            Upgrade
          </button>
        </Link>
      </div>

      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.15s',
              marginBottom: 2,
              background: activeTab === item.id ? '#3D2E0A' : 'transparent',
              color: activeTab === item.id ? '#E8A020' : '#A8A89A',
            }}
          >
            <Icon size={16} />
            {item.label}
          </div>
        )
      })}
      <Link href="/login" style={{ textDecoration: 'none' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: '#E05252',
            marginTop: 16,
            opacity: 0.7,
            transition: 'opacity 0.15s',
          }}
        >
          <LogOut size={16} />
          Log Out
        </div>
      </Link>
    </>
  )

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '24px 1.5rem',
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 24,
        minHeight: 'calc(100vh - 70px)',
      }}
    >
      {/* ── SIDEBAR (Desktop) ── */}
      <aside className="sidebar-desktop">{sidebar}</aside>

      {/* Mobile tabs */}
      <div
        className="mobile-filters"
        style={{
          overflowX: 'auto',
          gap: 6,
          paddingBottom: 12,
          borderBottom: '1px solid #2E3530',
          marginBottom: 16,
          gridColumn: '1 / -1',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: `1px solid ${activeTab === item.id ? '#4A3510' : '#2E3530'}`,
                background: activeTab === item.id ? '#3D2E0A' : 'transparent',
                color: activeTab === item.id ? '#E8A020' : '#A8A89A',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              <Icon size={13} />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div>
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-up">
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
              className="stats-grid-4"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
                marginBottom: 28,
              }}
            >
              {[
                { num: '3', label: 'Saved', change: '+1 this week', color: '#F0EDE6', changeColor: '#3DAA6A' },
                { num: '2', label: 'Applied', change: '1 pending review', color: '#F0EDE6', changeColor: '#3DAA6A' },
                { num: '3', label: 'Deadlines soon', change: 'Within 7 days', color: '#E05252', changeColor: '#E05252' },
                { num: '28', label: 'Alerts received', change: 'This month', color: '#F0EDE6', changeColor: '#3DAA6A' },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: 'linear-gradient(145deg, #171A13, #141710)',
                    border: '1px solid #2E3530',
                    borderRadius: 14,
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
                  <div style={{ fontSize: 11, color: s.changeColor, marginTop: 6 }}>
                    {s.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Deadlines */}
            <div
              style={{
                background: 'linear-gradient(145deg, #171A13, #141710)',
                border: '1px solid #2E3530',
                borderRadius: 14,
                padding: '1.25rem',
                marginBottom: 24,
              }}
            >
              <div
                style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, fontFamily: 'Syne, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Clock size={16} style={{ color: '#E8A020' }} />
                Deadlines This Week
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
                      borderBottom: '1px solid #1A1F15',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: '#222820',
                          border: '1px solid #2E3530',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{opp.icon}</span>
                      </div>
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
                style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, fontFamily: 'Syne, sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Sparkles size={16} style={{ color: '#E8A020' }} />
                Recommended For You
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
          <div className="animate-fade-up">
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
          <div className="animate-fade-up">
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
                  Unlock Instant Alerts
                </div>
                <p style={{ fontSize: 13, color: '#A8A89A', margin: 0 }}>
                  Free plan limits you to daily digests. Premium gives real-time notifications.
                </p>
              </div>
              <Link href="/pricing">
                <button
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: 13, fontWeight: 700, gap: 4 }}
                >
                  Upgrade
                  <ArrowRight size={13} />
                </button>
              </Link>
            </div>

            {[
              {
                key: 'newOpps' as const,
                icon: Mail,
                label: 'New opportunity alerts',
                sub: 'Get notified when new listings match your preferences',
                premium: false,
              },
              {
                key: 'deadlines' as const,
                icon: Clock,
                label: 'Deadline reminders',
                sub: 'Receive reminders 7 days before saved opportunity deadlines',
                premium: false,
              },
              {
                key: 'digest' as const,
                icon: Bell,
                label: 'Weekly digest',
                sub: 'A weekly roundup of the best opportunities',
                premium: false,
              },
              {
                key: 'instant' as const,
                icon: Zap,
                label: 'Instant alerts',
                sub: 'Real-time push + email the moment an opportunity goes live',
                premium: true,
              },
            ].map((a) => {
              const AlertIcon = a.icon
              return (
                <div
                  key={a.key}
                  style={{
                    background: 'linear-gradient(145deg, #171A13, #141710)',
                    border: '1px solid #2E3530',
                    borderRadius: 12,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 10,
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: a.premium ? '#3D2E0A' : '#222820',
                      border: `1px solid ${a.premium ? '#4A3510' : '#2E3530'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AlertIcon size={16} style={{ color: a.premium ? '#E8A020' : '#A8A89A' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {a.label}
                      {a.premium && (
                        <span className="badge badge-amber">
                          Premium
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 2 }}>{a.sub}</div>
                  </div>
                  <div
                    className={`toggle-wrap${alerts[a.key] ? ' on' : ''}`}
                    onClick={() => toggleAlert(a.key)}
                    style={a.premium ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="animate-fade-up">
            <h2
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 24 }}
            >
              Profile Settings
            </h2>
            <div
              style={{
                background: 'linear-gradient(145deg, #171A13, #141710)',
                border: '1px solid #2E3530',
                borderRadius: 14,
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
                  <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
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
                  <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}
                >
                  Email
                </label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}
                >
                  Country
                </label>
                <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
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
                <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>University Student</option>
                  <option>Recent Graduate</option>
                  <option>Job Seeker</option>
                  <option>Professional</option>
                  <option>Startup Founder</option>
                </select>
              </div>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13, gap: 6 }} onClick={handleSaveProfile}>
                {profileSaved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
              </button>
            </div>

            <div
              style={{
                background: 'linear-gradient(145deg, #171A13, #141710)',
                border: '1px solid #2E3530',
                borderRadius: 14,
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
                  (cat) => {
                    const isSelected = selectedCats.includes(cat)
                    return (
                      <div
                        key={cat}
                        onClick={() => toggleCat(cat)}
                        style={{
                          background: isSelected ? '#3D2E0A' : '#222820',
                          color: isSelected ? '#E8A020' : '#A8A89A',
                          border: `1px solid ${isSelected ? '#4A3510' : '#2E3530'}`,
                          borderRadius: 8,
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {isSelected && <Check size={11} />}
                        {cat}
                      </div>
                    )
                  }
                )}
              </div>
              <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 13, gap: 6 }} onClick={handleSavePrefs}>
                {prefsSaved ? <><Check size={14} /> Saved!</> : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
