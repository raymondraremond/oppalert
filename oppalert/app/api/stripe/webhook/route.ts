import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' as any });

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://OppFetch.vercel.app';

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (userId && process.env.DATABASE_URL) {
          const { query } = await import('@/lib/db');

          await query(
            "UPDATE users SET status = 'premium', stripe_customer_id = $1 WHERE id = $2",
            [customerId, userId]
          );

          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await query(
            `INSERT INTO subscriptions (user_id, provider_subscription_id, status, current_period_end)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (provider_subscription_id) DO UPDATE SET status = EXCLUDED.status`,
            [userId, subscriptionId, subscription.status, new Date((subscription as any).current_period_end * 1000)]
          );

          const userRes = await query('SELECT email FROM users WHERE id = $1', [userId]);
          const userEmail = userRes.rows[0]?.email;

          if (userEmail && process.env.RESEND_API_KEY) {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: process.env.EMAIL_FROM || 'alerts@OppFetch.com',
              to: userEmail,
              subject: "You're now Premium on OppFetch \u26A1",
              html: `<h1>Welcome to OppFetch Premium!</h1><p>You now have unlimited saved opportunities and instant alerts.</p><p><a href="${APP_URL}/dashboard">Go to Dashboard</a></p>`
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        if (process.env.DATABASE_URL) {
          const { query } = await import('@/lib/db');
          await query("UPDATE users SET status = 'free' WHERE stripe_customer_id = $1", [customerId]);
          await query(
            "UPDATE subscriptions SET status = 'canceled' WHERE provider_subscription_id = $1",
            [subscription.id]
          );
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerEmail = invoice.customer_email;

        if (customerEmail && process.env.RESEND_API_KEY) {
          const { Resend } = await import('resend');
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'alerts@OppFetch.com',
            to: customerEmail,
            subject: 'Action Required: OppFetch Payment Failed',
            html: '<p>Your payment for OppFetch Premium failed. Please update your payment method to keep your subscription active.</p>'
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
