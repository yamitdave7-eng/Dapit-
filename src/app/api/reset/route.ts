import { NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/db';

export async function POST() {
  try {
    const data = await resetDatabase();
    return NextResponse.json({ success: true, message: 'Database reset to initial seed data', data });
  } catch (error) {
    console.error('Error in POST /api/reset:', error);
    return NextResponse.json({ success: false, error: 'Failed to reset database' }, { status: 500 });
  }
}
