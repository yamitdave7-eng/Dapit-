import { NextRequest, NextResponse } from 'next/server';
import { createCommunityPost, databaseError, getCommunityPosts } from '@/lib/db';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const posts = await getCommunityPosts(category);
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
    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const post = await createCommunityPost({
      title: body.title,
      content: body.content,
      authorName: auth.context.profile.display_name,
      authorRole: auth.context.profile.role,
      authorAvatar: body.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      category: body.category || 'Announcement',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : ['Community']),
    }, auth.context.user.id);

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 500 });
  }
}
