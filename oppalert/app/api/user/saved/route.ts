import { NextRequest, NextResponse } from 'next/server'

/**
 * GET  /api/user/saved   — list user's saved opportunities
 * POST /api/user/saved   — save an opportunity  { oppId }
 */

function getUserIdFromRequest(_request: NextRequest): string | null {
  // Production: extract from Authorization: Bearer <jwt>
  // const auth = request.headers.get('Authorization')
  // if (!auth) return null
  // const token = auth.replace('Bearer ', '')
  // const payload = jwt.verify(token, process.env.JWT_SECRET!)
  // return (payload as any).id
  return 'usr_001' // mock
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Production: SELECT opportunities.* FROM saved_opportunities JOIN opportunities ON ... WHERE user_id = $1
  return NextResponse.json({ data: [], total: 0 })
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { oppId } = await request.json()
  if (!oppId) return NextResponse.json({ error: 'oppId is required' }, { status: 400 })

  // Production: INSERT INTO saved_opportunities (user_id, opportunity_id) VALUES ($1, $2) ON CONFLICT DO NOTHING
  return NextResponse.json({ success: true, message: 'Opportunity saved' }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const userId = getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { oppId } = await request.json()
  // Production: DELETE FROM saved_opportunities WHERE user_id = $1 AND opportunity_id = $2
  return NextResponse.json({ success: true, message: 'Opportunity removed' })
}
