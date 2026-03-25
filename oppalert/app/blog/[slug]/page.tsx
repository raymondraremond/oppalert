'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark, ChevronRight, Facebook, Twitter, Linkedin, MessageSquare } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'

export default function BlogPostDetail() {
  const { slug } = useParams()
  const router = useRouter()
  const post = BLOG_POSTS.find(p => p.slug === slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-[#080A07] text-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-amber hover:underline">Back to Blog</Link>
        </div>
      </div>
    )
  }

  const shareLinks = [
    { icon: Twitter, label: 'Twitter' },
    { icon: Linkedin, label: 'LinkedIn' },
    { icon: Facebook, label: 'Facebook' },
    { icon: MessageSquare, label: 'WhatsApp' }
  ]

  return (
    <div className="min-h-screen bg-[#080A07] text-primary pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-amber text-xs font-black uppercase tracking-widest mb-12 hover:underline animate-fade-up">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
        
        <header className="mb-12 animate-fade-up">
           <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-amber text-[#080A07] text-[10px] font-black uppercase tracking-widest rounded-full">{post.category}</span>
              <span className="text-xs text-subtle font-bold flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
              <span className="text-xs text-subtle font-bold flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
           </div>
           <h1 className="font-syne text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-[1.1]">
             {post.title}
           </h1>
           <div className="flex items-center justify-between py-8 border-y border-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-amber-gradient flex items-center justify-center font-black text-[#080A07]">
                    {post.author[0]}
                 </div>
                 <div>
                    <p className="text-sm font-black">{post.author}</p>
                    <p className="text-[10px] text-muted uppercase tracking-widest">Editorial Team</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-subtle"><Share2 size={18} /></button>
                 <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-subtle"><Bookmark size={18} /></button>
              </div>
           </div>
        </header>

        <div className="aspect-[16/9] w-full rounded-[3rem] overflow-hidden mb-16 animate-fade-in shadow-glow-amber/5">
           <img 
             src={post.image} 
             alt={post.title} 
             className="w-full h-full object-cover grayscale-0 opacity-80" 
           />
        </div>

        <article className="prose prose-invert prose-amber max-w-none animate-fade-up">
           <div className="text-xl text-subtle leading-relaxed italic mb-12 border-l-4 border-amber pl-8">
             {post.excerpt}
           </div>
           
           <div 
             className="text-lg text-subtle leading-relaxed space-y-8 blog-content-styles"
             dangerouslySetInnerHTML={{ __html: post.content }} 
           />
        </article>

        {/* Share & Footer */}
        <footer className="mt-20 pt-12 border-t border-white/5 animate-fade-in">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8 text-center">Share this article</h4>
           <div className="flex justify-center gap-6 mb-16">
              {shareLinks.map((link, i) => (
                <button key={i} className="flex flex-col items-center gap-2 group">
                   <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-subtle group-hover:bg-amber group-hover:text-[#080A07] transition-all">
                      <link.icon size={22} />
                   </div>
                   <span className="text-[10px] font-bold text-muted uppercase group-hover:text-amber transition-colors">{link.label}</span>
                </button>
              ))}
           </div>

           <div className="bg-bg2 p-12 rounded-[3.5rem] border border-white/5 text-center">
              <h3 className="text-2xl font-black mb-4 tracking-tight">Ready to start your journey?</h3>
              <p className="text-subtle mb-10 max-w-sm mx-auto leading-relaxed">Join thousands of African students landing dream opportunities daily.</p>
              <Link href="/register" className="inline-block bg-amber text-[#080A07] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-glow-amber hover:scale-105 active:scale-95 transition-all">
                Get Started Now
              </Link>
           </div>
        </footer>
      </div>

      <style jsx global>{`
        .blog-content-styles h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 2rem;
          color: white;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .blog-content-styles p {
          margin-bottom: 1.5rem;
        }
        .blog-content-styles blockquote {
          background: rgba(255,255,255,0.02);
          border-left: 4px solid var(--amber);
          padding: 2rem;
          font-style: italic;
          border-radius: 0 1.5rem 1.5rem 0;
          margin: 3rem 0;
        }
      `}</style>
    </div>
  )
}
