'use client'
import { useState } from 'react'
import { opportunities } from '@/lib/data'
import { getCategoryLabel } from '@/lib/utils'

const mockUsers = [
  { name: 'Chioma Eze', email: 'chioma@gmail.com', plan: 'Premium', joined: 'Jan 2025', saved: 24 },
  { name: 'Kwame Asante', email: 'kwame@outlook.com', plan: 'Free', joined: 'Nov 2024', saved: 8 },
  { name: 'Fatima Al-Hassan', email: 'fatima@yahoo.com', plan: 'Premium', joined: 'Dec 2024', saved: 31 },
  { name: 'David Osei', email: 'david@proton.me', plan: 'Free', joined: 'Feb 2025', saved: 5 },
  { name: 'Ngozi Adeyemi', email: 'ngozi@gmail.com', plan: 'Premium', joined: 'Oct 2024', saved: 18 },
]

const adminStats = [
  { num: '2,408', label: 'Total Listings', change: '+42 this week', color: '#E8A020' },
  { num: '48,291', label: 'Total Users', change: '+1,204 this week', color: '#3DAA6A' },
  { num: '3,840', label: 'Premium Users', change: '$11,520/mo MRR', color: '#4A9EE8' },
  { num: '₦847K', label: 'Revenue (MTD)', change: '+18% vs last month', color: '#C45C2A' },
]

