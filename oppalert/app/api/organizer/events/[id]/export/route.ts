import { NextRequest } from "next/server"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { query } = await import("@/lib/db")
    
    // Verify ownership
    const ownerCheck = await query(
      "SELECT id, title FROM events WHERE id = $1 AND organizer_id = $2",
      [params.id, user.id]
    )

    if (ownerCheck.rows.length === 0) {
      return new Response("Event not found or unauthorized", { status: 404 })
    }

    const eventTitle = ownerCheck.rows[0].title
    const result = await query(
      `SELECT full_name, email, phone, registered_at, payment_status, amount_paid, attended 
       FROM event_registrations 
       WHERE event_id = $1 
       ORDER BY registered_at DESC`,
      [params.id]
    )

    const headers = ["Full Name", "Email", "Phone", "Registered At", "Payment Status", "Amount Paid", "Attended"]
    const rows = result.rows.map(reg => [
      reg.full_name,
      reg.email,
      reg.phone,
      reg.registered_at.toISOString(),
      reg.payment_status,
      reg.amount_paid,
      reg.attended ? "Yes" : "No"
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val}"`).join(","))
    ].join("\n")

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="attendees-${params.id}.csv"`,
      },
    })
  } catch (err) {
    console.error("Organizer Export GET error:", err)
    return new Response("Internal server error", { status: 500 })
  }
}
