import { NextRequest, NextResponse } from 'next/server';
import { createEvent, databaseError, getEvents } from '@/lib/db';
import { getOptionalAccountId, isAuthFailure, requireAccount } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;

    const events = await getEvents(search, category, await getOptionalAccountId());
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAccount(['business_owner', 'resident', 'admin']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    const body = await request.json();
    if (!body.title || !body.date) {
      return NextResponse.json({ success: false, error: 'Title, host business, and date are required' }, { status: 400 });
    }

    if (auth.context.profile.role === 'business_owner') {
      const { data: business, error } = await auth.context.supabase.from('marketplace_records').select('owner_id,data').eq('id', body.businessId).eq('kind', 'business').maybeSingle();
      if (error) throw error;
      if (!business || business.owner_id !== auth.context.user.id) return NextResponse.json({ success: false, error: 'Create a place or service listing first, then host an event there.' }, { status: 403 });
      body.businessName = (business.data as { name?: string }).name || body.businessName;
    } else if (auth.context.profile.role === 'resident') {
      body.businessId = `community-${auth.context.user.id}`;
      body.businessName = `${auth.context.profile.display_name} (Community Host)`;
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
    }, auth.context.user.id);

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}
