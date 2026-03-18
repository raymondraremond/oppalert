import { NextResponse } from 'next/server'
import { stripHtml } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  let inserted = 0
  let skipped = 0
  let feeds_processed = 0

  const feeds = [
    { url: 'https://opportunitydesk.org/feed', source: 'Opportunity Desk' },
    { url: 'https://afterschoolafrica.com/feed', source: 'After School Africa' }
  ]

  try {
    const { query } = await import('@/lib/db')
    const xml2js = require('xml2js')
    const parser = new xml2js.Parser({ explicitArray: false })
    
    // Attempt constraint
    try {
      await query(`
        ALTER TABLE opportunities 
        ADD CONSTRAINT opportunities_url_unique 
        UNIQUE (application_url)
      `)
    } catch (e) {
      console.warn("Could not add constraint (might already exist):", e)
    }

    for (const feed of feeds) {
      try {
        const res = await fetch(feed.url)
        if (!res.ok) {
          throw new Error(`Failed to fetch feed: ${feed.url}`)
        }
        const xmlText = await res.text()
        const result = await parser.parseStringPromise(xmlText)
        
        const items = result?.rss?.channel?.item || []
        const itemArray = Array.isArray(items) ? items : [items]
        
        for (const item of itemArray) {
          try {
            const title = item.title || ''
            const link = item.link || ''
            const descRaw = item.description || ''
            const description = stripHtml(descRaw).substring(0, 300)
            
            const dbRes = await query(
              `INSERT INTO opportunities 
               (icon, title, organization, category, location,
                funding_type, description, application_url, 
                deadline, days_remaining, is_featured, is_active)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
                       NOW() + INTERVAL '60 days', 60, false, true)
               ON CONFLICT (application_url) DO NOTHING`,
               [
                 '🎓', 
                 title, 
                 feed.source, 
                 'scholarship', 
                 'International',
                 'Fully Funded',
                 description,
                 link
               ]
            )
            
            if (dbRes.rowCount && dbRes.rowCount > 0) {
              inserted++
            } else {
              skipped++
            }
          } catch (itemErr) {
            skipped++
          }
        }
        feeds_processed++
      } catch (feedError) {
        console.error(`Failed to process feed ${feed.url}:`, feedError)
      }
    }

    return NextResponse.json({
      success: true,
      feeds_processed,
      inserted,
      skipped,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("Scholarship sync failed:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
