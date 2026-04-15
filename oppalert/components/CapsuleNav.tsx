'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, LayoutDashboard, Settings, Menu, X, Rocket, ChevronDown, Bell, Zap } from 'lucide-react'
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
    <div className="fixed top-8 left-0 right-0 z-[100] px-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[760px] mx-auto bg-surface/80 backdrop-blur-xl border border-border rounded-full px-4 py-2 flex items-center justify-between pointer-events-auto shadow-sm relative"
      >

        {/* Branding */}
        <Link href="/" className="pl-3 group flex items-center gap-3 relative z-10 transition-transform active:scale-95">
          <div className="w-9 h-9 rounded-xl bg-bg border border-border flex items-center justify-center shadow-inner overflow-hidden group-hover:border-emerald/40 transition-colors">
            <img 
              src="/icon.png" 
              alt="OppAlert" 
              className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" 
            />
          </div>
          <span className="font-extrabold text-primary text-xl tracking-tighter group-hover:text-emerald transition-colors font-syne">
            Opp<span className="text-emerald italic">Alert</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 relative z-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                path.startsWith(link.href) 
                  ? 'bg-emerald text-black shadow-lg shadow-emerald/10' 
                  : 'text-muted hover:text-primary hover:bg-surface2'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link 
              href="/organizer"
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                path.startsWith('/organizer') 
                  ? 'bg-emerald text-black shadow-lg shadow-emerald/10' 
                  : 'text-muted hover:text-primary hover:bg-surface2'
              }`}
            >
              Organizer
            </Link>
          )}
        </div>

        {/* Actions / User */}
        <div className="flex items-center gap-3 relative z-10">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 pl-2 pr-4 py-2 bg-bg/50 border border-border rounded-full hover:border-emerald/40 transition-all group/btn"
              >
                <div className="w-8 h-8 rounded-full bg-emerald text-black flex items-center justify-center font-black text-[10px] shadow-lg shadow-emerald/10">
                  {getInitials()}
                </div>
                <ChevronDown size={14} className={`text-muted transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="absolute right-0 mt-4 w-60 bg-surface/90 backdrop-blur-3xl border border-border/80 rounded-[2.5rem] p-3 shadow-premium z-20 overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-border/40 mb-2">
                       <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1 opacity-50">Active Session</p>
                       <p className="text-xs font-bold text-primary truncate leading-none">{user.email}</p>
                    </div>
                    
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-emerald hover:text-black rounded-xl transition-all mb-1">
                      <LayoutDashboard size={14} /> My Dashboard
                    </Link>
                    <Link href="/organizer" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-emerald hover:text-black rounded-xl transition-all mb-1">
                       <Rocket size={14} /> Organizer Hub
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald border border-emerald/20 hover:bg-emerald hover:text-black rounded-xl transition-all">
                        <Settings size={14} /> Global Admin
                      </Link>
                    )}
                    
                    <div className="h-px bg-border/40 my-2 mx-4" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/register">
              <button className="bg-emerald text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald/10 flex items-center gap-2">
                Join <span className="hidden sm:inline">Now</span>
                <ChevronDown size={14} className="-rotate-90 group-hover:translate-x-1" />
              </button>
            </Link>
          )}

          {/* Mobile Toggle */}
          <button 
            onClick={() => setShowMobile(!showMobile)}
            className="lg:hidden w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-primary active:scale-90 transition-transform"
          >
            {showMobile ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobile && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 15, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="lg:hidden max-w-[500px] mx-auto bg-surface/90 backdrop-blur-3xl border border-border/60 rounded-[3rem] p-8 shadow-premium"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`p-5 rounded-2xl text-base font-bold transition-all ${path.startsWith(link.href) ? 'bg-emerald text-black' : 'text-primary bg-bg/50 border border-border'}`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-border/40 my-4" />
              
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="p-5 rounded-2xl bg-bg/50 border border-border font-bold text-primary">📊 Dashboard</Link>
                  <Link href="/organizer" className="p-5 rounded-2xl bg-bg/50 border border-border font-bold text-primary">🚀 Organizer Hub</Link>
                  <button onClick={handleLogout} className="p-5 rounded-2xl bg-red-500/10 text-red-500 font-bold border border-red-500/20">Sign Out</button>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/login" className="p-5 rounded-2xl bg-bg/50 border border-border font-bold text-center">Log In</Link>
                  <Link href="/register" className="p-5 rounded-2xl bg-emerald text-black font-black uppercase tracking-widest text-center shadow-emerald/20 shadow-lg">Create Account</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
