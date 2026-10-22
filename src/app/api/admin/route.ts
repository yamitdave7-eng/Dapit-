import { NextRequest, NextResponse } from 'next/server';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';
import { databaseError, getAdminRecords, getAdminSummary, getAdminUsers, removeMarketplaceRecord, updateUserRole } from '@/lib/db';

export async function GET() {
  const auth = await requireAccount(['admin']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    const [summary, users, records] = await Promise.all([getAdminSummary(), getAdminUsers(), getAdminRecords()]);
    return NextResponse.json({ success: true, data: { summary, users, records } });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAccount(['admin']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    const body = await request.json();
    const allowed = ['student', 'resident', 'business_owner', 'admin'];
    if (typeof body.id !== 'string' || !allowed.includes(body.role)) {
      return NextResponse.json({ success: false, error: 'Choose an account and a valid role.' }, { status: 400 });
    }
    if (body.id === auth.context.user.id) {
      return NextResponse.json({ success: false, error: 'You cannot change your own administrator role.' }, { status: 400 });
    }
    const user = await updateUserRole(body.id, body.role);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAccount(['admin']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    const { id } = await request.json();
    if (typeof id !== 'string') return NextResponse.json({ success: false, error: 'A listing ID is required.' }, { status: 400 });
    await removeMarketplaceRecord(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 400 });
  }
}
