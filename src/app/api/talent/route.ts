import { NextRequest, NextResponse } from 'next/server';
import { getTalentProfiles, createTalentProfile } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const role = searchParams.get('role') || undefined;

    const talent = await getTalentProfiles(search, role);
    return NextResponse.json({ success: true, data: talent });
  } catch (error) {
    console.error('Error in GET /api/talent:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch talent' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.title || !body.contactEmail) {
      return NextResponse.json({ success: false, error: 'Name, title, and contact email are required' }, { status: 400 });
    }

    const profile = await createTalentProfile({
      name: body.name,
      title: body.title,
      role: body.role || 'Student',
      universityOrOrg: body.universityOrOrg || 'Local Community',
      bio: body.bio || '',
      skills: Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(',').map((s: string) => s.trim()) : ['Communication']),
      lookingFor: Array.isArray(body.lookingFor) ? body.lookingFor : (body.lookingFor ? body.lookingFor.split(',').map((l: string) => l.trim()) : ['Opportunities']),
      avatar: body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      contactEmail: body.contactEmail,
      portfolioUrl: body.portfolioUrl || '',
      isAvailable: body.isAvailable ?? true,
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/talent:', error);
    return NextResponse.json({ success: false, error: 'Failed to create talent profile' }, { status: 500 });
  }
}
