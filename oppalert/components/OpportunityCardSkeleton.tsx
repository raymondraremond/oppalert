export default function OpportunityCardSkeleton() {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '1.25rem',
      overflow: 'hidden',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: 'var(--surface)',
        marginBottom: 12,
        animation: 'skeleton-pulse 1.5s ease infinite',
      }} />
      <div style={{
        height: 16, borderRadius: 6,
        background: 'var(--surface)',
        marginBottom: 8, width: '85%',
        animation: 'skeleton-pulse 1.5s ease infinite',
        animationDelay: '0.1s',
      }} />
      <div style={{
        height: 13, borderRadius: 6,
        background: 'var(--surface)',
        marginBottom: 16, width: '60%',
        animation: 'skeleton-pulse 1.5s ease infinite',
        animationDelay: '0.2s',
      }} />
      <div style={{
        height: 11, borderRadius: 6,
        background: 'var(--surface)',
        marginBottom: 8, width: '100%',
        animation: 'skeleton-pulse 1.5s ease infinite',
        animationDelay: '0.3s',
      }} />
      <div style={{
        height: 11, borderRadius: 6,
        background: 'var(--surface)',
        width: '75%',
        animation: 'skeleton-pulse 1.5s ease infinite',
        animationDelay: '0.4s',
      }} />
    </div>
  )
}
