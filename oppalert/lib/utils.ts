import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getCategoryBadge(cat: string): string {
  const map: Record<string, string> = {
    scholarship: 'badge-blue',
    job: 'badge-green',
    fellowship: 'badge-amber',
    grant: 'badge-terra',
    internship: 'badge-blue',
    startup: 'badge-amber',
    bootcamp: 'badge-purple',
    event: 'badge-pink',
  }
  return map[cat] || 'badge-gray'
}

export function getCategoryLabel(cat: string): string {
  const map: Record<string, string> = {
    scholarship: '🎓 Scholarship',
    job: '💼 Remote Job',
    fellowship: '🌍 Fellowship',
    grant: '💰 Grant',
    internship: '🔬 Internship',
    startup: '🚀 Startup Funding',
    bootcamp: '💻 Bootcamp',
    event: '🎪 Events & Meetups',
  }
  return map[cat] || cat
}

export function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    scholarship: '#3B82F6',
    job: '#10B981',
    fellowship: '#E8A020',
    grant: '#D97706',
    internship: '#3B82F6',
    startup: '#E8A020',
    bootcamp: '#8B5CF6',
    event: '#EC4899',
  }
  return map[cat] || '#9A9C8E'
}

export function getCategoryBg(cat: string): string {
  const map: Record<string, string> = {
    scholarship: 'rgba(59,130,246,0.1)',
    job: 'rgba(16,185,129,0.1)',
    fellowship: 'rgba(232,160,32,0.1)',
    grant: 'rgba(217,119,6,0.1)',
    internship: 'rgba(59,130,246,0.1)',
    startup: 'rgba(232,160,32,0.1)',
    bootcamp: 'rgba(139,92,246,0.1)',
    event: 'rgba(236,72,153,0.1)',
  }
  return map[cat] || 'rgba(154,156,142,0.1)'
}

export function getDeadlineClass(days: number): string {
  if (days <= 7) return 'text-danger'
  if (days <= 14) return 'text-amber'
  return 'text-subtle'
}

export function stripHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function calculateDaysRemaining(deadline?: string): number {
  if (!deadline) return 30 // Fallback
  const now = new Date()
  const end = new Date(deadline)
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}
