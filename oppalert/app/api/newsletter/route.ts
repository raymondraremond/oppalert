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

    if (process.env.GMAIL_EMAIL && process.env.GMAIL_APP_PASSWORD) {
      const nodemailer = await import("nodemailer");
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://oppalert.vercel.app";
      
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `"OppAlert" <${process.env.GMAIL_EMAIL}>`,
        to: email,
        subject: "Welcome to OppAlert \uD83C\uDF93",
        html: `<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Welcome to OppAlert! \uD83C\uDF89</h2>
          <p style="color: #555; line-height: 1.6;">You have successfully subscribed to our premium alerts.</p>
          <p style="color: #555; line-height: 1.6;">To ensure you never miss out on exclusive scholarships and jobs, click the link below to verify your subscription and explore opportunities:</p>
          <div style="margin-top: 25px;">
            <a href="${APP_URL}/opportunities" style="display:inline-block; padding: 14px 28px; background-color: #E8A020; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify & Browse Opportunities</a>
          </div>
        </div>`
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
