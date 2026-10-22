import { NextRequest, NextResponse } from 'next/server';
import { isAuthFailure, requireAccount } from '@/lib/api-auth';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  const { supabase, user } = auth.context;
  const peerId = request.nextUrl.searchParams.get('with');

  if (peerId) {
    if (!uuidPattern.test(peerId) || peerId === user.id) return NextResponse.json({ success: false, error: 'Choose another DAPIT member.' }, { status: 400 });
    const { data: peer, error: peerError } = await supabase.from('profiles').select('id').eq('id', peerId).maybeSingle();
    if (peerError) return NextResponse.json({ success: false, error: peerError.message }, { status: 500 });
    if (!peer) return NextResponse.json({ success: false, error: 'That member could not be found.' }, { status: 404 });

    const { data: messages, error } = await supabase.from('direct_messages').select('id,sender_id,recipient_id,body,created_at,read_at')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${peerId}),and(sender_id.eq.${peerId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true }).limit(300);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    const readAt = new Date().toISOString();
    const unreadIds = (messages || []).filter((message) => message.sender_id === peerId && message.recipient_id === user.id && !message.read_at).map((message) => message.id);
    if (unreadIds.length) {
      const { error: readError } = await supabase.from('direct_messages').update({ read_at: readAt }).in('id', unreadIds);
      if (readError) return NextResponse.json({ success: false, error: readError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: (messages || []).map((message) => unreadIds.includes(message.id) ? { ...message, read_at: readAt } : message) });
  }

  const { data: messages, error } = await supabase.from('direct_messages').select('id,sender_id,recipient_id,body,created_at,read_at')
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(500);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  const latestByPeer = new Map<string, { lastMessage: NonNullable<typeof messages>[number]; unreadCount: number }>();
  for (const message of messages || []) {
    const peer = message.sender_id === user.id ? message.recipient_id : message.sender_id;
    const current = latestByPeer.get(peer);
    if (!current) latestByPeer.set(peer, { lastMessage: message, unreadCount: 0 });
    if (message.sender_id !== user.id && !message.read_at) latestByPeer.get(peer)!.unreadCount++;
  }
  const peerIds = [...latestByPeer.keys()];
  if (!peerIds.length) return NextResponse.json({ success: true, data: [] });
  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id,display_name,role,location,bio,avatar_url').in('id', peerIds);
  if (profilesError) return NextResponse.json({ success: false, error: profilesError.message }, { status: 500 });
  const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]));
  const conversations = [...latestByPeer.entries()].flatMap(([id, summary]) => {
    const person = profileMap.get(id);
    return person ? [{ person, lastMessage: summary.lastMessage, unreadCount: summary.unreadCount }] : [];
  });
  return NextResponse.json({ success: true, data: conversations });
}

export async function POST(request: NextRequest) {
  const auth = await requireAccount();
  if (isAuthFailure(auth)) return auth.response;
  const body = await request.json().catch(() => ({}));
  const recipientId = typeof body.recipientId === 'string' ? body.recipientId : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!uuidPattern.test(recipientId) || recipientId === auth.context.user.id) return NextResponse.json({ success: false, error: 'Choose another DAPIT member.' }, { status: 400 });
  if (!message || message.length > 2000) return NextResponse.json({ success: false, error: 'Messages must be between 1 and 2,000 characters.' }, { status: 400 });

  const { data, error } = await auth.context.supabase.from('direct_messages').insert({ sender_id: auth.context.user.id, recipient_id: recipientId, body: message })
    .select('id,sender_id,recipient_id,body,created_at,read_at').single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, data }, { status: 201 });
}
