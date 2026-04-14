export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { syncService } from '@/lib/services/sync-service';

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    // Support either 'admin' role or 'founder' plane
    if (!decoded || !['admin', 'founder'].includes(decoded.plan)) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    // Ensure schema is fully initialized (e.g. sync_logs table exists)
    if (process.env.DATABASE_URL) {
      try {
        const { query, SCHEMA_SQL } = await import('@/lib/db');
        await query(SCHEMA_SQL);
      } catch (err: any) {
        console.warn('Silent schema initialization warning:', err);
      }
    }

    const results = await syncService.syncAll();
    
    return NextResponse.json({
      success: true,
      message: 'Sync completed',
      results
    });
  } catch (err: any) {
    console.error('Admin sync error:', err);
    return NextResponse.json({ 
      error: 'Sync failed', 
      details: err.message 
    }, { status: 500 });
  }
}
