'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import type { AccountProfile } from '@/types/auth';
import type { DirectMessage, MessageConversation, PublicMember } from '@/types';
import { Check, Clock3, MessageCircle, Search, Send, UserPlus, UsersRound } from 'lucide-react';

const messageTime = (value: string) => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
const conversationTime = (value: string) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value));

export function MessagesView({ profile, people, onPeopleChange }: { profile: AccountProfile | null; people: PublicMember[]; onPeopleChange: (person: PublicMember) => void }) {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('');
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState('');

  const loadConversations = useCallback(async (quiet = false) => {
    try {
      const response = await fetch('/api/messages');
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not load messages.');
      setConversations(result.data);
    } catch (caught) {
      if (!quiet) setError(caught instanceof Error ? caught.message : 'Could not load messages.');
    }
  }, []);

  const loadThread = useCallback(async (peerId: string, quiet = false) => {
    if (!peerId) return;
    if (!quiet) setLoadingThread(true);
    try {
      const response = await fetch(`/api/messages?with=${encodeURIComponent(peerId)}`);
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not load this conversation.');
      setMessages(result.data);
      setError('');
    } catch (caught) {
      if (!quiet) setError(caught instanceof Error ? caught.message : 'Could not load this conversation.');
    } finally {
      if (!quiet) setLoadingThread(false);
    }
  }, []);

  useEffect(() => {
    if (!profile) return;
    const initialLoad = window.setTimeout(() => void loadConversations(), 0);
    const timer = window.setInterval(() => void loadConversations(true), 15000);
    return () => { window.clearTimeout(initialLoad); window.clearInterval(timer); };
  }, [profile, loadConversations]);

  useEffect(() => {
    if (!activeId || !profile) return;
    const initialLoad = window.setTimeout(() => void loadThread(activeId), 0);
    const timer = window.setInterval(() => void loadThread(activeId, true), 5000);
    return () => { window.clearTimeout(initialLoad); window.clearInterval(timer); };
  }, [activeId, profile, loadThread]);

  const activePerson = people.find((person) => person.id === activeId) || conversations.find((item) => item.person.id === activeId)?.person;
  const filteredPeople = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return people.filter((person) => !needle || `${person.display_name} ${person.role} ${person.location} ${person.bio}`.toLowerCase().includes(needle));
  }, [people, query]);
  const isSearching = Boolean(query.trim());

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || !activeId || busy) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recipientId: activeId, message }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not send message.');
      setDraft('');
      setMessages((items) => [...items, result.data]);
      await loadConversations(true);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not send message.'); }
    finally { setBusy(false); }
  }

  async function updateFriend(person: PublicMember) {
    const action = person.friendStatus === 'incoming' ? 'accept' : person.friendStatus === 'pending' || person.friendStatus === 'accepted' ? 'remove' : undefined;
    try {
      const response = await fetch(`/api/people/${person.id}/friends`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(action ? { action } : {}) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not update friend request.');
      onPeopleChange({ ...person, friendStatus: result.data.status });
      setError('');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not update friend request.'); }
  }

  if (!profile) return <section className="grid min-h-[420px] place-items-center rounded-3xl border border-emerald-900/10 bg-white p-8 text-center dark:bg-[#1b2821]"><div className="max-w-sm"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><MessageCircle className="h-7 w-7" /></span><h1 className="mt-4 text-2xl font-bold">Your DAPIT inbox</h1><p className="mt-2 text-sm text-slate-500">Sign in to message people, find members, and send friend requests.</p><Link href="/login?next=/" className="mt-5 inline-flex rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white">Sign in</Link></div></section>;

  return <section className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#1b2821]">
    <header className="border-b border-slate-100 px-5 py-4 dark:border-slate-700"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><MessageCircle className="h-5 w-5" /></span><div><h1 className="text-xl font-bold">Messages</h1><p className="text-sm text-slate-500">Chat with DAPIT members and find new connections.</p></div></div></header>
    {error && <div role="alert" className="mx-4 mt-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{error}</div>}
    <div className="grid min-h-[620px] lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col border-b border-slate-100 dark:border-slate-700 lg:border-b-0 lg:border-r">
        <div className="p-4"><label className="relative block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find people by name or skill" aria-label="Find DAPIT members" className="site-search w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none" /></label><p className="mt-3 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">{isSearching ? 'People' : 'Recent chats'}</p></div>
        <div className="max-h-[500px] flex-1 space-y-1 overflow-y-auto px-2 pb-3 lg:max-h-none">
          {!isSearching && conversations.map((conversation) => <button key={conversation.person.id} onClick={() => setActiveId(conversation.person.id)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${activeId === conversation.person.id ? 'bg-emerald-50 dark:bg-emerald-950/50' : 'hover:bg-slate-50 dark:hover:bg-[#223128]'}`}>
            <MemberAvatar person={conversation.person} />
            <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{conversation.person.display_name}</span><span className="shrink-0 text-[10px] text-slate-400">{conversationTime(conversation.lastMessage.created_at)}</span></span><span className="mt-0.5 block truncate text-xs text-slate-500">{conversation.lastMessage.sender_id === profile.id ? 'You: ' : ''}{conversation.lastMessage.body}</span></span>
            {conversation.unreadCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white">{conversation.unreadCount}</span>}
          </button>)}
          {isSearching && filteredPeople.map((person) => <div key={person.id} className={`flex items-center gap-2 rounded-2xl p-3 ${activeId === person.id ? 'bg-emerald-50 dark:bg-emerald-950/50' : ''}`}>
            <button onClick={() => setActiveId(person.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><MemberAvatar person={person} /><span className="min-w-0"><span className="block truncate text-sm font-semibold">{person.display_name}</span><span className="block truncate text-xs capitalize text-slate-500">{person.role.replaceAll('_', ' ')}{person.location ? ` · ${person.location}` : ''}</span></span></button>
            <button onClick={() => void updateFriend(person)} title={person.friendStatus === 'incoming' ? 'Accept friend request' : person.friendStatus === 'pending' ? 'Cancel friend request' : person.friendStatus === 'accepted' ? 'Remove friend' : 'Add friend'} className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-xs ${person.friendStatus === 'accepted' ? 'border-emerald-700 text-emerald-700 dark:text-emerald-300' : 'border-slate-200 text-slate-600 hover:bg-emerald-50 dark:border-slate-600 dark:text-slate-300'}`} aria-label={`${person.friendStatus === 'incoming' ? 'Accept request from' : person.friendStatus === 'pending' ? 'Cancel request to' : person.friendStatus === 'accepted' ? 'Remove friend' : 'Add friend'} ${person.display_name}`}>{person.friendStatus === 'accepted' ? <Check className="h-4 w-4" /> : person.friendStatus === 'incoming' ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}</button>
          </div>)}
          {isSearching && !filteredPeople.length && <p className="px-4 py-8 text-center text-sm text-slate-500">No members match “{query.trim()}”.</p>}
          {!people.length && <div className="px-4 py-8 text-center text-sm text-slate-500"><UsersRound className="mx-auto mb-2 h-6 w-6" />No members to show yet. Invite someone to join DAPIT.</div>}
          {!isSearching && conversations.length === 0 && people.length > 0 && <p className="px-4 py-2 text-xs text-slate-500">Find someone above to start a chat.</p>}
        </div>
      </aside>

      <div className="flex min-h-[460px] min-w-0 flex-col lg:min-h-0">
        {activePerson ? <>
          <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700"><MemberAvatar person={activePerson} large /><div className="min-w-0"><h2 className="truncate font-semibold">{activePerson.display_name}</h2><p className="truncate text-xs capitalize text-slate-500">{activePerson.role.replaceAll('_', ' ')}{activePerson.location ? ` · ${activePerson.location}` : ''}</p></div><span className="ml-auto hidden items-center gap-1 text-xs text-slate-400 sm:flex"><Clock3 className="h-3.5 w-3.5" /> Messages refresh automatically</span></header>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#f8faf8] p-4 dark:bg-[#142019] sm:p-6" aria-live="polite">
            {loadingThread && !messages.length && <p className="m-auto text-sm text-slate-500">Loading conversation…</p>}
            {!loadingThread && !messages.length && <div className="m-auto max-w-xs text-center"><MessageCircle className="mx-auto h-8 w-8 text-emerald-700 dark:text-emerald-300" /><p className="mt-3 font-semibold">Say hello to {activePerson.display_name}</p><p className="mt-1 text-sm text-slate-500">This is the beginning of your conversation.</p></div>}
            {messages.map((message) => { const mine = message.sender_id === profile.id; return <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[70%] ${mine ? 'rounded-br-md bg-emerald-700 text-white' : 'rounded-bl-md border border-slate-100 bg-white text-slate-800 dark:border-slate-700 dark:bg-[#1b2821] dark:text-slate-100'}`}><p className="whitespace-pre-wrap break-words text-sm leading-5">{message.body}</p><p className={`mt-1 text-right text-[10px] ${mine ? 'text-emerald-100' : 'text-slate-400'}`}>{messageTime(message.created_at)}{mine && message.read_at ? ' · Read' : ''}</p></div></div>; })}
          </div>
          <form onSubmit={sendMessage} className="flex items-end gap-2 border-t border-slate-100 p-3 dark:border-slate-700 sm:p-4"><textarea value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 2000))} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} maxLength={2000} placeholder={`Message ${activePerson.display_name}…`} aria-label="Write a message" className="max-h-32 min-h-11 flex-1 resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 dark:border-slate-600 dark:bg-[#17221b] dark:text-white" /><button disabled={!draft.trim() || busy} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /><span className="hidden sm:inline">{busy ? 'Sending…' : 'Send'}</span></button></form>
        </> : <div className="grid flex-1 place-items-center p-8 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><MessageCircle className="h-7 w-7" /></span><h2 className="mt-4 text-lg font-semibold">Your conversations start here</h2><p className="mt-1 max-w-xs text-sm text-slate-500">Pick a recent chat or find a DAPIT member to send a message or friend request.</p></div></div>}
      </div>
    </div>
  </section>;
}

function MemberAvatar({ person, large = false }: { person: PublicMember; large?: boolean }) {
  const size = large ? 'h-11 w-11' : 'h-10 w-10';
  return person.avatar_url ? <img src={person.avatar_url} alt="" className={`${size} shrink-0 rounded-full object-cover`} /> : <span className={`${size} grid shrink-0 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100`}>{person.display_name.charAt(0).toUpperCase()}</span>;
}
