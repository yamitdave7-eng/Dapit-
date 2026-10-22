import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ success: true, data: null });
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) throw error;
    return NextResponse.json({ success: true, data: { ...profile, email: user.email } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load account';
    return NextResponse.json({ success: false, error: message }, { status: 503 });
  }
}
