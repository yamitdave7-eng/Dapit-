'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PublicMember } from '@/types';
import { UserPlus, UsersRound } from 'lucide-react';

export function PeopleDirectory({ people, onChange, emptyMessage = 'No other members yet. Invite someone to join DAPIT.' }: { people: PublicMember[]; onChange: (person: PublicMember) => void; emptyMessage?: string }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  async function act(person: PublicMember, kind: 'follow' | 'friend', action?: 'accept' | 'remove') {
    setBusyId(person.id); setError('');
    try {
      const response = await fetch(`/api/people/${person.id}/${kind === 'follow' ? 'follow' : 'friends'}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: kind === 'friend' ? JSON.stringify({ action }) : undefined,
      });
      const result = await response.json();
      if (response.status === 401) { router.push('/login?next=/'); return; }
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not update this connection.');
      onChange(kind === 'follow' ? { ...person, following: result.data.following } : { ...person, friendStatus: result.data.status });
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not update this connection.'); }
    finally { setBusyId(''); }
  }

  return <section className="space-y-4 rounded-2xl border border-emerald-900/10 bg-white p-5 dark:bg-[#1b2821]">
    <div><div className="flex items-center gap-2"><UsersRound className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /><h2 className="text-lg font-semibold">DAPIT members</h2></div><p className="mt-1 text-sm text-slate-500">Follow people or send a friend request. Profile details are visible to signed-in members.</p></div>
    {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
    {!people.length && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-[#142019]">{emptyMessage}</p>}
    <div className="grid gap-3 sm:grid-cols-2">{people.map((person) => <article key={person.id} className="ui-card flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-700">
      {person.avatar_url ? <img src={person.avatar_url} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-800">{person.display_name.charAt(0).toUpperCase()}</span>}
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{person.display_name}</p><p className="truncate text-xs capitalize text-slate-500">{person.role.replace('_', ' ')}{person.location ? ` · ${person.location}` : ''}</p>{person.bio && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{person.bio}</p>}</div>
      <div className="flex shrink-0 flex-col gap-1.5"><button disabled={busyId === person.id} onClick={() => void act(person, 'follow')} className="rounded-lg bg-emerald-700 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50">{busyId === person.id ? 'Saving…' : person.following ? 'Following' : 'Follow'}</button>
        {person.friendStatus === 'incoming' ? <><button disabled={busyId === person.id} onClick={() => void act(person, 'friend', 'accept')} className="rounded-lg border border-emerald-700 px-2 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200">Accept</button><button disabled={busyId === person.id} onClick={() => void act(person, 'friend', 'remove')} className="text-xs text-slate-500">Ignore</button></> : <button disabled={busyId === person.id} onClick={() => void act(person, 'friend', person.friendStatus === 'accepted' || person.friendStatus === 'pending' ? 'remove' : undefined)} className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200">{person.friendStatus === 'accepted' ? <><UsersRound className="h-3 w-3" /> Friends</> : person.friendStatus === 'pending' ? 'Cancel request' : <><UserPlus className="h-3 w-3" /> Add friend</>}</button>}</div>
    </article>)}</div>
  </section>;
}
