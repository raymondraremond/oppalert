import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout session for the Premium plan.
 * Returns { url } to redirect the user to Stripe's hosted checkout.
 *
 * Body: { userId, email }
 */
export async function POST(request: NextRequest) {
  const { userId, email } = await request.json()

  if (!userId || !email) {
    return NextResponse.json({ error: 'userId and email are required' }, { status: 400 })
  }

  // --- Production ---
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  //
  // const session = await stripe.checkout.sessions.create({
  //   mode: 'subscription',
  //   payment_method_types: ['card'],
  //   customer_email: email,
  //   line_items: [
  //     {
  //       price: process.env.STRIPE_PREMIUM_PRICE_ID,
  //       quantity: 1,
  //     },
  //   ],
  //   metadata: { userId },
  //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
  //   cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  // })
  //
  // return NextResponse.json({ url: session.url })

  // Mock (dev only)
  return NextResponse.json({
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?upgraded=1`,
  })
}
