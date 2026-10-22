import { NextResponse } from 'next/server';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';
import { databaseError, getAdminAnalytics } from '@/lib/db';

export async function GET() {
  const auth = await requireAccount(['admin']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    return NextResponse.json({ success: true, data: await getAdminAnalytics() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}
