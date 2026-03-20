import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      orgName, contactEmail, listingType, title, location,
      startDate, deadline, cost, description, eligibility,
      benefits, applicationUrl, organizerWebsite, socialHandle
    } = body

    if (!title || !contactEmail || !orgName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Try to save to database
    if (process.env.DATABASE_URL) {
      try {
        const { query } = await import('@/lib/db')
        await query(
          `INSERT INTO pending_opportunities 
            (org_name, contact_email, listing_type, title, location, start_date, deadline, cost, description, eligibility, benefits, application_url, organizer_website, social_handle)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [orgName, contactEmail, listingType, title, location, startDate || null, deadline || null, cost, description, eligibility, benefits, applicationUrl, organizerWebsite, socialHandle]
        )
      } catch (dbErr) {
        console.error('DB insert failed for submission, logging instead:', dbErr)
        console.log('PENDING_SUBMISSION:', JSON.stringify(body))
      }
    } else {
      // No DB — just log it
      console.log('PENDING_SUBMISSION (no DB):', JSON.stringify(body))
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Submit listing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
