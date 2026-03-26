'use client'

const tickerItems = [
  '\u{1F393} Chevening Scholarship \u2014 220 days left',
  '\u{1F4BC} Paystack Graduate Trainee \u2014 45 days left',
  '\u{1F30D} ALX Software Engineering \u2014 180 days left',
  '\u{1F4B0} Tony Elumelu Foundation \u2014 60 days left',
  '\u{1F680} Y Combinator S2025 \u2014 300 days left',
  '\u{1F52C} Google STEP Internship \u2014 90 days left',
  '\u{1F30D} Mastercard Foundation \u2014 200 days left',
]

export default function OpportunityTicker() {
  return (
    <div style={{
      background: '#0A0C09',
      borderTop: '1px solid #141710',
      borderBottom: '1px solid #141710',
      padding: '10px 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Left fade */}
      <div style={{
        position: 'absolute', left: 0, top: 0,
        bottom: 0, width: 80, zIndex: 1,
        background: 'linear-gradient(to right, #0A0C09, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Right fade */}
      <div style={{
        position: 'absolute', right: 0, top: 0,
        bottom: 0, width: 80, zIndex: 1,
        background: 'linear-gradient(to left, #0A0C09, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Ticker track — duplicated for seamless loop */}
      <div style={{
        display: 'flex',
        gap: 48,
        width: 'max-content',
        animation: 'ticker 30s linear infinite',
      }}>
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} style={{
            fontSize: 13,
            color: '#9A9C8E',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {item}
            <span style={{
              width: 4, height: 4,
              borderRadius: '50%',
              background: '#2E3530',
              display: 'inline-block',
            }} />
          </span>
        ))}
      </div>
    </div>
  )
}
