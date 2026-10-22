import { NextResponse } from 'next/server';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';
import { databaseError, seedDemoRecords } from '@/lib/db';

export async function POST() {
  const auth = await requireAccount(['admin']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    const data = await seedDemoRecords();
    return NextResponse.json({ success: true, message: 'Sample listings are ready.', data });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}
