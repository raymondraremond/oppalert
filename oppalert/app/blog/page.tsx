'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Bookmark, Search, ChevronRight } from 'lucide-react'

export default function BlogPage() {
  const posts = [
    {
      title: "How to Secure Fully Funded Scholarships in 2024",
      excerpt: "A comprehensive guide on navigating international scholarship applications, from personal statements to letters of recommendation.",
      category: "Scholarships",
      date: "March 20, 2024",
      author: "OppFetch Editorial",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1523050335192-ce127ad46ffb?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Remote Work for Africans: Top 10 High-Paying Skills",
      excerpt: "The global job market is shifting. Discover the exact skills you need to land a high-paying remote job from anywhere in Africa.",
      category: "Remote Jobs",
      date: "March 18, 2024",
      author: "Career Desk",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Startup Funding 101: Navigating the VC Landscape in Lagos",
      excerpt: "An insider's look at the funding rounds, pitch decks, and networking strategies for early-stage founders in Nigeria's tech hub.",
      category: "Founders",
      date: "March 15, 2024",
      author: "Investment Team",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop"
    }
  ]

  return (
    <div className="min-h-screen bg-[#080A07] text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-fade-up">
          <div className="max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-2 text-amber text-xs font-black uppercase tracking-widest mb-8 hover:underline">
              <ArrowLeft size={14} /> Back to Hub
            </Link>
            <h1 className="font-syne text-5xl md:text-7xl font-black mb-6 tracking-tighter">
              Career <span className="text-amber">Blog.</span>
            </h1>
            <p className="text-xl text-subtle leading-relaxed">
              Expert advice, industry insights, and success strategies for the ambitious African professional.
            </p>
          </div>
          <div className="relative w-full md:w-80">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
             <input 
               type="text" 
               placeholder="Search articles..."
               className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-amber/50 outline-none transition-all" 
             />
          </div>
        </div>

        {/* Featured Card */}
        <div className="relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden mb-20 group animate-fade-in shadow-glow-amber/10">
           <img 
             src={posts[0].image} 
             alt="Featured" 
             className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-700"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#080A07] via-[#080A07]/40 to-transparent" />
           <div className="absolute bottom-0 left-0 p-12 max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                 <span className="px-3 py-1 bg-amber text-[#080A07] text-[10px] font-black uppercase tracking-widest rounded-full">{posts[0].category}</span>
                 <span className="text-xs text-subtle font-bold flex items-center gap-1"><Clock size={12} /> {posts[0].readTime}</span>
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight group-hover:text-amber transition-colors">{posts[0].title}</h2>
              <p className="text-subtle mb-8 md:block hidden">{posts[0].excerpt}</p>
              <Link href="#" className="inline-flex items-center gap-2 text-amber text-xs font-black uppercase tracking-widest group/btn">
                Read Full Guide <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, i) => (
            <div key={i} className="group cursor-pointer animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 border border-white/5 bg-white/5 relative">
                 <img 
                   src={post.image} 
                   alt={post.title} 
                   className="w-full h-full object-cover grayscale opacity-20 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" 
                 />
                 <Bookmark className="absolute top-6 right-6 text-white/20 group-hover:text-amber transition-colors" size={20} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-amber uppercase tracking-widest">
                   {post.category} <ChevronRight size={10} /> {post.date}
                </div>
                <h3 className="text-xl font-black leading-[1.3] group-hover:text-amber transition-colors">{post.title}</h3>
                <p className="text-sm text-subtle leading-relaxed line-clamp-3">{post.excerpt}</p>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black">{post.author[0]}</div>
                     <span className="text-xs font-bold text-muted">{post.author}</span>
                   </div>
                   <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter In-page */}
        <div className="mt-32 p-16 rounded-[4rem] bg-bg2 border border-white/5 relative overflow-hidden text-center animate-fade-in">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] rounded-full" />
           <h2 className="text-3xl font-black mb-4 tracking-tight">Don&apos;t miss a beat.</h2>
           <p className="text-subtle mb-10 max-w-sm mx-auto leading-relaxed text-sm">Get our monthly digest of high-impact opportunities directly in your inbox.</p>
           <form className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="flex-grow bg-[#080A07] border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-amber/50 transition-all"
              />
              <button className="bg-amber text-[#080A07] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-glow-amber">
                Join
              </button>
           </form>
        </div>
      </div>
    </div>
  )
}
