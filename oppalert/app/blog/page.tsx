'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Bookmark, Search, ChevronRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'

export default function BlogPage() {
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
        <div className="relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden mb-20 group animate-fade-in shadow-glow-amber/20 border border-white/10">
           <img 
             src={BLOG_POSTS[0].image} 
             alt="Featured" 
             className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#080A07] via-[#080A07]/20 to-transparent" />
           <div className="absolute bottom-0 left-0 p-12 max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                 <span className="px-3 py-1 bg-amber text-[#080A07] text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse-slow">{BLOG_POSTS[0].category}</span>
                 <span className="text-xs text-subtle font-bold flex items-center gap-1"><Clock size={12} /> {BLOG_POSTS[0].readTime}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight group-hover:text-amber transition-colors drop-shadow-2xl">{BLOG_POSTS[0].title}</h2>
              <p className="text-subtle mb-8 md:block hidden leading-relaxed">{BLOG_POSTS[0].excerpt}</p>
              <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="inline-flex items-center gap-3 text-amber text-xs font-black uppercase tracking-widest group/btn bg-white/5 border border-white/10 px-6 py-3 rounded-xl hover:bg-amber hover:text-[#080A07] transition-all">
                Read Full Guide <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {BLOG_POSTS.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group cursor-pointer animate-fade-up block relative animate-float" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 border border-white/10 bg-white/5 relative shadow-glow-amber/0 group-hover:shadow-glow-amber/10 transition-shadow">
                 <img 
                   src={post.image} 
                   alt={post.title} 
                   className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 bg-bg2" 
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop';
                   }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#080A07]/80 to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                 <button 
                   title="Bookmark article"
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     alert('Article bookmarked!');
                   }}
                   className="absolute top-6 right-6 p-3 rounded-xl bg-black/40 border border-white/10 text-white/40 hover:text-amber hover:bg-black/60 transition-all z-20 backdrop-blur-md"
                 >
                    <Bookmark size={20} />
                 </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-amber uppercase tracking-[0.2em] mb-2">
                   {post.category} <ChevronRight size={10} className="text-white/20" /> {post.date}
                </div>
                <h3 className="text-2xl font-black leading-[1.2] group-hover:text-amber transition-colors tracking-tight">{post.title}</h3>
                <p className="text-sm text-subtle leading-relaxed line-clamp-2 italic">{post.excerpt}</p>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-bg2 border border-white/10 flex items-center justify-center text-[11px] font-black text-amber">{post.author?.[0] || 'O'}</div>
                     <span className="text-xs font-bold text-muted group-hover:text-white transition-colors">{post.author}</span>
                   </div>
                   <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                     <Clock size={10} /> {post.readTime}
                   </div>
                </div>
              </div>
              
              {/* Subtle ambient float effect on title */}
              <div className="absolute -inset-4 bg-amber/0 group-hover:bg-amber/[0.02] rounded-[3rem] -z-10 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Newsletter In-page */}
        <div className="mt-32 p-16 rounded-[4rem] bg-bg2 border border-white/5 relative overflow-hidden text-center animate-fade-in">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] rounded-full animate-pulse-slow" />
           <h2 className="text-3xl font-black mb-4 tracking-tight">Don&apos;t miss a beat.</h2>
           <p className="text-subtle mb-10 max-w-sm mx-auto leading-relaxed text-sm">Get our monthly digest of high-impact opportunities directly in your inbox.</p>
           <form className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="flex-grow bg-[#080A07] border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-amber/50 transition-all"
                required
              />
              <button className="bg-amber text-[#080A07] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-glow-amber">
                Join
              </button>
           </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}


