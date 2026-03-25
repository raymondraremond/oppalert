'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Calendar, Share2, Bookmark, Twitter, Linkedin, Facebook } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-data'

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  const { slug } = params
  const post = BLOG_POSTS.find(p => p.slug === slug)

  if (!post) return <div className="min-h-screen border-t border-white/5 bg-[#080A07] pt-32 text-center text-white">Post not found</div>

  const shareLinks = [
    { 
      label: 'Twitter', 
      icon: Twitter, 
      color: '#1DA1F2',
      bg: 'hover:bg-[#1DA1F2]',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`
    },
    { 
      label: 'LinkedIn', 
      icon: Linkedin, 
      color: '#0077B5',
      bg: 'hover:bg-[#0077B5]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`
    },
    { 
      label: 'Facebook', 
      icon: Facebook, 
      color: '#1877F2',
      bg: 'hover:bg-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`
    },
    { 
      label: 'WhatsApp', 
      icon: ({ size }: { size: number }) => (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      color: '#25D366',
      bg: 'hover:bg-[#25D366]',
      href: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`
    }
  ];

  return (
    <div className="min-h-screen bg-[#080A07] text-primary pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-amber text-xs font-black uppercase tracking-widest mb-12 hover:underline animate-fade-up">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
        
        <header className="mb-12 animate-fade-up">
           <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-amber text-[#080A07] text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse-slow">{post.category}</span>
              <span className="text-xs text-subtle font-bold flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
              <span className="text-xs text-subtle font-bold flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
           </div>
           <h1 className="font-syne text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-[1.1] text-white">
             {post.title}
           </h1>
           <div className="flex items-center justify-between py-8 border-y border-white/10 bg-white/[0.01] px-6 rounded-2xl">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-amber-gradient flex items-center justify-center font-black text-[#080A07] shadow-glow-amber/20">
                    {post.author[0]}
                 </div>
                 <div>
                    <p className="text-sm font-black text-white">{post.author}</p>
                    <p className="text-[10px] text-muted uppercase tracking-widest">OppFetch Editorial Team</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button 
                   title="Copy Article Link"
                   onClick={() => {
                     navigator.clipboard.writeText(window.location.href);
                     alert('Article link copied to clipboard!');
                   }}
                   className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-amber hover:text-[#080A07] transition-all text-subtle"
                 >
                    <Share2 size={18} />
                 </button>
                 <button 
                   title="Bookmark for later"
                   onClick={() => alert('Article added to your bookmarks!')}
                   className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-amber hover:text-[#080A07] transition-all text-subtle"
                 >
                    <Bookmark size={18} />
                 </button>
              </div>
           </div>
        </header>

        <div className="aspect-[16/9] w-full rounded-[3.5rem] overflow-hidden mb-16 animate-fade-in shadow-glow-amber/10 border border-white/10 bg-bg2">
           <img 
             src={post.image} 
             alt={post.title} 
             className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-1000" 
             onError={(e) => {
               (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop';
             }}
           />
        </div>

        <article className="prose prose-invert prose-amber max-w-none animate-fade-up">
           <div className="text-xl md:text-2xl text-white/90 leading-relaxed italic mb-12 border-l-4 border-amber pl-8 py-2 bg-amber/[0.02] rounded-r-2xl">
             {post.excerpt}
           </div>
           
           <div 
             className="text-lg text-subtle leading-relaxed space-y-8 blog-content-styles"
             dangerouslySetInnerHTML={{ __html: post.content }} 
           />
        </article>

        {/* Share & Footer */}
        <footer className="mt-32 pt-12 border-t border-white/10 animate-fade-in">
           <div className="text-center mb-12">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber mb-4">Sharing is Caring</h4>
              <p className="text-sm text-subtle">Help others discover this opportunity.</p>
           </div>
           
           <div className="flex justify-center gap-8 mb-20">
              {shareLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 group"
                >
                   <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-subtle ${link.bg} group-hover:text-white group-hover:shadow-lg transition-all duration-500`}>
                      <link.icon size={24} />
                   </div>
                   <span className="text-[10px] font-bold text-muted uppercase tracking-widest group-hover:text-white transition-colors">{link.label}</span>
                </a>
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
