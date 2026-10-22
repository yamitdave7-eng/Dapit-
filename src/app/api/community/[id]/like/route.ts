import { NextRequest, NextResponse } from 'next/server';
import { likeCommunityPost } from '@/lib/db';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const post = await likeCommunityPost(id);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Error in POST /api/community/[id]/like:', error);
    return NextResponse.json({ success: false, error: 'Failed to like post' }, { status: 500 });
  }
}
