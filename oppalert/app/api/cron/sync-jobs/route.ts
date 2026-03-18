import { NextResponse } from 'next/server'
import { stripHtml } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  let inserted = 0
  let skipped = 0

  try {
    const { query } = await import('@/lib/db')
    
    // Attempt to add unique constraint
    try {
      await query(`
        ALTER TABLE opportunities 
        ADD CONSTRAINT opportunities_url_unique 
        UNIQUE (application_url)
      `)
    } catch (e) {
      // If it already exists or syntax error, just continue
      console.warn("Could not add constraint (might already exist):", e)
    }

    // Fetch from Remotive
    const res = await fetch('https://remotive.com/api/remote-jobs')
    if (!res.ok) {
        throw new Error("Failed to fetch jobs")
    }
    const data = await res.json()
    const jobs = data.jobs || []

    for (const job of jobs) {
      try {
        const description = stripHtml(job.description).substring(0, 300)
        const location = job.candidate_required_location || 'Remote (Worldwide)'
        const result = await query(
          `INSERT INTO opportunities 
           (icon, title, organization, category, location,
            funding_type, description, application_url, 
            deadline, days_remaining, is_featured, is_active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
                   NOW() + INTERVAL '30 days', 30, false, true)
           ON CONFLICT (application_url) DO NOTHING`,
           [
             '💼', 
             job.title, 
             job.company_name, 
             'job', 
             location,
             'Paid Position',
             description,
             job.url
           ]
        )
        
        if (result.rowCount && result.rowCount > 0) {
          inserted++
        } else {
          skipped++
        }
      } catch (insertError: any) {
        skipped++
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      skipped,
      total_fetched: jobs.length,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("Job sync failed:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
