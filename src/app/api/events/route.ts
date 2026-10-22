import { NextRequest, NextResponse } from 'next/server';
import { getEvents, createEvent } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;

    const events = await getEvents(search, category);
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.businessName || !body.date) {
      return NextResponse.json({ success: false, error: 'Title, host business, and date are required' }, { status: 400 });
    }

    const event = await createEvent({
      title: body.title,
      businessId: body.businessId || 'biz-custom',
      businessName: body.businessName,
      businessImage: body.businessImage || undefined,
      date: body.date,
      time: body.time || '6:00 PM - 8:00 PM',
      location: body.location || 'Local Venue',
      neighborhood: body.neighborhood || 'Community Area',
      category: body.category || 'Workshop',
      description: body.description || '',
      image: body.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      price: body.price || 'Free Admission',
      capacity: Number(body.capacity) || 50,
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/events:', error);
    return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 500 });
  }
}
