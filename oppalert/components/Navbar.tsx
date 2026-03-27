'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { User, LogOut, ChevronDown, Menu, X, LayoutDashboard, Briefcase, Zap } from 'lucide-react'

export default function Navbar() {
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
    { href: '/opportunities', label: 'Opportunities' },
    { href: '/events', label: 'Events' },
    { href: '/pricing', label: 'Pricing' },
  ]

  // Hide navbar on auth pages
  if (path === '/login' || path === '/register') return null

  return (
    <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
      scrolled 
        ? 'py-4 bg-bg/70 backdrop-blur-2xl border-b border-border/40 shadow-xl' 
        : 'py-6 bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto max-w-7xl px-6 flex items-center justify-between">
        
        {/* Branding */}
        <Link href="/" className="group flex items-center gap-3 transition-transform active:scale-95 outline-none">
          <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center shadow-inner relative overflow-hidden group-hover:border-amber/40 transition-colors">
            <div className="absolute inset-0 bg-amber/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="/icon.png" alt="OppAlert" className="w-5 h-5 object-contain relative z-10 filter drop-shadow-sm" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-primary">
            Opp<span className="text-amber italic">Alert</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center bg-surface/40 backdrop-blur-xl border border-border/60 rounded-full px-2 py-1 shadow-sm">
          {navLinks.map(link => {
            const isActive = path === link.href || path.startsWith(link.href + '/')
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  isActive 
                    ? 'bg-amber text-black shadow-lg shadow-amber/10' 
                    : 'text-muted hover:text-primary hover:bg-surface2'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 pl-2 pr-4 py-2 bg-surface/40 border border-border rounded-full hover:border-amber/40 transition-all active:scale-95"
              >
                <div className="w-8 h-8 rounded-full bg-amber text-black flex items-center justify-center font-black text-[10px] shadow-lg shadow-amber/10">
                  {getInitials()}
                </div>
                <ChevronDown size={14} className={`text-muted transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-14 w-64 bg-surface/90 backdrop-blur-2xl border border-border rounded-[2rem] p-3 shadow-premium animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-4 mb-2 border-b border-border/40">
                    <p className="text-sm font-bold text-primary truncate leading-none mb-1">{user?.fullName || user?.full_name || 'User'}</p>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider truncate opacity-60">{user?.email}</p>
                  </div>
                  
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-amber hover:text-black rounded-xl transition-all mb-1">
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <Link href="/organizer" className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-amber hover:text-black rounded-xl transition-all mb-1">
                    <Briefcase size={14} /> Organizer Portal
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-amber hover:bg-amber hover:text-black rounded-xl transition-all mb-1 border border-amber/20">
                      <Zap size={14} /> Admin Panel
                    </Link>
                  )}
                  
                  <div className="h-px bg-border/40 my-2" />
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted hover:text-amber transition-colors">
                Log In
              </Link>
              <Link href="/register" className="px-8 py-4 bg-amber text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber/10">
                Join Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => setShowMobile(!showMobile)}
            className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary"
          >
            {showMobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobile && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-bg/95 backdrop-blur-3xl z-[90] p-6 animate-in slide-in-from-top duration-300">
           <div className="space-y-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="block p-6 bg-surface/40 border border-border rounded-3xl text-lg font-bold text-primary active:bg-surface transition-colors">
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-8 space-y-4">
                 {isLoggedIn ? (
                   <>
                     <Link href="/dashboard" className="block p-5 bg-amber text-black rounded-2xl font-black uppercase tracking-widest text-center shadow-lg shadow-amber/10">
                        Go to Dashboard
                     </Link>
                     <button onClick={handleLogout} className="w-full p-5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase tracking-widest">
                        Sign Out
                     </button>
                   </>
                 ) : (
                   <div className="grid grid-cols-1 gap-4">
                      <Link href="/register" className="p-6 bg-amber text-black rounded-[2.5rem] font-black uppercase tracking-widest text-center shadow-xl shadow-amber/10">
                        Join OppAlert Free
                      </Link>
                      <Link href="/login" className="p-6 bg-surface border border-border rounded-[2.5rem] font-bold text-muted text-center">
                        Already have an account? Log In
                      </Link>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </header>
  )
}
