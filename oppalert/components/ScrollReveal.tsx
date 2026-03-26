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
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : (
        direction === 'up' ? 'translateY(20px)' :
        direction === 'left' ? 'translateX(-20px)' :
        direction === 'right' ? 'translateX(20px)' : 'none'
      ),
      transition: 'opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      willChange: visible ? 'auto' : 'opacity, transform',
    }}>
      {children}
    </div>
  )
}
