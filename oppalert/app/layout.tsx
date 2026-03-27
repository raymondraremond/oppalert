import type { Metadata } from 'next'
import { Syne, Inter, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import CapsuleNav from '@/components/CapsuleNav'
import Footer from '@/components/Footer'
import { NextAuthProvider } from '@/components/providers'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'OppFetch — Never Miss an Opportunity Again',
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
    title: 'OppFetch — Never Miss an Opportunity Again',
    description: 'Verified scholarships, jobs, fellowships, grants for Africa.',
    siteName: 'OppFetch',
    type: 'website',
    url: 'https://OppFetch.vercel.app',
  },
}

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
  display: 'swap',
  preload: true,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${dmSerif.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-primary min-h-screen flex flex-col">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <CapsuleNav />
            <main className="flex-grow">{children}</main>
            <Footer />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
