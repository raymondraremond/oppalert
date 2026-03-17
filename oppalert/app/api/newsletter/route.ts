import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, frequency } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const { query } = await import('@/lib/db');
      await query(
        'INSERT INTO newsletter_subscribers (email, frequency) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
        [email.toLowerCase(), frequency || 'weekly']
      );
    }

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://oppalert.vercel.app';
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'alerts@oppalert.com',
        to: email,
        subject: 'Welcome to OppAlert \uD83C\uDF93',
        html: `<h1>Welcome to OppAlert!</h1><p>Thanks for subscribing. We will keep you updated with the latest opportunities across Africa and beyond.</p><p><a href="${APP_URL}/opportunities">Browse Opportunities</a></p>`
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
