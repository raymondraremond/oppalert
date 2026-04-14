export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '@/lib/services/sync-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // In development, we can bypass if CRON_SECRET is not set, 
  // but in production it's mandatory.
  if (process.env.NODE_ENV === 'production' && (!authHeader || authHeader !== `Bearer ${cronSecret}`)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const results = await syncService.syncAll();
    return NextResponse.json({ 
      success: true, 
      message: 'Sync completed successfully',
      results 
    });
  } catch (error: any) {
    console.error('Cron sync failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// Support POST as well for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
