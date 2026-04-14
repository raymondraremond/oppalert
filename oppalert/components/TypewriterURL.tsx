'use client'
import { useState, useEffect } from 'react'

const slugs = [
  'scholarship-masterclass',
  'tech-founders-summit',
  'graduate-fellowship-2024',
  'remote-career-fair',
  'startup-pitch-day'
]

export default function TypewriterURL() {
  const [displayText, setDisplayText] = useState('')
  const [slugIndex, setSlugIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    const handleTyping = () => {
      const currentSlug = slugs[slugIndex]
      
      if (isDeleting) {
        setDisplayText(prev => prev.substring(0, prev.length - 1))
        setTypingSpeed(50)
      } else {
        setDisplayText(prev => currentSlug.substring(0, prev.length + 1))
        setTypingSpeed(100)
      }

      if (!isDeleting && displayText === currentSlug) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false)
        setSlugIndex(prev => (prev + 1) % slugs.length)
        setTypingSpeed(150)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, slugIndex, typingSpeed])

  return (
    <div className="flex items-center gap-2 font-mono text-xs md:text-sm lg:text-base">
      <span className="text-muted/60">oppalert.com/e/</span>
      <span className="text-emerald-400 font-bold tracking-tight">
        {displayText}
        <span className="animate-blink border-r-2 border-emerald-400 ml-1" />
      </span>
    </div>
  )
}
