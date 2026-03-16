import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/newsletter
 * Body: { email, frequency?: 'daily' | 'weekly' }
 *
 * Production: validate, store in DB, send welcome email via Resend.
 */
export async function POST(request: NextRequest) {
  const { email, frequency = 'weekly' } = await request.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  // --- Production: store subscriber + send welcome email ---
  // await db.query(
  //   'INSERT INTO newsletter_subscribers (email, frequency) VALUES ($1, $2) ON CONFLICT DO NOTHING',
  //   [email, frequency]
  // )
  //
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: process.env.EMAIL_FROM!,
  //   to: email,
  //   subject: 'Welcome to OppAlert Weekly 🎓',
  //   html: '<p>You\'re in! Check your inbox every Monday for the best opportunities.</p>',
  // })

  return NextResponse.json({ success: true, message: 'Subscribed successfully', email, frequency })
}
