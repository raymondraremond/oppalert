import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, country, status } = body;

    // Validation
    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const { query } = await import('@/lib/db');

      // Check duplicate email
      const existing = await query(
        'SELECT id FROM users WHERE email = $1',
        [email.toLowerCase()]
      );
      if (existing.rows.length > 0) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }

      // Hash and insert
      const passwordHash = await hashPassword(password);
      let userStatus = status || 'free';

      // Check if admin email
      if (email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
        userStatus = 'admin';
      }

      const insertRes = await query(
        `INSERT INTO users (email, password_hash, full_name, country, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, full_name as "fullName", status`,
        [email.toLowerCase(), passwordHash, fullName, country || null, userStatus]
      );

      const user = insertRes.rows[0];
      const token = signToken({ id: user.id, email: user.email, plan: user.status });

      const response = NextResponse.json(
        { token, user: { id: user.id, email: user.email, fullName: user.fullName, plan: user.status } },
        { status: 201 }
      );
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      return response;
    }

    // Mock mode (no DATABASE_URL)
    const mockToken = signToken({ id: 'mock-user-id', email, plan: 'free' });
    const response = NextResponse.json(
      { token: mockToken, user: { id: 'mock-user-id', email, fullName, plan: 'free' } },
      { status: 201 }
    );
    response.cookies.set('token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;

  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
