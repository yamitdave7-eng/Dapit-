export type AccountRole = 'student' | 'resident' | 'business_owner' | 'admin';
export type AccountProfile = { id: string; display_name: string; role: AccountRole; location: string; bio: string; avatar_url: string; email?: string };
