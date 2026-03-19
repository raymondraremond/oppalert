'use client'
import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({ 
  children, 
  delay = 0,
  direction = 'up',
  className = ''
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : (
        direction === 'up' ? 'translateY(28px)' :
        direction === 'left' ? 'translateX(-28px)' :
        direction === 'right' ? 'translateX(28px)' : 'none'
      ),
      transition: 'opacity 0.55s ease, transform 0.55s ease',
      willChange: visible ? 'auto' : 'opacity, transform',
    }}>
      {children}
    </div>
  )
}
