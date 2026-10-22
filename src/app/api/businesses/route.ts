import { NextRequest, NextResponse } from 'next/server';
import { createBusiness, databaseError, getBusinesses, getOwnedBusinesses } from '@/lib/db';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    if (searchParams.get('mine') === 'true') {
      const auth = await requireAccount(['business_owner', 'admin']);
      if (isAuthFailure(auth)) return auth.response;
      const businesses = auth.context.profile.role === 'admin'
        ? await getBusinesses(search, category)
        : await getOwnedBusinesses(auth.context.user.id);
      return NextResponse.json({ success: true, data: businesses });
    }
    const businesses = await getBusinesses(search, category);
    return NextResponse.json({ success: true, data: businesses });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAccount(['business_owner', 'resident', 'admin']);
  if (isAuthFailure(auth)) return auth.response;
  try {
    const body = await request.json();
    if (!body.name || !body.category || !body.address) {
      return NextResponse.json({ success: false, error: 'Name, category, and address are required' }, { status: 400 });
    }
    const business = await createBusiness({
      name: body.name,
      category: body.category,
      tagline: body.tagline || 'Proud local business serving our community',
      description: body.description || '',
      address: body.address,
      neighborhood: body.neighborhood || 'Local District',
      phone: body.phone || '',
      email: auth.context.user.email || '',
      website: body.website || '',
      image: body.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      openHours: body.openHours || 'By appointment',
      tags: body.tags && body.tags.length > 0 ? body.tags : ['Local Business', 'Community'],
      hiringActive: false,
    }, auth.context.user.id);
    return NextResponse.json({ success: true, data: business }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}
