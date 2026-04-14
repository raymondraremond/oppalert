export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(new URL("/pricing?payment=failed", req.url));
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === "success" && data.data.amount >= 150000) {
      const { metadata } = data.data;
      
      const { query } = await import("@/lib/db");
      
      await query(
        "UPDATE users SET status = $1 WHERE id = $2",
        ["premium", metadata.userId]
      );

      return NextResponse.redirect(new URL("/dashboard?upgraded=1", req.url));
    }

    return NextResponse.redirect(new URL("/pricing?payment=failed", req.url));
  } catch (error: any) {
    console.error("Paystack verify error:", error);
    return NextResponse.redirect(new URL("/pricing?payment=failed", req.url));
  }
}
