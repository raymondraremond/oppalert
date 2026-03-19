import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const { query } = await import('@/lib/db');

      const userRes = await query(
        'SELECT id, email, password_hash as "passwordHash", full_name as "fullName", status FROM users WHERE email = $1',
        [email.toLowerCase()]
      );

      if (userRes.rows.length === 0) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const user = userRes.rows[0];
      const isValid = await comparePassword(password, user.passwordHash);

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      // Check if admin email
      let userStatus = user.status;
      if (email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
        userStatus = 'admin';
      }

      const token = signToken({ id: user.id, email: user.email, plan: userStatus });

      const response = NextResponse.json({
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName, plan: userStatus }
      });
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      return response;
    }

    // Mock mode
    const mockToken = signToken({ id: 'mock-user-id', email, plan: 'free' });
    const response = NextResponse.json({
      token: mockToken,
      user: { id: 'mock-user-id', email, fullName: 'Demo User', plan: 'free' }
    });
    response.cookies.set('token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
