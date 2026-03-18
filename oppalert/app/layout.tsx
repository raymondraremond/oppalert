import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { NextAuthProvider } from '@/components/providers'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'OppAlert — Never Miss an Opportunity Again',
  description:
    'Discover verified scholarships, remote jobs, fellowships, grants, and startup funding across Africa. Smart alerts. Zero spam.',
  keywords: [
    'scholarships for Africans',
    'remote jobs Nigeria',
    'fellowships Africa',
    'grants for African startups',
    'NYSC programs',
    'international internships',
  ],
  openGraph: {
    title: 'OppAlert — Never Miss an Opportunity Again',
    description: 'Verified scholarships, jobs, fellowships, grants for Africa.',
    siteName: 'OppAlert',
    type: 'website',
  },
}

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <Navbar />
            <main style={{ paddingTop: 70 }}>{children}</main>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
