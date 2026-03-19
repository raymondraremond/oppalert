import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-change-in-production'
  )

  const token =
    request.cookies.get('token')?.value ||
    request.headers.get('Authorization')
      ?.replace('Bearer ', '')

  // Protect API user routes
  if (pathname.startsWith('/api/user')) {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    try {
      await jwtVerify(token, secret)
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Protect dashboard — any logged in user
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      )
    }
    try {
      await jwtVerify(token, secret)
    } catch {
      return NextResponse.redirect(
        new URL('/login', request.url)
      )
    }
  }

  // Protect admin — ONLY admin users
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(
        new URL('/login', request.url)
      )
    }
    try {
      const { payload } = await jwtVerify(token, secret)
      const plan = (payload as any).plan
      if (plan !== 'admin') {
        // Not admin — redirect to dashboard
        return NextResponse.redirect(
          new URL('/dashboard', request.url)
        )
      }
    } catch {
      return NextResponse.redirect(
        new URL('/login', request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/user/:path*'],
}
