"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button 
        className="w-9 h-9 flex items-center justify-center rounded-full bg-icon-bg border border-border text-muted opacity-50"
        aria-label="Loading Theme Toggle"
      />
    )
  }

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface2 transition-all"
      aria-label="Toggle Theme"
      title={`Switch to ${currentTheme === "dark" ? "Light" : "Dark"} Mode`}
    >
      {currentTheme === "dark" ? (
        <Sun className="w-4 h-4 text-amber" />
      ) : (
        <Moon className="w-4 h-4 text-primary" />
      )}
    </button>
  )
}
