import { NextRequest, NextResponse } from 'next/server';
import { rsvpEvent } from '@/lib/db';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const userEmail = body.userEmail || 'visitor@dapit.community';

    const result = await rsvpEvent(id, userEmail);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error in POST /api/events/[id]/rsvp:', error);
    return NextResponse.json({ success: false, error: 'Failed to update RSVP' }, { status: 500 });
  }
}
