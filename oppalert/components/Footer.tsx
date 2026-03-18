'use client'
import Link from 'next/link'
import { Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-bg" style={{borderColor: 'var(--border)'}}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-amber-gradient shadow-glow-amber flex items-center justify-center">
                 <span className="w-1.5 h-1.5 rounded-full bg-bg" />
              </div>
              <div className="font-syne text-xl font-extrabold tracking-tight">
                Opp<span className="text-amber">Alert</span>
              </div>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-8 max-w-sm">
              The #1 platform for discovering verified opportunities across Africa.
              Empowering the next generation of African leaders.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Instagram, href: '#' }
              ].map((Social, idx) => (
                <a key={idx} href={Social.href} className="w-10 h-10 rounded-xl icon-box flex items-center justify-center text-muted hover:text-amber transition-all duration-300 hover:-translate-y-1">
                  <Social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Product',
              links: [
                { label: 'Opportunities', href: '/opportunities' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Newsletter', href: '/#newsletter' },
                { label: 'Mobile App', href: '#' }
              ]
            },
            {
              title: 'Categories',
              links: [
                { label: 'Scholarships', href: '/opportunities?cat=scholarship' },
                { label: 'Remote Jobs', href: '/opportunities?cat=job' },
                { label: 'Grants', href: '/opportunities?cat=grant' },
                { label: 'Internships', href: '/opportunities?cat=internship' }
              ]
            },
            {
              title: 'Company',
              links: [
                { label: 'About Us', href: '/about' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact', href: '/contact' }
              ]
            }
          ].map((section) => (
            <div key={section.title} className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-muted mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-muted hover:text-amber transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6" style={{borderColor: 'var(--border)'}}>
          <div className="text-[13px] text-subtle font-medium">
            © {new Date().getFullYear()} OppAlert. Built with ❤️ for Africa.
          </div>
          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_10px_rgba(61,170,106,0.6)]" />
               <span className="text-[11px] font-bold text-muted uppercase tracking-widest">Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
