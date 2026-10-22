'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, BriefcaseBusiness, CalendarDays, LoaderCircle, ShieldCheck, Store, Trash2, UsersRound, WandSparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { AccountRole } from '@/types/auth';

type AdminState = {
  summary: { users: number; applications: number; records: Record<string, number> };
  users: { id: string; display_name: string; role: AccountRole; location: string; created_at: string }[];
  records: { id: string; kind: string; owner_id: string | null; data: Record<string, unknown>; created_at: string }[];
};

const roleLabels: Record<AccountRole, string> = { student: 'Job seeker', resident: 'Member', business_owner: 'Business', admin: 'Admin' };

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<AdminState | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data: { user } } = await createClient().auth.getUser();
    if (!user) { router.replace('/login?next=/admin'); return; }
    setCurrentUserId(user.id);
    const response = await fetch('/api/admin', { cache: 'no-store' });
    const json = await response.json();
    if (response.status === 403) { router.replace('/'); return; }
    if (!response.ok || !json.success) throw new Error(json.error || 'Unable to load administrator tools.');
    setState(json.data);
  }, [router]);

  useEffect(() => { const timer = window.setTimeout(() => { load().catch((caught) => setError(caught instanceof Error ? caught.message : 'Unable to load administrator tools.')); }, 0); return () => window.clearTimeout(timer); }, [load]);

  async function request(url: string, method: string, body?: unknown) {
    const response = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(json.error || 'That action could not be completed.');
    return json;
  }

  async function changeRole(id: string, role: AccountRole) {
    setBusy(true); setError(''); setNotice('');
    try { await request('/api/admin', 'PATCH', { id, role }); await load(); setNotice('Account role updated.'); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not update that account.'); }
    finally { setBusy(false); }
  }

  async function removeRecord(id: string) {
    if (!window.confirm('Remove this listing from DAPIT? This action cannot be undone.')) return;
    setBusy(true); setError(''); setNotice('');
    try { await request('/api/admin', 'DELETE', { id }); await load(); setNotice('Listing removed.'); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not remove that listing.'); }
    finally { setBusy(false); }
  }

  async function seedSamples() {
    setBusy(true); setError(''); setNotice('');
    try { const result = await request('/api/admin/seed', 'POST'); await load(); setNotice(`${result.data.count} sample listings are available. Existing listings were kept.`); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not load sample listings.'); }
    finally { setBusy(false); }
  }

  async function signOut() { await createClient().auth.signOut(); router.replace('/login'); }

  if (!state && !error) return <main className="grid min-h-screen place-items-center bg-[#f5f7f4] dark:bg-[#111a16]"><LoaderCircle className="h-7 w-7 animate-spin text-emerald-700" /></main>;

  return <main className="min-h-screen bg-[#f5f7f4] text-[#17251d] dark:bg-[#111a16] dark:text-[#edf4ef]">
    <header className="border-b border-[#e4e9e4] bg-white dark:border-[#304238] dark:bg-[#1b2821]"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-800 dark:text-slate-300"><ArrowLeft className="h-4 w-4" /> Back to DAPIT</Link><button onClick={signOut} className="text-sm font-semibold text-slate-600 hover:text-emerald-800 dark:text-slate-300">Sign out</button></div></header>
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-br from-[#174d37] to-[#102d22] p-6 text-white sm:flex-row sm:items-end sm:p-8"><div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"><ShieldCheck className="h-4 w-4" /> Administrator workspace</span><h1 className="mt-4 text-3xl font-semibold tracking-tight">Marketplace control center</h1><p className="mt-2 max-w-xl text-sm leading-6 text-emerald-100">Manage member access, review listings, and keep DAPIT running smoothly.</p></div><div className="flex flex-wrap gap-2"><Link href="/admin/analytics" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"><BarChart3 className="h-4 w-4" /> Analytics</Link><button disabled={busy} onClick={seedSamples} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#174d37] shadow-sm transition hover:bg-emerald-50 disabled:opacity-60"><WandSparkles className="h-4 w-4" /> Load sample marketplace</button></div></section>
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">{notice}</p>}
      {state && <>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
          { label: 'Members', value: state.summary.users, icon: UsersRound },
          { label: 'Businesses & services', value: state.summary.records.business || 0, icon: Store },
          { label: 'Jobs & projects', value: state.summary.records.job || 0, icon: BriefcaseBusiness },
          { label: 'Applications', value: state.summary.applications, icon: CalendarDays },
        ].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-[#e4e9e4] bg-white p-5 dark:border-[#304238] dark:bg-[#1b2821]"><Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /><p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p></div>)}</section>

        <section className="overflow-hidden rounded-2xl border border-[#e4e9e4] bg-white dark:border-[#304238] dark:bg-[#1b2821]"><div className="border-b border-[#e4e9e4] px-5 py-4 dark:border-[#304238]"><h2 className="font-semibold">Member accounts</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Change account roles. Admin access can only be assigned here by an administrator.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-[#142019] dark:text-slate-400"><tr><th className="px-5 py-3">Member</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Joined</th></tr></thead><tbody>{state.users.map((user) => <tr key={user.id} className="border-t border-slate-100 dark:border-slate-700"><td className="px-5 py-3 font-medium">{user.display_name}{user.id === currentUserId && <span className="ml-2 text-xs text-slate-400">You</span>}</td><td className="px-5 py-3 text-slate-500 dark:text-slate-400">{user.location || '—'}</td><td className="px-5 py-3"><select aria-label={`Role for ${user.display_name}`} value={user.role} disabled={busy || user.id === currentUserId} onChange={(event) => changeRole(user.id, event.target.value as AccountRole)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-[#142019]">{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td><td className="px-5 py-3 text-xs text-slate-500 dark:text-slate-400">{new Date(user.created_at).toLocaleDateString()}</td></tr>)}</tbody></table>{state.users.length === 0 && <p className="px-5 py-8 text-sm text-slate-500">No member accounts yet.</p>}</div></section>

        <section className="overflow-hidden rounded-2xl border border-[#e4e9e4] bg-white dark:border-[#304238] dark:bg-[#1b2821]"><div className="border-b border-[#e4e9e4] px-5 py-4 dark:border-[#304238]"><h2 className="font-semibold">Recent marketplace listings</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Remove spam or outdated content. The list shows the 100 most recent items.</p></div><div className="divide-y divide-slate-100 dark:divide-slate-700">{state.records.map((record) => <div key={record.id} className="flex items-center justify-between gap-4 px-5 py-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{String(record.data.name || record.data.title || 'Untitled listing')}</p><p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">{record.kind} · {new Date(record.created_at).toLocaleDateString()}</p></div><button disabled={busy} onClick={() => removeRecord(record.id)} aria-label={`Remove ${String(record.data.name || record.data.title || 'listing')}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 dark:hover:bg-rose-950/40"><Trash2 className="h-4 w-4" /></button></div>)}</div>{state.records.length === 0 && <p className="px-5 py-8 text-sm text-slate-500">No listings yet. Load the optional sample marketplace to preview DAPIT.</p>}</section>
      </>}
    </div>
  </main>;
}

