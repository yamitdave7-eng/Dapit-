'use client';

import React from 'react';
import Link from 'next/link';
import { Application, Business, Event, Job } from '@/types';
import type { AccountProfile } from '@/types/auth';
import { ArrowRight, BriefcaseBusiness, Building2, CalendarDays, CircleCheck, Plus, ShieldCheck, UserRound } from 'lucide-react';

interface DashboardViewProps {
  profile: AccountProfile | null;
  applications: Application[];
  businesses: Business[];
  events: Event[];
  jobs: Job[];
  onUpdateAppStatus: (id: string, status: Application['status']) => void;
  onOpenCreate: (type: 'business' | 'event' | 'job' | 'post' | 'talent') => void;
}

const statuses: Application['status'][] = ['Pending', 'Reviewing', 'Interviewing', 'Accepted', 'Rejected'];

export const DashboardView: React.FC<DashboardViewProps> = ({ profile, applications, businesses, events, jobs, onUpdateAppStatus, onOpenCreate }) => {
  const isOwner = profile?.role === 'business_owner';
  const attending = events.filter((event) => profile && event.attendees.includes(profile.id));
  const firstName = profile?.display_name?.split(' ')[0] || 'there';

  return <div className="space-y-6">
    <section className="overflow-hidden rounded-3xl border border-[#dce9dc] bg-gradient-to-br from-[#e7f2e7] via-[#f7f5ea] to-[#e7efeb] p-6 dark:border-[#304238] dark:from-[#1b382a] dark:via-[#222c23] dark:to-[#202f28] sm:p-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-800 dark:text-emerald-300">Your DAPIT workspace</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Good to see you, {firstName}.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">Keep track of your applications, events, and marketplace activity in one place.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => onOpenCreate(isOwner ? 'job' : 'talent')} className="inline-flex items-center gap-2 rounded-xl bg-[#17613f] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#104d32]"><Plus className="h-4 w-4" />{isOwner ? 'Post a job' : 'Share your skills'}</button><button onClick={() => onOpenCreate('business')} className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/15 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#174d37] hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-emerald-100 dark:hover:bg-white/15"><Building2 className="h-4 w-4" />Add a place</button></div></div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{[
        { label: isOwner ? 'Applications to review' : 'My applications', value: applications.length, icon: BriefcaseBusiness },
        { label: 'Events I’m attending', value: attending.length, icon: CalendarDays },
        { label: 'Marketplace listings', value: businesses.length + jobs.length + events.length, icon: Building2 },
        { label: 'Account type', value: profile?.role === 'business_owner' ? 'Business' : profile?.role === 'admin' ? 'Admin' : profile?.role === 'resident' ? 'Member' : 'Job seeker', icon: UserRound },
      ].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-white/80 bg-white/75 p-4 dark:border-white/10 dark:bg-[#111a16]/50"><Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" /><p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 truncate text-xl font-semibold">{value}</p></div>)}</div>
    </section>

    {profile?.role === 'admin' && <Link href="/admin" className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-[#1b2821] dark:text-emerald-200 dark:hover:bg-emerald-950/30"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Open administrator workspace</span><ArrowRight className="h-4 w-4" /></Link>}

    <section className="rounded-2xl border border-[#e4e9e4] bg-white dark:border-[#304238] dark:bg-[#1b2821]"><div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700"><h3 className="font-semibold">{isOwner ? 'Applications for your opportunities' : 'Your applications'}</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{isOwner ? 'Update a candidate’s status as you review their application.' : 'Follow each application through the hiring process.'}</p></div>{applications.length === 0 ? <div className="p-8 text-center"><BriefcaseBusiness className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-3 text-sm font-semibold">No applications yet</p><p className="mt-1 text-xs text-slate-500">Applications will appear here when you apply or someone applies to your job.</p></div> : <div className="divide-y divide-slate-100 dark:divide-slate-700">{applications.map((application) => <article key={application.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold">{isOwner ? application.applicantName : application.jobTitle}</h4><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">{application.status}</span></div><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{isOwner ? `${application.jobTitle} · ${application.applicantEmail}` : `${application.businessName} · ${application.appliedAt}`}</p>{application.coverNote && <p className="mt-2 max-w-2xl text-sm leading-5 text-slate-600 dark:text-slate-300">{application.coverNote}</p>}</div>{isOwner ? <select aria-label={`Update status for ${application.applicantName}`} value={application.status} onChange={(event) => onUpdateAppStatus(application.id, event.target.value as Application['status'])} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-[#142019]">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select> : <CircleCheck className="h-5 w-5 shrink-0 text-emerald-600" />}</article>)}</div>}</section>

    <section className="rounded-2xl border border-[#e4e9e4] bg-white dark:border-[#304238] dark:bg-[#1b2821]"><div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700"><h3 className="font-semibold">Events you’re attending</h3></div>{attending.length === 0 ? <div className="p-7 text-center text-sm text-slate-500">Your RSVPs will show up here.</div> : <div className="grid gap-3 p-4 sm:grid-cols-2">{attending.map((event) => <article key={event.id} className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-[#142019]"><img src={event.image} alt="" className="h-16 w-16 rounded-lg object-cover" /><div className="min-w-0"><p className="truncate text-sm font-semibold">{event.title}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{event.date} · {event.location}</p></div></article>)}</div>}</section>
  </div>;
};
