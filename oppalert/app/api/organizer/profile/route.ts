import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query } = await import("@/lib/db")
    const result = await query(
      "SELECT * FROM organizer_profiles WHERE user_id = $1",
      [user.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(null)
    }

    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error("Organizer Profile GET error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { organizationName, bio, website, twitter, linkedin, logoUrl } = body

    if (!organizationName) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 })
    }

    const { query } = await import("@/lib/db")
    const result = await query(
      `INSERT INTO organizer_profiles (user_id, organization_name, bio, website, twitter, linkedin, logo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user.id, organizationName, bio, website, twitter, linkedin, logoUrl]
    )

    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error("Organizer Profile POST error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { organizationName, bio, website, twitter, linkedin, logoUrl } = body

    const { query } = await import("@/lib/db")
    const result = await query(
      `UPDATE organizer_profiles SET 
        organization_name = COALESCE($1, organization_name),
        bio = COALESCE($2, bio),
        website = COALESCE($3, website),
        twitter = COALESCE($4, twitter),
        linkedin = COALESCE($5, linkedin),
        logo_url = COALESCE($6, logo_url)
       WHERE user_id = $7
       RETURNING *`,
      [organizationName, bio, website, twitter, linkedin, logoUrl, user.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error("Organizer Profile PATCH error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
