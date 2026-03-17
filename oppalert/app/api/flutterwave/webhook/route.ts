import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('verif-hash');

    // Verify Flutterwave webhook signature
    if (process.env.FLW_SECRET_HASH && signature !== process.env.FLW_SECRET_HASH) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.completed' && event.data?.status === 'successful') {
      const { tx_ref, customer } = event.data;

      // tx_ref format: "oppalert-{userId}"
      const userId = tx_ref?.replace('oppalert-', '');

      if (userId && process.env.DATABASE_URL) {
        const { query } = await import('@/lib/db');

        await query(
          "UPDATE users SET status = 'premium' WHERE id = $1",
          [userId]
        );

        await query(
          `INSERT INTO subscriptions (user_id, provider, provider_subscription_id, status)
           VALUES ($1, 'flutterwave', $2, 'active')
           ON CONFLICT (provider_subscription_id) DO NOTHING`,
          [userId, tx_ref]
        );

        if (customer?.email && process.env.RESEND_API_KEY) {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
          const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://oppalert.vercel.app';
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'alerts@oppalert.com',
            to: customer.email,
            subject: "You're now Premium on OppAlert \u26A1",
            html: `<h1>Welcome to OppAlert Premium!</h1><p>Your Flutterwave payment was successful. You now have unlimited access.</p><p><a href="${APP_URL}/dashboard">Go to Dashboard</a></p>`
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Flutterwave webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
