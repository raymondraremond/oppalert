import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PROTECTED_ROUTES = [
  '/dashboard',
  '/organizer',
  '/admin',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const needsAuth = PROTECTED_ROUTES.some(
    route => pathname.startsWith(route)
  )

  if (!needsAuth) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback-secret'
    )
    const { payload } = await jwtVerify(token, secret)

    // Admin only routes
    if (pathname.startsWith('/admin')) {
      const plan = (payload as any).plan
      if (plan !== 'admin') {
        return NextResponse.redirect(
          new URL('/dashboard', request.url)
        )
      }
    }

    return NextResponse.next()
  } catch {
    // Token invalid or expired
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/organizer/:path*',
  ],
}
