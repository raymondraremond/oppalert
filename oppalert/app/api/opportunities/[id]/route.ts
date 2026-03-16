import { NextRequest, NextResponse } from 'next/server'
import { getOpportunity, getRelated } from '@/lib/data'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const opp = getOpportunity(params.id)

  if (!opp) {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  }

  const related = getRelated(params.id, opp.cat, 3)

  return NextResponse.json({ data: opp, related })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Production: verify admin JWT, update in DB
  const body = await request.json()
  return NextResponse.json({ success: true, message: `Opportunity ${params.id} updated`, data: body })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Production: verify admin JWT, soft-delete in DB
  return NextResponse.json({ success: true, message: `Opportunity ${params.id} deleted` })
}
