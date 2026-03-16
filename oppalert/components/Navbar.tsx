'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, LogIn, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const path = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [path])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-white/5 shadow-lg' : 'bg-transparent'
        }`}
        style={{ height: 70 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="flex items-center gap-2 group">
              <span className="w-2.5 h-2.5 rounded-full bg-amber shadow-[0_0_10px_rgba(232,160,32,0.6)] group-hover:scale-125 transition-transform" />
              <div className="font-[Syne] text-2xl font-extrabold text-[#F0EDE6] tracking-tight">
                Opp<span className="text-amber drop-shadow-[0_0_8px_rgba(232,160,32,0.3)]">Alert</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-2 items-center bg-[#141710]/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5">
            <Link href="/opportunities">
              <div className={`nav-link text-[15px] ${path.startsWith('/opportunities') ? 'active' : ''}`}>
                Opportunities
              </div>
            </Link>
            <Link href="/pricing">
              <div className={`nav-link text-[15px] ${path === '/pricing' ? 'active' : ''}`}>Pricing</div>
            </Link>
            <Link href="/admin">
              <div className={`nav-link text-[15px] ${path === '/admin' ? 'active' : ''}`}>Admin</div>
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-3 items-center">
            <Link href="/login">
              <button className="btn-ghost px-5 py-2.5 text-sm font-semibold hover:text-white" style={{ gap: 6 }}>
                <LogIn size={15} />
                Log in
              </button>
            </Link>
            <Link href="/login">
              <button className="btn-primary px-6 py-2.5 text-sm" style={{ gap: 6 }}>
                Get Started
                <ArrowRight size={15} />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 w-[80%] max-w-sm h-full z-50 glass border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto py-24 px-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-2">
            <Link href="/opportunities">
              <div className={`p-4 rounded-xl text-lg font-medium transition-colors ${
                path.startsWith('/opportunities') ? 'bg-amber/10 text-amber' : 'text-gray-300 hover:bg-white/5'
              }`}>
                Opportunities
              </div>
            </Link>
            <Link href="/pricing">
              <div className={`p-4 rounded-xl text-lg font-medium transition-colors ${
                path === '/pricing' ? 'bg-amber/10 text-amber' : 'text-gray-300 hover:bg-white/5'
              }`}>
                Pricing
              </div>
            </Link>
            <Link href="/admin">
              <div className={`p-4 rounded-xl text-lg font-medium transition-colors ${
                path === '/admin' ? 'bg-amber/10 text-amber' : 'text-gray-300 hover:bg-white/5'
              }`}>
                Admin
              </div>
            </Link>
          </nav>
          
          <div className="mt-auto flex flex-col gap-4 pb-8">
            <Link href="/login" className="w-full">
              <button className="btn-ghost w-full py-4 text-base font-semibold" style={{ gap: 8 }}>
                <LogIn size={18} />
                Log in
              </button>
            </Link>
            <Link href="/login" className="w-full">
              <button className="btn-primary w-full py-4 text-base shadow-[0_4px_20px_rgba(232,160,32,0.3)]" style={{ gap: 8 }}>
                Get Started
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
