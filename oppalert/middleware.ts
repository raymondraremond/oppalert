import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define protected routes
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserApiRoute = pathname.startsWith('/api/user');

  if (isDashboardRoute || isAdminRoute || isUserApiRoute) {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET 
    });

    if (!token) {
      if (isUserApiRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // For admin routes, check the status claim
    if (isAdminRoute && token.status !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/user/:path*',
  ],
};
