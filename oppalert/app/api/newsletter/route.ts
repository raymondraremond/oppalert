import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, frequency } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO newsletter_subscribers (email, frequency) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [email, frequency || 'weekly']
    );

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://oppalert.vercel.app';
    
    // Send welcome email
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'alerts@oppalert.com',
      to: email,
      subject: "Welcome to OppAlert 🎓",
      html: `
        <h1>Welcome to OppAlert!</h1>
        <p>Thanks for subscribing to our newsletter. We'll keep you updated with the latest opportunities.</p>
        <p><a href="${APP_URL}/opportunities">Browse Opportunities</a></p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
