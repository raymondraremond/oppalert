import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/stripe/webhook
 *
 * Stripe sends events here after payment events.
 * Set this URL in your Stripe dashboard → Webhooks.
 *
 * Handles:
 *   checkout.session.completed    → activate premium subscription
 *   customer.subscription.deleted → downgrade user to free
 *   invoice.payment_failed        → notify user, attempt retry
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature') ?? ''

  // --- Production: verify webhook signature ---
  // const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY)
  // const event   = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)

  // Mock: parse body directly (dev only)
  let event: { type: string; data: { object: Record<string, unknown> } }
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      // Production:
      // const customerId = session.customer as string
      // await db.query(
      //   "UPDATE users SET status = 'premium' WHERE stripe_customer_id = $1",
      //   [customerId]
      // )
      console.log('✅ Checkout completed:', session)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      // Production:
      // const customerId = subscription.customer as string
      // await db.query(
      //   "UPDATE users SET status = 'free' WHERE stripe_customer_id = $1",
      //   [customerId]
      // )
      console.log('⚠️ Subscription cancelled:', subscription)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      // Production: send "payment failed" email via Resend
      console.log('❌ Payment failed:', invoice)
      break
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
