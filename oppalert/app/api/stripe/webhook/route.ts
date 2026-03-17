import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import pool from '@/lib/db';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          // Update user status
          await pool.query(
            'UPDATE users SET status = $1, stripe_customer_id = $2 WHERE id = $3',
            ['premium', customerId, userId]
          );

          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Insert into subscriptions table
          await pool.query(
            `INSERT INTO subscriptions (user_id, stripe_subscription_id, status, current_period_end)
             VALUES ($1, $2, $3, $4)`,
            [
              userId,
              subscriptionId,
              subscription.status,
              new Date(subscription.current_period_end * 1000)
            ]
          );

          // Send welcome email
          const userRes = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
          const userEmail = userRes.rows[0]?.email;
          
          if (userEmail) {
            await resend.emails.send({
              from: process.env.EMAIL_FROM || 'alerts@oppalert.com',
              to: userEmail,
              subject: "You're now Premium ⚡",
              html: `
                <h1>Welcome to OppAlert Premium!</h1>
                <p>You now have unlimited saved opportunities and instant alerts.</p>
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to Dashboard</a></p>
              `
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await pool.query(
          "UPDATE users SET status = 'free' WHERE stripe_customer_id = $1",
          [customerId]
        );
        
        await pool.query(
          "UPDATE subscriptions SET status = 'canceled' WHERE stripe_subscription_id = $1",
          [subscription.id]
        );
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerEmail = invoice.customer_email;

        if (customerEmail) {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'alerts@oppalert.com',
            to: customerEmail,
            subject: "Action Required: Payment Failed",
            html: `<p>Your payment for OppAlert Premium failed. Please update your payment method to keep your subscription active.</p>`
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

// Ensure the body is not parsed as JSON by Next.js automatically
export const config = {
  api: {
    bodyParser: false,
  },
};
