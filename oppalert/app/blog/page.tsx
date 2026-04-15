'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Bookmark, Search, ChevronRight, Zap } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-bg text-primary pt-32 pb-32 px-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald/5 blur-[150px] rounded-full -z-10 animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-3xl space-y-6">
            <Link href="/" className="group inline-flex items-center gap-3 text-emerald text-[10px] font-black uppercase tracking-[0.3em] hover:translate-x-[-4px] transition-transform">
              <ArrowLeft size={16} /> Back to Hub
            </Link>
            <h4 className="text-[10px] font-black text-emerald uppercase tracking-[0.4em] mb-4">Strategic Insights</h4>
            <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tight leading-none">
              Career <span className="text-emerald italic">Archives.</span>
            </h1>
            <p className="text-xl text-muted font-medium max-w-xl leading-relaxed pt-2">
              Deep-dives, strategy guides, and elite mental models for the next generation of African leaders.
            </p>
          </div>
          <div className="relative w-full lg:w-96 group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-emerald transition-colors" size={20} />
             <input 
               type="text" 
               placeholder="Search the archives..."
               className="w-full bg-surface/30 border border-border/60 rounded-3xl pl-14 pr-6 py-5 text-sm font-bold focus:border-emerald/40 outline-none transition-all shadow-xl shadow-black/20" 
             />
          </div>
        </div>

        {/* Featured Card */}
        <div className="relative group mb-24 cursor-pointer overflow-hidden rounded-[4rem] border border-border/50 shadow-premium aspect-[21/10] md:aspect-[21/8]">
           <img 
             src={BLOG_POSTS[0].image} 
             alt="Featured" 
             className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-1000 grayscale-[40%] group-hover:grayscale-0"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
           <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl relative z-20">
              <div className="flex items-center gap-4 mb-6">
                 <span className="px-5 py-2 bg-emerald text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald/10">{BLOG_POSTS[0].category}</span>
                 <span className="text-xs text-muted font-bold flex items-center gap-2"><Clock size={14} className="text-emerald" /> {BLOG_POSTS[0].readTime}</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1] group-hover:translate-x-2 transition-transform duration-500 drop-shadow-2xl">{BLOG_POSTS[0].title}</h2>
              <p className="text-muted text-lg mb-10 md:block hidden leading-relaxed font-medium opacity-80">{BLOG_POSTS[0].excerpt}</p>
              <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="group/btn relative px-10 py-5 bg-surface backdrop-blur-xl border border-border rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald hover:text-black transition-all flex items-center justify-center w-fit gap-3 overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                Index Full Entry <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
           </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {BLOG_POSTS.slice(1).map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group relative block stagger-children">
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden mb-8 border border-border/40 bg-surface/30 relative shadow-2xl transition-all duration-700 hover:border-emerald/40">
                 <img 
                   src={post.image} 
                   alt={post.title} 
                   className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale-[20%] group-hover:grayscale-0" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                 
                 <button 
                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                   className="absolute top-6 right-6 p-4 rounded-2xl bg-bg/40 backdrop-blur-xl border border-white/5 text-muted hover:text-emerald hover:bg-bg/80 transition-all z-20"
                 >
                    <Bookmark size={20} />
                 </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald uppercase tracking-[0.3em] mb-2 opacity-80">
                   {post.category} <div className="w-1 h-1 rounded-full bg-border" /> {post.date}
                </div>
                <h3 className="font-serif text-3xl font-bold leading-[1.2] group-hover:text-emerald transition-colors tracking-tight opacity-90">{post.title}</h3>
                <p className="text-muted text-sm leading-relaxed line-clamp-2 font-medium italic opacity-70">{post.excerpt}</p>
                
                <div className="pt-8 flex items-center justify-between border-t border-border/40">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-surface2 border border-border flex items-center justify-center text-[10px] font-black text-emerald shadow-lg">{post.author?.[0]}</div>
                     <span className="text-[11px] font-black text-muted uppercase tracking-widest">{post.author}</span>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-surface/50 border border-border/50 rounded-full text-[9px] font-black uppercase tracking-[0.15em] text-muted">
                     <Clock size={12} className="text-emerald" /> {post.readTime}
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Global Connection Section */}
        <div className="mt-40 p-16 md:p-24 rounded-[5rem] bg-surface/30 backdrop-blur-3xl border border-border/50 relative overflow-hidden group">
           <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald/5 blur-[120px] rounded-full animate-float" />
           <div className="max-w-3xl mx-auto text-center relative z-10">
             <div className="w-16 h-16 bg-emerald/10 border border-emerald/20 rounded-2xl flex items-center justify-center text-emerald mx-auto mb-10 shadow-glow-emerald">
                <Zap size={32} />
             </div>
             <h2 className="font-serif text-4xl md:text-6xl font-black text-primary mb-6 tracking-tight">Sync your strategy.</h2>
             <p className="text-muted text-lg mb-12 max-w-lg mx-auto leading-relaxed font-medium">Join 10,000+ top-tier professionals receiving our weekly tactical briefs.</p>
             
             <form className="max-w-md mx-auto relative group-focus-within:scale-[1.02] transition-transform">
                <input 
                  type="email" 
                  placeholder="name@nexus.com" 
                  className="w-full bg-bg border border-border/80 rounded-[2.5rem] px-8 py-5 text-sm outline-none focus:border-emerald/50 transition-all placeholder:opacity-30"
                  required
                />
                <button className="absolute right-2 top-2 bottom-2 bg-emerald text-black px-10 rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald/10">
                  Transmit
                </button>
             </form>
           </div>
        </div>
      </div>
    </div>
  )
}
