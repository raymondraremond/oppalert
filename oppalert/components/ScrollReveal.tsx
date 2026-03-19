'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number        // milliseconds delay
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = ''
}: Props) {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  const transforms = {
    up: 'translateY(32px)',
    left: 'translateX(-32px)', 
    right: 'translateX(32px)',
    none: 'none'
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : transforms[direction],
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
