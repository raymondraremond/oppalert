export default function OpportunityCardSkeleton() {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid #252D22',
      borderRadius: 16, padding: '1.25rem',
    }}>
      {[44, 16, 13, 11, 11].map((h, i) => (
        <div key={i} style={{
          height: h,
          width: i === 0 ? 44 : 
                 i === 1 ? '80%' : 
                 i === 2 ? '55%' :
                 i === 3 ? '100%' : '70%',
          borderRadius: i === 0 ? 10 : 6,
          background: '#1C2119',
          marginBottom: i === 0 ? 14 : 8,
          animation: 'skeleton-pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 150}ms`,
        }} />
      ))}
    </div>
  )
}
