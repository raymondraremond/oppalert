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
  }
  return map[cat] || cat
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
