import { NextRequest, NextResponse } from 'next/server';
import { getCommunityPosts, createCommunityPost } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const posts = await getCommunityPosts(category);
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Error in GET /api/community:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch community posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.content || !body.authorName) {
      return NextResponse.json({ success: false, error: 'Title, content, and author are required' }, { status: 400 });
    }

    const post = await createCommunityPost({
      title: body.title,
      content: body.content,
      authorName: body.authorName,
      authorRole: body.authorRole || 'Community Member',
      authorAvatar: body.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      category: body.category || 'Announcement',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : ['Community']),
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/community:', error);
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}
