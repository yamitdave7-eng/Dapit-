import { NextResponse } from 'next/server';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';
import { databaseError, recordLoginEvent } from '@/lib/db';

export async function POST() {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  try {
    await recordLoginEvent(auth.context.user.id, auth.context.user.email || '');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}
