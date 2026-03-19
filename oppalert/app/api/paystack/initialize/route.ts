import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, userId, fullName } = await req.json();

    if (!email || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload = {
      email: email,
      amount: 150000,
      currency: "NGN",
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify`,
      plan: process.env.PAYSTACK_PLAN_CODE,
      metadata: {
        userId: userId,
        fullName: fullName,
        plan: "premium",
      },
    };

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ url: data.data.authorization_url });
  } catch (error: any) {
    console.error("Paystack initialize error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
