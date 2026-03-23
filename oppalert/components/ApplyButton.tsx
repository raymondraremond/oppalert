'use client'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'

export default function ApplyButton({ applyUrl, oppId, disabled }: { applyUrl: string; oppId: string; disabled?: boolean }) {
  const router = useRouter()

  const handleApply = () => {
    const user = localStorage.getItem('user')
    if (!user) {
      localStorage.setItem('loginRedirect', '/opportunities/' + oppId)
      router.push('/login?next=' + encodeURIComponent('/opportunities/' + oppId))
      return
    }
    window.open(applyUrl, '_blank', 'noopener')
  }

  if (disabled) {
    return (
      <button
        disabled
        className="btn-primary w-full py-5 px-8 text-sm font-black uppercase tracking-[0.2em] rounded-2xl opacity-50 pointer-events-none grayscale flex items-center justify-center gap-3"
      >
        Application Closed
      </button>
    )
  }

  return (
    <button
      onClick={handleApply}
      className="btn-primary w-full py-5 px-8 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow-amber hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
    >
      Apply Now
      <ExternalLink size={18} className="stroke-[2.5]" />
    </button>
  )
}
