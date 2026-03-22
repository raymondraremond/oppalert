"use client"
import { useState } from "react"

export default function ShareEventButtons({ 
  eventTitle, 
  eventUrl 
}: { 
  eventTitle: string, 
  eventUrl: string 
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const encodedTitle = encodeURIComponent(`Check out this event: ${eventTitle}`)
  const encodedUrl = encodeURIComponent(eventUrl)

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleCopy}
        className="flex-1 min-w-[120px] py-2 px-3 rounded-lg bg-surface border border-border text-primary text-[13px] font-bold hover:bg-[#313D2C] transition-colors flex items-center justify-center gap-2"
      >
        <span>{copied ? "✓ Copied!" : "🔗 Copy Link"}</span>
      </button>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="py-2 px-4 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] text-[13px] font-bold hover:bg-[#1DA1F2]/20 transition-colors"
      >
        Twitter
      </a>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="py-2 px-4 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[13px] font-bold hover:bg-[#25D366]/20 transition-colors"
      >
        WhatsApp
      </a>
    </div>
  )
}
