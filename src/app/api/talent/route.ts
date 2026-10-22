import { NextRequest, NextResponse } from 'next/server';
import { createTalentProfile, databaseError, getTalentProfiles } from '@/lib/db';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const role = searchParams.get('role') || undefined;

    const talent = await getTalentProfiles(search, role);
    return NextResponse.json({ success: true, data: talent });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'A professional title is required.' }, { status: 400 });
    }

    const profile = await createTalentProfile({
      name: auth.context.profile.display_name,
      title: String(body.title).slice(0, 120),
      role: auth.context.profile.role === 'student' ? 'Student' : auth.context.profile.role === 'business_owner' ? 'Local Freelancer' : 'Career Changer',
      universityOrOrg: body.universityOrOrg || 'Local Community',
      bio: body.bio || '',
      skills: Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(',').map((s: string) => s.trim()) : ['Communication']),
      lookingFor: Array.isArray(body.lookingFor) ? body.lookingFor : (body.lookingFor ? body.lookingFor.split(',').map((l: string) => l.trim()) : ['Opportunities']),
      avatar: body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      contactEmail: auth.context.user.email || '',
      portfolioUrl: body.portfolioUrl || '',
      isAvailable: body.isAvailable ?? true,
    }, auth.context.user.id);

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 400 });
  }
}
