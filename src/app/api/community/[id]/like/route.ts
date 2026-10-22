import { NextRequest, NextResponse } from 'next/server';
import { databaseError, likeCommunityPost } from '@/lib/db';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  try {
    const { id } = await context.params;
    const post = await likeCommunityPost(id, auth.context.user.id);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseError(error) }, { status: 400 });
  }
}
