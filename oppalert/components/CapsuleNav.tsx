'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, LayoutDashboard, Settings, Menu, X, Rocket } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function CapsuleNav() {
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobile, setShowMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const path = usePathname()
  const router = useRouter()

  const loadUser = () => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.email) {
          setUser(parsed)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    loadUser()
    const handleStorage = () => loadUser()
    window.addEventListener('storage', handleStorage)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    loadUser()
    setShowMobile(false)
    setShowDropdown(false)
  }, [path])

  const handleLogout = () => {
    localStorage.removeItem('user')
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setUser(null)
    setShowDropdown(false)
    setShowMobile(false)
    router.push('/')
  }

  const isAdmin = user !== null && user.plan === 'admin'
  const isLoggedIn = !!user

  const getInitials = () => {
    if (!user?.fullName && !user?.full_name) return 'U'
    const name = user.fullName || user.full_name
    return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const navLinks = [
    { href: '/opportunities', label: 'Explore' },
    { href: '/events', label: 'Events' },
    { href: '/pricing', label: 'Pricing' },
  ]

  if (path === '/login' || path === '/register') return null

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] px-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[700px] mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-4 py-2 flex items-center justify-between pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        {/* Logo */}
        <Link href="/" className="pl-1 md:pl-3 group flex items-center gap-2">
          <img 
            src="/icon.png" 
            alt="OppFetch" 
            className="w-7 h-7 md:w-8 md:h-8 object-contain group-hover:scale-110 transition-transform" 
          />
          <span className="font-syne font-black text-white text-sm sm:text-base md:text-lg tracking-tighter group-hover:text-[#E8A020] transition-colors">
            Opp<span className="text-[#E8A020]">Fetch</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                path.startsWith(link.href) 
                  ? 'bg-[#E8A020] text-[#080A07]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link 
              href="/organizer"
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                path.startsWith('/organizer') 
                  ? 'bg-[#E8A020] text-[#080A07]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Portal
            </Link>
          )}
        </div>

        {/* Actions / User */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-[#E8A020]/10 border border-[#E8A020]/30 flex items-center justify-center text-[10px] font-black text-[#E8A020] hover:border-[#E8A020] transition-colors"
              >
                {getInitials()}
              </button>
              
              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-4 w-48 bg-[#1A1D18] border border-white/10 rounded-2xl p-2 shadow-2xl z-20 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Signed in as</div>
                      <div className="text-xs font-bold text-white truncate">{user.email}</div>
                    </div>
                    
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link href="/organizer" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <Rocket size={14} /> Organizer Hub
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-[#E8A020] hover:bg-[#E8A020]/5 rounded-xl transition-all">
                        <Settings size={14} /> System Admin
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all mt-1 pt-3 border-t border-white/5 underline decoration-red-500/20 underline-offset-4"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/register">
              <button className="bg-[#E8A020] text-[#080A07] px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                Join <span className="hidden sm:inline">Portal</span>
              </button>
            </Link>
          )}

          {/* Mobile Toggle */}
          <button 
            onClick={() => setShowMobile(!showMobile)}
            className="md:hidden w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white"
          >
            {showMobile ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobile && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden max-w-[700px] mx-auto bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl mt-4"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-lg font-syne font-black text-white hover:text-[#E8A020] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/5 my-2" />
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="text-white/60 font-bold">Dashboard</Link>
                  <Link href="/organizer" className="text-white/60 font-bold">Organizer Hub</Link>
                  <button onClick={handleLogout} className="text-red-500/60 font-bold text-left">Log Out</button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link href="/login" className="text-white/60 font-bold">Log In</Link>
                  <Link href="/register" className="bg-[#E8A020] text-[#080A07] py-4 rounded-2xl text-center font-black uppercase tracking-widest">Create Account</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
