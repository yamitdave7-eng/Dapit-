import { NextRequest, NextResponse } from 'next/server';
import { getBusinesses, createBusiness } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;

    const businesses = await getBusinesses(search, category);
    return NextResponse.json({ success: true, data: businesses });
  } catch (error) {
    console.error('Error in GET /api/businesses:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch businesses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
      phone: body.phone || '(555) 000-0000',
      email: body.email || 'info@localbusiness.com',
      website: body.website || '',
      image: body.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      openHours: body.openHours || 'Mon-Fri: 9:00 AM - 6:00 PM',
      tags: body.tags && body.tags.length > 0 ? body.tags : ['Local Business', 'Community'],
      hiringActive: Boolean(body.hiringActive),
    });

    return NextResponse.json({ success: true, data: business }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/businesses:', error);
    return NextResponse.json({ success: false, error: 'Failed to create business' }, { status: 500 });
  }
}
