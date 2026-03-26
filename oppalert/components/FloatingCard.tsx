'use client'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  style?: React.CSSProperties
}

export default function FloatingCard({
  children,
  delay = 0,
  style = {},
}: Props) {
  return (
    <div style={{
      animation: `float 4s ease-in-out infinite`,
      animationDelay: `${delay}ms`,
      willChange: 'transform',
      ...style,
    }}>
      {children}
    </div>
  )
}
