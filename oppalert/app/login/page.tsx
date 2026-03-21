"use client"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid credentials")
        setLoading(false)
        return
      }

      // Set cookie FIRST - middleware reads this
      document.cookie = `token=${data.token}; path=/; max-age=2592000; SameSite=Lax`

      // Set localStorage with complete user object
      localStorage.setItem("user", JSON.stringify({
        id: data.user?.id || "",
        email: data.user?.email || "",
        fullName: data.user?.fullName || data.user?.full_name || "",
        plan: data.user?.plan || data.user?.status || "free",
        token: data.token,
      }))

      // Notify Navbar
      window.dispatchEvent(new Event("storage"))

      const next = searchParams.get("next") || "/dashboard"
      router.push(next)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#141710] border border-[#252D22] rounded-[2.5rem] p-10 md:p-12 shadow-premium">
      <h1 className="font-syne text-2xl font-black text-[#EDE8DF] mb-2 text-center">Welcome Back</h1>
      <p className="text-sm text-[#9A9C8E] mb-10 text-center">Access your personalized opportunity dashboard.</p>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger text-xs font-bold rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#555C50] uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555C50]" />
            <input 
              type="email" required
              className="w-full bg-[#080A07] border border-[#252D22] rounded-xl py-4 pl-12 pr-4 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#555C50] uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555C50]" />
            <input 
              type={showPassword ? "text" : "password"} required
              className="w-full bg-[#080A07] border border-[#252D22] rounded-xl py-4 pl-12 pr-12 text-[#EDE8DF] focus:border-[#E8A020] outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555C50] hover:text-[#EDE8DF]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-5 bg-[#E8A020] text-[#080A07] font-black rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
          {loading ? "Processing..." : "Sign In to OppAlert"}
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-xs text-[#555C50]">Don&apos;t have an account?</p>
        <Link href="/register" className="text-[#E8A020] font-black text-sm hover:underline mt-1 inline-block">Create your free account →</Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#080A07]">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h2 className="font-syne text-3xl font-black text-[#EDE8DF] tracking-tighter">Opp<span className="text-[#E8A020]">Alert</span></h2>
          </Link>
        </div>
        <Suspense fallback={<div className="p-20 text-center text-[#9A9C8E]">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
