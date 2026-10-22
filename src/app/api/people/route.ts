import { NextResponse } from 'next/server';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';
import { databaseError, getPeople } from '@/lib/db';

export async function GET() {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  try {
    return NextResponse.json({ success: true, data: await getPeople(auth.context.user.id) });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}
