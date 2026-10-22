'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Heart, LoaderCircle, MessageCircle, UserPlus, UsersRound } from 'lucide-react';

type Analytics = { totals: { users: number; listings: number; posts: number; applications: number; likes: number; followers: number; friendRequests: number; friends: number; signIns: number }; days: { date: string; users: number; posts: number; applications: number; signIns: number }[]; recentSignIns: { id: number; user_id: string; email: string; created_at: string; display_name: string; role: string }[] };
const stats = [
  { key: 'users', label: 'Members', icon: UsersRound }, { key: 'listings', label: 'Marketplace listings', icon: BriefcaseBusiness },
  { key: 'posts', label: 'Community posts', icon: MessageCircle }, { key: 'applications', label: 'Job applications', icon: CalendarDays },
  { key: 'likes', label: 'Post likes', icon: Heart }, { key: 'followers', label: 'Follows', icon: UserPlus },
  { key: 'signIns', label: 'Recorded sign-ins', icon: UsersRound },
] as const;

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetch('/api/admin/analytics', { cache: 'no-store' }).then(async (response) => {
      const result = await response.json();
      if (response.status === 401) { router.replace('/login?next=/admin/analytics'); return; }
      if (response.status === 403) { router.replace('/'); return; }
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not load analytics.');
      if (active) setData(result.data);
    }).catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : 'Could not load analytics.'); });
    return () => { active = false; };
  }, [router]);

  return <main className="min-h-screen bg-[#f5f7f4] px-5 py-8 text-[#17251d] dark:bg-[#111a16] dark:text-[#edf4ef]"><div className="mx-auto max-w-7xl space-y-7">
    <header className="flex items-center justify-between"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-800 dark:text-slate-300"><ArrowLeft className="h-4 w-4" /> Admin workspace</Link><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">Admins only</span></header>
    <section className="rounded-3xl bg-gradient-to-br from-[#174d37] to-[#102d22] p-7 text-white"><p className="text-sm font-semibold text-emerald-100">DAPIT overview</p><h1 className="mt-2 text-3xl font-semibold">Marketplace analytics</h1><p className="mt-2 text-sm text-emerald-100">Live totals and activity for the last seven days.</p></section>
    {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
    {!data && !error && <div className="grid min-h-48 place-items-center"><LoaderCircle className="h-7 w-7 animate-spin text-emerald-700" /></div>}
    {data && <>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{stats.map(({ key, label, icon: Icon }) => <article key={key} className="ui-card rounded-2xl border border-[#e4e9e4] bg-white p-5 dark:border-[#304238] dark:bg-[#1b2821]"><Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-semibold">{data.totals[key]}</p></article>)}</section>
      <section className="rounded-2xl border border-[#e4e9e4] bg-white p-5 dark:border-[#304238] dark:bg-[#1b2821]"><div><h2 className="font-semibold">Daily activity</h2><p className="mt-1 text-sm text-slate-500">New accounts, posts, and applications by day.</p></div>
        <div className="mt-6 space-y-4">{data.days.map((day) => { const total = day.users + day.posts + day.applications + day.signIns; const max = Math.max(1, ...data.days.map((item) => item.users + item.posts + item.applications + item.signIns)); return <div key={day.date} className="grid grid-cols-[70px_1fr] items-center gap-3 text-xs md:grid-cols-[80px_1fr_230px]"><span className="text-slate-500">{new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div className="flex h-full" style={{ width: `${total ? Math.max(4, total / max * 100) : 0}%` }}><span className="bg-emerald-600" style={{ width: `${total ? day.users / total * 100 : 0}%` }} /><span className="bg-sky-500" style={{ width: `${total ? day.posts / total * 100 : 0}%` }} /><span className="bg-amber-500" style={{ width: `${total ? day.applications / total * 100 : 0}%` }} /><span className="bg-violet-500" style={{ width: `${total ? day.signIns / total * 100 : 0}%` }} /></div></div><span className="col-start-2 text-slate-500 md:col-start-auto md:text-right">{day.users} members · {day.posts} posts · {day.applications} applications · {day.signIns} logins</span></div>; })}</div>
        <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-600" />Members</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-sky-500" />Posts</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-500" />Applications</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-violet-500" />Sign-ins</span></div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-[#e4e9e4] bg-white dark:border-[#304238] dark:bg-[#1b2821]"><div className="border-b border-[#e4e9e4] px-5 py-4 dark:border-[#304238]"><h2 className="font-semibold">Recent login history</h2><p className="mt-1 text-sm text-slate-500">The 100 most recent successful email and password sign-ins.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-[#142019]"><tr><th className="px-5 py-3">Account</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Signed in</th></tr></thead><tbody>{data.recentSignIns.map((event) => <tr key={event.id} className="border-t border-slate-100 dark:border-slate-700"><td className="px-5 py-3 font-medium">{event.display_name}</td><td className="px-5 py-3 text-slate-500">{event.email}</td><td className="px-5 py-3 capitalize text-slate-500">{event.role.replace('_', ' ')}</td><td className="px-5 py-3 text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</td></tr>)}</tbody></table>{data.recentSignIns.length === 0 && <p className="px-5 py-8 text-sm text-slate-500">No sign-ins have been recorded yet. New successful sign-ins will appear here.</p>}</div></section>
        <section className="grid gap-3 sm:grid-cols-2"><article className="rounded-2xl border border-[#e4e9e4] bg-white p-5 dark:border-[#304238] dark:bg-[#1b2821]"><p className="text-sm text-slate-500">Friend requests waiting</p><p className="mt-1 text-3xl font-semibold">{data.totals.friendRequests}</p></article><article className="rounded-2xl border border-[#e4e9e4] bg-white p-5 dark:border-[#304238] dark:bg-[#1b2821]"><p className="text-sm text-slate-500">Friend connections</p><p className="mt-1 text-3xl font-semibold">{data.totals.friends}</p></article></section>
    </>}
  </div></main>;
}
