'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ActiveTab } from '@/types';
import type { AccountProfile } from '@/types/auth';
import { BriefcaseBusiness, CalendarDays, ChevronDown, Compass, LayoutDashboard, LogOut, MessageCircle, MessageSquareText, Moon, Plus, Search, Store, Sun, UsersRound } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: AccountProfile | null;
  onSignOut: () => void;
  onOpenCreate: (type: 'business' | 'event' | 'job' | 'post' | 'talent') => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const navigation = [
  { tab: 'all', label: 'Explore', icon: Compass },
  { tab: 'businesses', label: 'Places', icon: Store },
  { tab: 'events', label: 'Events', icon: CalendarDays },
  { tab: 'jobs', label: 'Work', icon: BriefcaseBusiness },
  { tab: 'talent', label: 'Talent', icon: UsersRound },
  { tab: 'messages', label: 'Messages', icon: MessageSquareText },
  { tab: 'community', label: 'Community', icon: MessageCircle },
  { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
] as const;

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, profile, onSignOut, onOpenCreate, darkMode, toggleDarkMode, searchQuery, setSearchQuery }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const accountName = profile?.display_name || 'Your account';
  const avatar = profile?.avatar_url || '';

  return <header className="sticky top-0 z-50 border-b border-[#e4e9e4] bg-white/95 shadow-[0_2px_12px_-10px_rgba(0,0,0,.22)] backdrop-blur-xl dark:border-[#304238] dark:bg-[#17221b]/95">
    <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-4 px-4 sm:px-6">
      <button onClick={() => setActiveTab('all')} className="flex shrink-0 items-center gap-2.5" aria-label="DAPIT explore"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#17613f] text-lg font-black text-white">D</span><span className="hidden text-xl font-extrabold tracking-tight text-[#17613f] dark:text-emerald-300 sm:inline">dapit</span></button>

      <label className="relative hidden min-w-40 max-w-sm flex-1 md:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" /><input aria-label="Search places, work, events, and people" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search DAPIT: places, work, people…" className="site-search w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none" /></label>

      <nav aria-label="Main navigation" className="ml-auto hidden h-full items-center gap-1 lg:flex">
        {navigation.map(({ tab, label, icon: Icon }) => <button key={tab} onClick={() => setActiveTab(tab)} className={`relative flex h-full min-w-[66px] flex-col items-center justify-center gap-1 px-2 text-[11px] font-semibold transition ${activeTab === tab ? 'text-[#17613f] dark:text-emerald-300' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}><Icon className="h-[19px] w-[19px]" /><span>{label}</span>{activeTab === tab && <span className="nav-indicator absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-[#17613f] dark:bg-emerald-300" />}</button>)}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-2">
        <button onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#26382d]">{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
        {profile?.role === 'admin' && <Link href="/admin" className="hidden rounded-xl px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40 sm:block">Admin</Link>}
        {profile ? <div className="relative"><button onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} className="flex max-w-[150px] items-center gap-2 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-50 dark:hover:bg-[#223128]">{avatar ? <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">{accountName.charAt(0).toUpperCase()}</span>}<span className="hidden min-w-0 sm:block"><span className="block truncate text-xs font-semibold">{accountName}</span><span className="block text-[10px] capitalize text-slate-500 dark:text-slate-400">{profile.role.replace('_', ' ')}</span></span><ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" /></button>{menuOpen && <><button aria-label="Close profile menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setMenuOpen(false)} /><div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-[#e4e9e4] bg-white p-2 shadow-xl dark:border-[#304238] dark:bg-[#1b2821]"><div className="border-b border-slate-100 px-3 py-2 dark:border-slate-700"><p className="truncate text-sm font-semibold">{accountName}</p><p className="truncate text-xs text-slate-500 dark:text-slate-400">{profile.email}</p></div>{profile.role === 'admin' && <Link href="/admin" onClick={() => setMenuOpen(false)} className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#26382d]">Administrator workspace</Link>}<Link href="/" onClick={() => { setActiveTab('dashboard'); setMenuOpen(false); }} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#26382d]">My dashboard</Link><button onClick={onSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/30"><LogOut className="h-4 w-4" /> Sign out</button></div></>}</div> : <Link href="/login" className="rounded-xl border border-[#dce5dc] px-3 py-2 text-xs font-bold text-[#174d37] transition hover:bg-emerald-50 dark:border-[#3b5043] dark:text-emerald-300 dark:hover:bg-[#223128]">Sign in</Link>}
        <div className="relative"><button onClick={() => setCreateOpen((open) => !open)} aria-expanded={createOpen} className="inline-flex items-center gap-1.5 rounded-xl bg-[#17613f] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#104d32]"><Plus className="h-4 w-4" /><span className="hidden sm:inline">Create</span></button>{createOpen && <><button aria-label="Close create menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setCreateOpen(false)} /><div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-[#e4e9e4] bg-white p-1.5 shadow-xl dark:border-[#304238] dark:bg-[#1b2821]">{[
          { type: 'business', label: 'Add a place or service', icon: Store }, { type: 'event', label: 'Create an event', icon: CalendarDays }, { type: 'job', label: 'Post a job or project', icon: BriefcaseBusiness }, { type: 'talent', label: 'Share your skills', icon: UsersRound }, { type: 'post', label: 'Start a discussion', icon: MessageCircle },
        ].map(({ type, label, icon: Icon }) => <button key={type} onClick={() => { onOpenCreate(type as 'business' | 'event' | 'job' | 'post' | 'talent'); setCreateOpen(false); }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-[#26382d]"><Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />{label}</button>)}</div></>}</div>
      </div>
    </div>
    <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden dark:border-slate-800">{navigation.map(({ tab, label }) => <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${activeTab === tab ? 'bg-[#17613f] text-white' : 'bg-slate-100 text-slate-600 dark:bg-[#223128] dark:text-slate-300'}`}>{label}</button>)}</div>
    <div className="px-4 pb-2 md:hidden sm:px-6"><label className="relative block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" /><input aria-label="Search places, work, events, and people" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search DAPIT: places, work, people…" className="site-search w-full rounded-xl border py-2 pl-9 pr-3 text-sm outline-none" /></label></div>
  </header>;
};
