import { NextRequest, NextResponse } from 'next/server';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';
import { databaseError, setSocialConnection } from '@/lib/db';

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  try {
    const { id } = await context.params;
    if (!id || id === auth.context.user.id) return NextResponse.json({ success: false, error: 'Choose another member.' }, { status: 400 });
    const following = await setSocialConnection(auth.context.user.id, id, 'follow', 'toggle-follow');
    return NextResponse.json({ success: true, data: { following } });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 400 });
  }
}
