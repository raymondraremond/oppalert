import { NextResponse } from 'next/server';

// This removes the NextAuth handler completely.
// Auth is handled by /api/auth/login and /api/auth/register
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
