import { NextRequest, NextResponse } from 'next/server';
import { createCommunityPost, databaseError, getCommunityPosts } from '@/lib/db';
import { getOptionalAccountId, isAuthFailure, requireAccount } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const posts = await getCommunityPosts(category, await getOptionalAccountId());
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  try {
    const body = await request.json();
    if (typeof body.title !== 'string' || !body.title.trim() || typeof body.content !== 'string' || !body.content.trim()) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }
    if (body.title.length > 140 || body.content.length > 5000) return NextResponse.json({ success: false, error: 'Keep titles under 140 characters and posts under 5,000 characters.' }, { status: 400 });
    const categories = ['Announcement', 'Collaboration', 'Local Recommendation', 'Question'];
    if (body.category && !categories.includes(body.category)) return NextResponse.json({ success: false, error: 'Choose a valid post category.' }, { status: 400 });

    const rawTags = Array.isArray(body.tags) ? body.tags : (body.tags ? String(body.tags).split(',') : ['Community']);
    const tags = rawTags.filter((tag: unknown): tag is string => typeof tag === 'string').map((tag: string) => tag.trim().replace(/^#/, '')).filter(Boolean).slice(0, 8);
    const post = await createCommunityPost({
      title: body.title.trim(),
      content: body.content.trim(),
      authorName: auth.context.profile.display_name,
      authorRole: auth.context.profile.role,
      authorAvatar: auth.context.profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      category: body.category || 'Announcement',
      tags,
    }, auth.context.user.id);

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}
