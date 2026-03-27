'use client'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, Twitter, Linkedin, Facebook, ChevronRight, Zap } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  const { slug } = params
  const post = BLOG_POSTS.find(p => p.slug === slug)

  if (!post) return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 bg-glow-amber">
      <div className="w-20 h-20 bg-surface rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-border">🕵️</div>
      <h1 className="font-serif text-3xl font-black text-primary mb-4">Entry Not Found</h1>
      <p className="text-muted mb-8">The requested intelligence report could not be located.</p>
      <Link href="/blog" className="px-8 py-4 bg-amber text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-amber/10">Back to Archives</Link>
    </div>
  )

  const shareLinks = [
    { label: 'X', icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
    { label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
    { label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` }
  ];

  return (
    <div className="min-h-screen bg-bg text-primary pt-32 pb-40 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber/5 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto max-w-4xl">
        <Link href="/blog" className="group inline-flex items-center gap-3 text-amber text-[10px] font-black uppercase tracking-[0.3em] mb-12 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={16} /> Back to Archives
        </Link>
        
        <header className="mb-16">
           <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="px-5 py-2 bg-amber text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber/10">{post.category}</span>
              <div className="flex items-center gap-4 text-xs text-muted font-bold font-mono">
                 <span className="flex items-center gap-2"><Clock size={14} className="text-amber" /> {post.readTime}</span>
                 <div className="w-1 h-1 rounded-full bg-border" />
                 <span className="flex items-center gap-2"><Calendar size={14} className="text-amber" /> {post.date}</span>
              </div>
           </div>
           
           <h1 className="font-serif text-5xl md:text-7xl font-black mb-10 tracking-tight leading-[1.05] text-primary drop-shadow-sm">
             {post.title}
           </h1>

           <div className="flex flex-col md:flex-row md:items-center justify-between py-10 border-y border-border/60 gap-8">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center font-black text-amber text-xl shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-amber/5" />
                    {post.author[0]}
                 </div>
                 <div>
                    <p className="text-[11px] font-black text-muted uppercase tracking-[0.2em] mb-1">Lead Analyst</p>
                    <p className="text-lg font-bold text-primary leading-none">{post.author}</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button 
                   onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                   className="w-12 h-12 flex items-center justify-center bg-surface border border-border rounded-xl text-muted hover:text-amber hover:border-amber/40 transition-all active:scale-90"
                   title="Copy Link"
                 >
                    <Share2 size={18} />
                 </button>
                 <button 
                   className="w-12 h-12 flex items-center justify-center bg-surface border border-border rounded-xl text-muted hover:text-amber hover:border-amber/40 transition-all active:scale-90"
                   title="Bookmark"
                 >
                    <Bookmark size={18} />
                 </button>
              </div>
           </div>
        </header>

        <div className="relative aspect-[16/9] w-full rounded-[4rem] overflow-hidden mb-20 shadow-premium border border-border/50 bg-surface/30 group">
           <img 
             src={post.image} 
             alt={post.title} 
             className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms] grayscale-[30%] group-hover:grayscale-0" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
        </div>

        {/* Content Section */}
        <article className="max-w-none">
           <div className="font-serif text-2xl md:text-3xl text-primary font-bold leading-relaxed mb-16 pl-10 border-l-4 border-amber pt-2 pb-2 relative italic opacity-90">
             <div className="absolute -left-3 -top-1 font-serif text-6xl text-amber/20 opacity-50">&quot;</div>
             {post.excerpt}
           </div>
           
           <div 
             className="article-body text-xl text-muted leading-[1.8] font-medium opacity-90"
             dangerouslySetInnerHTML={{ __html: post.content }} 
           />
        </article>

        {/* Tactical Recommendations / Footer */}
        <footer className="mt-40 pt-20 border-t border-border/60">
           <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber mb-4 text-center md:text-left">Social Transmission</h4>
                 <p className="text-muted font-medium text-center md:text-left">Broadcast this intelligence to your network.</p>
              </div>
              <div className="flex gap-6">
                 {shareLinks.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-3"
                    >
                       <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted group-hover:bg-amber group-hover:text-black group-hover:border-amber transition-all duration-500 shadow-xl group-hover:shadow-amber/20">
                          <link.icon size={20} />
                       </div>
                       <span className="text-[10px] font-black text-muted group-hover:text-primary transition-colors tracking-widest uppercase">{link.label}</span>
                    </a>
                 ))}
              </div>
           </div>

           <div className="relative p-12 md:p-20 bg-surface/30 backdrop-blur-3xl border border-border/50 rounded-[4rem] overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-[100px] rounded-full animate-pulse-soft" />
              <div className="relative z-10 text-center space-y-8">
                 <div className="w-14 h-14 bg-amber/10 border border-amber/20 rounded-2xl flex items-center justify-center text-amber mx-auto shadow-glow-amber">
                    <Zap size={24} />
                 </div>
                 <h3 className="font-serif text-4xl font-bold text-primary tracking-tight">Accelerate your progression.</h3>
                 <p className="text-muted text-lg max-w-sm mx-auto font-medium">Connect with top-tier opportunities indexed daily for the next generation of African talent.</p>
                 <Link href="/register" className="inline-flex relative px-12 py-5 bg-amber text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-amber/10 hover:scale-105 active:scale-95 transition-all">
                    Initiate Member Account
                 </Link>
              </div>
           </div>
        </footer>
      </div>

      <style jsx global>{`
        .article-body h2 {
          font-family: var(--font-dm-serif), serif;
          font-size: 2.25rem;
          line-height: 1.1;
          color: var(--primary);
          margin-top: 4rem;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
        }
        .article-body p {
          margin-bottom: 2rem;
        }
        .article-body blockquote {
          font-family: var(--font-dm-serif), serif;
          font-style: italic;
          font-size: 1.5rem;
          color: var(--primary);
          background: var(--surface2);
          border-left: 4px solid var(--amber);
          padding: 3rem;
          margin: 4rem 0;
          border-radius: 0 2rem 2rem 0;
          opacity: 0.9;
        }
        .article-body strong {
          color: var(--primary);
          font-weight: 800;
        }
        @media (max-width: 768px) {
          .article-body h2 { font-size: 1.75rem; }
        }
      `}</style>
    </div>
  )
}
