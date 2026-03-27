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
      transform: visible ? 'translate3d(0, 0, 0)' : (
        direction === 'up' ? 'translate3d(0, 20px, 0)' :
        direction === 'left' ? 'translate3d(-20px, 0, 0)' :
        direction === 'right' ? 'translate3d(20px, 0, 0)' : 'translate3d(0, 0, 0)'
      ),
      transition: 'opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      willChange: visible ? 'auto' : 'opacity, transform',
    }}>
      {children}
    </div>
  )
}