const barData = [40, 55, 48, 72, 88, 108]
const barMonths = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('opps')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const tabs = [
    { id: 'opps', label: 'Opportunities' },
    { id: 'users', label: 'Users' },
    { id: 'featured', label: 'Featured Listings' },
    { id: 'analytics', label: 'Analytics' },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 13, color: '#6A6B62' }}>
            Manage opportunities, users, and platform analytics
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: 14, fontWeight: 700 }}
          onClick={() => setShowCreateModal(true)}
        >
          + New Opportunity
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {adminStats.map((s) => (
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
                fontSize: 26,
                fontWeight: 800,
                color: s.color,
              }}
            >
              {s.num}
            </div>
            <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: '#3DAA6A', marginTop: 6 }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          borderBottom: '1px solid #2E3530',
          marginBottom: 24,
        }}
      >
        {tabs.map((t) => (
          <div
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '9px 16px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: `2px solid ${activeTab === t.id ? '#E8A020' : 'transparent'}`,
              marginBottom: -1,
              color: activeTab === t.id ? '#E8A020' : '#6A6B62',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* ── OPPORTUNITIES TAB ── */}
      {activeTab === 'opps' && (
        <div>
          <div
            style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}
          >
            <input
              className="input"
              placeholder="Search opportunities..."
              style={{ maxWidth: 260 }}
            />
            <select className="input" style={{ width: 'auto' }}>
              <option>All Categories</option>
              <option>Scholarships</option>
              <option>Jobs</option>
              <option>Fellowships</option>
            </select>
            <select className="input" style={{ width: 'auto' }}>
              <option>All Status</option>
              <option>Active</option>
              <option>Expired</option>
            </select>
          </div>

          <div
            style={{
              background: '#141710',
              border: '1px solid #2E3530',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Opportunity', 'Category', 'Location', 'Deadline', 'Status', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          color: '#6A6B62',
                          borderBottom: '1px solid #2E3530',
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr
                    key={opp.id}
                    style={{ transition: 'background 0.1s' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#1A1F15')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#F0EDE6' }}>
                        {opp.icon} {opp.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#6A6B62' }}>{opp.org}</div>
                    </td>
                    <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15' }}>
                      <span className="badge badge-blue">{opp.cat}</span>
                    </td>
                    <td
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid #1A1F15',
                        fontSize: 12,
                        color: '#A8A89A',
                      }}
                    >
                      {opp.loc}
                    </td>
                    <td
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid #1A1F15',
                        fontSize: 12,
                        color: '#A8A89A',
                      }}
                    >
                      {opp.deadline}
                    </td>
                    <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15' }}>
                      <span className={`badge ${opp.days > 0 ? 'badge-green' : 'badge-red'}`}>
                        {opp.days > 0 ? 'Active' : 'Expired'}
                      </span>
                      {opp.featured && (
                        <span className="badge badge-amber" style={{ marginLeft: 4 }}>
                          Featured
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn-ghost"
                          style={{ padding: '3px 10px', fontSize: 11, borderRadius: 6 }}
                        >
                          Edit
                        </button>
                        <button
                          style={{
                            padding: '3px 10px',
                            fontSize: 11,
                            borderRadius: 6,
                            background: '#2E1212',
                            color: '#E05252',
                            border: '1px solid #3A1A1A',
                            cursor: 'pointer',
                            fontFamily: 'DM Sans, sans-serif',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div
          style={{
            background: '#141710',
            border: '1px solid #2E3530',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['User', 'Email', 'Plan', 'Joined', 'Saved', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: '#6A6B62',
                      borderBottom: '1px solid #2E3530',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u) => (
                <tr
                  key={u.email}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1A1F15')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: '#3D2E0A',
                          border: '1px solid #4A3510',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#E8A020',
                          flexShrink: 0,
                        }}
                      >
                        {u.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#F0EDE6' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15', fontSize: 12, color: '#A8A89A' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15' }}>
                    <span className={`badge ${u.plan === 'Premium' ? 'badge-amber' : 'badge-gray'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15', fontSize: 12, color: '#A8A89A' }}>
                    {u.joined}
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15', fontSize: 12, color: '#A8A89A' }}>
                    {u.saved}
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #1A1F15' }}>
                    <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: 11, borderRadius: 6 }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── FEATURED LISTINGS TAB ── */}
      {activeTab === 'featured' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { icon: '📌', name: 'Basic Featured', price: '$25', desc: '7-day listing highlight in category page', highlight: false },
            { icon: '🏠', name: 'Homepage Featured', price: '$75', desc: 'Featured slot on homepage for 7 days', highlight: true },
            { icon: '⭐', name: 'Premium Highlight', price: '$150', desc: 'Top banner + email blast + 14-day feature', highlight: false },
          ].map((pkg) => (
            <div
              key={pkg.name}
              style={{
                background: pkg.highlight ? 'linear-gradient(145deg, #131108, #141710)' : '#141710',
                border: `1px solid ${pkg.highlight ? '#4A3510' : '#2E3530'}`,
                borderRadius: 12,
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{pkg.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 6 }}>{pkg.name}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#E8A020', marginBottom: 10 }}>
                {pkg.price}
              </div>
              <div style={{ fontSize: 12, color: '#6A6B62', marginBottom: 16, lineHeight: 1.6 }}>{pkg.desc}</div>
              <button
                className={pkg.highlight ? 'btn-primary' : 'btn-ghost'}
                style={{ width: '100%', padding: '8px', fontSize: 13 }}
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── ANALYTICS TAB ── */}
      {activeTab === 'analytics' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { num: '89,402', label: 'Monthly Page Views' },
              { num: '12.4%', label: 'Free→Premium CVR' },
              { num: '6.2%', label: 'Monthly Churn Rate' },
              { num: '$3.84', label: 'Avg Revenue / User' },
            ].map((s) => (
              <div
                key={s.label}
                style={{ background: '#141710', border: '1px solid #2E3530', borderRadius: 12, padding: '1.25rem' }}
              >
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800 }}>{s.num}</div>
                <div style={{ fontSize: 12, color: '#6A6B62', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#141710', border: '1px solid #2E3530', borderRadius: 12, padding: '1.5rem' }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, fontFamily: 'Syne, sans-serif' }}>
              Monthly Revenue Growth
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
              {barData.map((h, i) => (
                <div
                  key={barMonths[i]}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}
                >
                  <div
                    style={{
                      background: i === barData.length - 1 ? '#E8A020' : '#3D2E0A',
                      width: '100%',
                      borderRadius: '4px 4px 0 0',
                      height: h,
                      border: i === barData.length - 1 ? 'none' : '1px solid #4A3510',
                      transition: 'height 0.3s',
                    }}
                  />
                  <span style={{ fontSize: 10, color: i === barData.length - 1 ? '#E8A020' : '#6A6B62' }}>
                    {barMonths[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE OPPORTUNITY MODAL ── */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: '#141710',
              border: '1px solid #3A4238',
              borderRadius: 16,
              padding: '2rem',
              width: '90%',
              maxWidth: 540,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800 }}>
                New Opportunity
              </h2>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6A6B62',
                  fontSize: 22,
                  cursor: 'pointer',
                }}
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: 14, color: '#A8A89A', marginBottom: 24 }}>
              Post a new verified opportunity to the platform.
            </p>

            {[
              { label: 'Title', placeholder: 'e.g. Chevening Scholarships 2025', type: 'text' },
              { label: 'Organization', placeholder: 'e.g. UK Government / Chevening', type: 'text' },
              { label: 'Application URL', placeholder: 'https://...', type: 'url' },
            ].map((f) => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontSize: 13,
                    color: '#A8A89A',
                    display: 'block',
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  {f.label}
                </label>
                <input className="input" type={f.type} placeholder={f.placeholder} />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  Category
                </label>
                <select className="input">
                  <option>scholarship</option>
                  <option>job</option>
                  <option>fellowship</option>
                  <option>grant</option>
                  <option>internship</option>
                  <option>startup</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  Funding Type
                </label>
                <select className="input">
                  <option>Fully Funded</option>
                  <option>Partial Funding</option>
                  <option>Paid Position</option>
                  <option>Equity / Funding</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  Location
                </label>
                <input className="input" placeholder="e.g. Nigeria, International" />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                  Deadline
                </label>
                <input className="input" type="date" />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#A8A89A', display: 'block', marginBottom: 6, fontWeight: 500 }}>
                Short Description
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="Brief summary of the opportunity..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: 14, fontWeight: 700 }}
              onClick={() => setShowCreateModal(false)}
            >
              Publish Opportunity →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
