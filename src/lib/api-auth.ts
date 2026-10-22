import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function getOptionalAccountId() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  } catch {
    return undefined;
  }
}

export type { AccountRole, AccountProfile } from '@/types/auth';
import type { AccountRole, AccountProfile } from '@/types/auth';
export type AuthContext = { supabase: Awaited<ReturnType<typeof createClient>>; user: { id: string; email?: string }; profile: AccountProfile };
export type AuthResult = { context: AuthContext } | { response: NextResponse };

export async function requireAccount(roles?: AccountRole[]): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { response: NextResponse.json({ success: false, error: 'Sign in to continue.' }, { status: 401 }) };
    const { data: profile, error } = await supabase.from('profiles').select('id,display_name,role,location,bio,avatar_url').eq('id', user.id).single();
    if (error || !profile) return { response: NextResponse.json({ success: false, error: 'Your account profile is not ready. Confirm your email and try again.' }, { status: 403 }) };
    const context = { supabase, user: { id: user.id, email: user.email }, profile: { ...profile, email: user.email } as AccountProfile };
    if (roles && !roles.includes(context.profile.role)) return { response: NextResponse.json({ success: false, error: 'You do not have permission to do that.' }, { status: 403 }) };
    return { context };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication is unavailable.';
    return { response: NextResponse.json({ success: false, error: message }, { status: 503 }) };
  }
}

export function isAuthFailure(result: AuthResult): result is { response: NextResponse } {
  return 'response' in result;
}

