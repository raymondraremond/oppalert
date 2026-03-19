import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY as string;
    const expectedSignature = crypto.createHmac("sha512", secret).update(bodyText).digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    if (event.event === "charge.success") {
      const { metadata } = event.data;
      if (metadata && metadata.userId) {
        const { query } = await import("@/lib/db");
        await query(
          "UPDATE users SET status = $1 WHERE id = $2",
          ["premium", metadata.userId]
        );
      }
    } else if (event.event === "subscription.disable") {
      const email = event.data.customer?.email;
      if (email) {
        const { query } = await import("@/lib/db");
        await query(
          "UPDATE users SET status = $1 WHERE email = $2",
          ["free", email]
        );
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
