import { NextRequest, NextResponse } from 'next/server';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';
import { databaseError, setSocialConnection } from '@/lib/db';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  try {
    const { id } = await context.params;
    if (!id || id === auth.context.user.id) return NextResponse.json({ success: false, error: 'Choose another member.' }, { status: 400 });
    const body = await request.json().catch(() => ({}));
    const action = body.action === 'accept' ? 'accept' : body.action === 'remove' ? 'remove' : 'request';
    const status = await setSocialConnection(auth.context.user.id, id, 'friend', action);
    return NextResponse.json({ success: true, data: { status } });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 400 });
  }
}
