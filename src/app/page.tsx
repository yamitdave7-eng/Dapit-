'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AccountProfile } from '@/types/auth';
import type { PublicMember } from '@/types';
import type { ActiveTab, Application, Business, CommunityPost, Event, Job, TalentProfile, UserRole } from '@/types';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { LocalLensSection } from '@/components/LocalLensSection';
import { EventsSection } from '@/components/EventsSection';
import { JobCard } from '@/components/JobCard';
import { ApplyModal } from '@/components/ApplyModal';
import { TalentCard } from '@/components/TalentCard';
import { CommunityFeed } from '@/components/CommunityFeed';
import { DashboardView } from '@/components/DashboardView';
import { BusinessModal } from '@/components/BusinessModal';
import { RegisterBusinessModal } from '@/components/modals/RegisterBusinessModal';
import { PostJobModal } from '@/components/modals/PostJobModal';
import { HostEventModal } from '@/components/modals/HostEventModal';
import { CreatePostModal } from '@/components/modals/CreatePostModal';
import { JoinTalentModal } from '@/components/modals/JoinTalentModal';
import { PeopleDirectory } from '@/components/PeopleDirectory';
import { BriefcaseBusiness, CalendarDays, MapPin, Search, Store, UsersRound } from 'lucide-react';

type CreateType = 'business' | 'event' | 'job' | 'post' | 'talent';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [myBusinesses, setMyBusinesses] = useState<Business[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [talent, setTalent] = useState<TalentProfile[]>([]);
  const [people, setPeople] = useState<PublicMember[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [createModal, setCreateModal] = useState<CreateType | null>(null);
  const [loading, setLoading] = useState(true);
  const userRole: UserRole = profile?.role || 'student';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [me, biz, evt, job, app, posts, talentResult, peopleResult] = await Promise.all([
        fetch('/api/auth/me').then((r) => r.json()), fetch('/api/businesses').then((r) => r.json()),
        fetch('/api/events').then((r) => r.json()), fetch('/api/jobs').then((r) => r.json()),
        fetch('/api/applications').then((r) => r.json()), fetch('/api/community').then((r) => r.json()),
        fetch('/api/talent').then((r) => r.json()), fetch('/api/people').then((r) => r.json()),
      ]);
      setProfile(me.success ? me.data : null);
      if (biz.success) setBusinesses(biz.data);
      if (me.success && ['business_owner', 'admin'].includes(me.data?.role)) {
        const owned = await fetch('/api/businesses?mine=true').then((response) => response.json());
        if (owned.success) setMyBusinesses(owned.data);
      }
      else setMyBusinesses([]);
      if (evt.success) setEvents(evt.data);
      if (job.success) setJobs(job.data);
      if (app.success) setApplications(app.data);
      if (posts.success) setCommunityPosts(posts.data);
      if (talentResult.success) setTalent(talentResult.data);
      if (peopleResult.success) setPeople(peopleResult.data);
    } catch (error) { console.error('Could not load DAPIT marketplace', error); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const dark = localStorage.getItem('dapit_theme') === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    const themeTimer = window.setTimeout(() => { setDarkMode(dark); void fetchData(); }, 0);
    return () => window.clearTimeout(themeTimer);
  }, [fetchData]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('dapit_theme', next ? 'dark' : 'light');
  };
  const openCreate = (type: CreateType) => {
    if (!profile) { router.push('/login?next=/'); return; }
    if (profile.role === 'business_owner' && (type === 'job' || type === 'event') && myBusinesses.length === 0) {
      window.alert('Add your place or service listing first. You can then connect jobs and events to it.');
      setCreateModal('business');
      return;
    }
    setCreateModal(type);
  };
  const handleRsvp = async (event: Event) => {
    if (!profile) { router.push('/login?next=/'); return; }
    const response = await fetch(`/api/events/${event.id}/rsvp`, { method: 'POST' });
    const result = await response.json();
    if (!response.ok || !result.success) { window.alert(result.error || 'Could not update RSVP.'); return; }
    await fetchData();
  };
  const updateStatus = async (id: string, status: Application['status']) => {
    const response = await fetch('/api/applications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    const result = await response.json();
    if (response.ok && result.success) setApplications((items) => items.map((item) => item.id === id ? result.data : item));
    else window.alert(result.error || 'Could not update application.');
  };
  const handleSignOut = async () => { await fetch('/api/auth/logout', { method: 'POST' }); setProfile(null); window.location.reload(); };
  const selectBusinessById = (id: string) => { const item = businesses.find((business) => business.id === id); if (item) setSelectedBusiness(item); else setActiveTab('businesses'); };
  const matchesSearch = <T,>(item: T) => !searchQuery.trim() || JSON.stringify(item).toLowerCase().includes(searchQuery.trim().toLowerCase());
  const filteredBusinesses = businesses.filter(matchesSearch);
  const filteredEvents = events.filter(matchesSearch);
  const filteredJobs = jobs.filter(matchesSearch);
  const filteredTalent = talent.filter(matchesSearch);
  const filteredPeople = people.filter(matchesSearch);
  const hasApplied = (job: Job) => applications.some((app) => app.jobId === job.id && app.applicantEmail.toLowerCase() === (profile?.email || '').toLowerCase());

  return <div className="min-h-screen bg-[#f5f7f4] text-slate-900 transition-colors dark:bg-[#111a15] dark:text-slate-100">
    <Navbar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} onSignOut={handleSignOut} onOpenCreate={openCreate} darkMode={darkMode} toggleDarkMode={toggleDarkMode} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    <main className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
      <section className="min-w-0 space-y-6">
        {activeTab === 'all' && <>
          <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} setActiveTab={setActiveTab} onOpenCreate={openCreate} onSelectBusinessById={selectBusinessById} userRole={userRole} />
          {searchQuery.trim() && <section className="space-y-4" aria-live="polite">
            <header className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">People matching “{searchQuery.trim()}”</h2><p className="text-sm text-slate-500">Search names, roles, locations, skills, and bios.</p></div><button onClick={() => setActiveTab('talent')} className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">People & skills</button></header>
            {profile ? <PeopleDirectory people={filteredPeople} onChange={(updated) => setPeople((items) => items.map((item) => item.id === updated.id ? updated : item))} emptyMessage="No members match this search. Try a name, role, location, or skill." /> : filteredTalent.length ? <div className="grid gap-4 md:grid-cols-2">{filteredTalent.map((person) => <TalentCard key={person.id} talent={person} />)}</div> : <div className="rounded-2xl border border-emerald-900/10 bg-white p-5 text-sm text-slate-600 dark:bg-[#1b2821] dark:text-slate-300">Sign in to search member profiles. Public professional profiles matching your search will appear here when available. <button onClick={() => setActiveTab('talent')} className="ml-1 font-semibold text-emerald-800 underline dark:text-emerald-300">Browse People & Skills</button></div>}
          </section>}
          <div className="grid gap-4 sm:grid-cols-3">{[
            { tab: 'businesses' as const, label: 'Places & services', count: businesses.length, icon: Store },
            { tab: 'events' as const, label: 'Events', count: events.length, icon: CalendarDays },
            { tab: 'jobs' as const, label: 'Jobs & projects', count: jobs.length, icon: BriefcaseBusiness },
          ].map(({ tab, label, count, icon: Icon }) => <button key={tab} onClick={() => setActiveTab(tab)} className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#1b2821]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><Icon className="h-5 w-5" /></span><span><strong className="block text-sm">{label}</strong><span className="text-xs text-slate-500">{count} to explore</span></span></button>)}</div>
          <section className="space-y-3"><header className="flex items-center justify-between"><h2 className="text-lg font-semibold">Work and projects</h2><button onClick={() => setActiveTab('jobs')} className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">See all</button></header>{filteredJobs.slice(0, 3).map((job) => <JobCard key={job.id} job={job} hasApplied={hasApplied(job)} onApply={(item) => profile ? setSelectedJob(item) : router.push('/login?next=/')} onSelectBusiness={selectBusinessById} />)}</section>
          <section className="space-y-3"><header className="flex items-center justify-between"><h2 className="text-lg font-semibold">Nearby and upcoming</h2><button onClick={() => setActiveTab('events')} className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">See events</button></header><EventsSection events={filteredEvents.slice(0, 3)} userEmail={profile?.id || ''} onRsvp={handleRsvp} onSelectBusiness={selectBusinessById} onOpenHostEvent={() => openCreate('event')} /></section>
          <CommunityFeed posts={communityPosts.slice(0, 3)} onOpenCreatePost={() => openCreate('post')} onPostLiked={(post) => setCommunityPosts((items) => items.map((item) => item.id === post.id ? post : item))} />
        </>}
        {activeTab === 'businesses' && <LocalLensSection businesses={filteredBusinesses} onSelectBusiness={setSelectedBusiness} onOpenRegister={() => openCreate('business')} />}
        {activeTab === 'events' && <EventsSection events={filteredEvents} userEmail={profile?.id || ''} onRsvp={handleRsvp} onSelectBusiness={selectBusinessById} onOpenHostEvent={() => openCreate('event')} />}
        {activeTab === 'jobs' && <section className="space-y-4"><div className="rounded-2xl border border-emerald-900/10 bg-white p-5 dark:bg-[#1b2821]"><h1 className="text-2xl font-semibold">Jobs & projects</h1><p className="mt-1 text-sm text-slate-500">Find local work, contract projects, and remote opportunities.</p></div>{filteredJobs.map((job) => <JobCard key={job.id} job={job} hasApplied={hasApplied(job)} onApply={(item) => profile ? setSelectedJob(item) : router.push('/login?next=/')} onSelectBusiness={selectBusinessById} />)}</section>}
        {activeTab === 'talent' && <section className="space-y-4"><div className="flex items-center justify-between rounded-2xl border border-emerald-900/10 bg-white p-5 dark:bg-[#1b2821]"><div><h1 className="text-2xl font-semibold">People & skills</h1><p className="mt-1 text-sm text-slate-500">Find independent professionals or share what you do.</p></div><button onClick={() => openCreate('talent')} className="rounded-xl bg-[#17613f] px-4 py-2.5 text-sm font-semibold text-white">Join directory</button></div><PeopleDirectory people={filteredPeople} onChange={(updated) => setPeople((items) => items.map((item) => item.id === updated.id ? updated : item))} emptyMessage={searchQuery.trim() ? 'No members match this search. Try a name, role, location, or skill.' : undefined} /><div className="grid gap-4 md:grid-cols-2">{filteredTalent.map((person) => <TalentCard key={person.id} talent={person} />)}</div></section>}
        {activeTab === 'community' && <CommunityFeed posts={communityPosts} onOpenCreatePost={() => openCreate('post')} onPostLiked={(post) => setCommunityPosts((items) => items.map((item) => item.id === post.id ? post : item))} />}
        {activeTab === 'dashboard' && (profile ? <DashboardView profile={profile} applications={applications} businesses={filteredBusinesses} events={filteredEvents} jobs={filteredJobs} onUpdateAppStatus={updateStatus} onOpenCreate={openCreate} /> : <div className="rounded-2xl bg-white p-8 text-center dark:bg-[#1b2821]"><h1 className="text-xl font-semibold">Sign in to view your dashboard</h1><Link className="mt-4 inline-block rounded-xl bg-[#17613f] px-4 py-2 text-sm font-semibold text-white" href="/login">Sign in</Link></div>)}
        {loading && <p className="text-center text-sm text-slate-500">Loading marketplace…</p>}
      </section>
      <aside className="hidden space-y-4 lg:block"><div className="rounded-2xl border border-emerald-900/10 bg-white p-5 dark:bg-[#1b2821]"><div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-emerald-700" /> Browse nearby or anywhere</div><p className="mt-2 text-xs leading-5 text-slate-500">Search venues, services, events, work, or people. Listings can be local, hybrid, or remote.</p><div className="relative mt-4"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search DAPIT" className="site-search w-full rounded-xl border py-2 pl-9 pr-3 text-sm outline-none" /></div></div><div className="rounded-2xl border border-emerald-900/10 bg-white p-5 dark:bg-[#1b2821]"><h2 className="font-semibold">One place to find your next</h2><p className="mt-2 text-sm leading-6 text-slate-500">Venue. Service. Opportunity. Collaborator. DAPIT brings the local marketplace and professional network together.</p><button onClick={() => openCreate('business')} className="mt-4 w-full rounded-xl border border-emerald-900/15 px-3 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 dark:text-emerald-200">Add a listing</button></div><Link href="/login" className="block rounded-2xl border border-emerald-900/10 bg-emerald-50 p-5 text-sm font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"><UsersRound className="mb-2 h-5 w-5" />{profile ? `Signed in as ${profile.display_name}` : 'Join DAPIT to post, RSVP, and apply'}</Link></aside>
    </main>
    <BusinessModal business={selectedBusiness} onClose={() => setSelectedBusiness(null)} jobs={jobs} events={events} onApplyJob={(job) => profile ? setSelectedJob(job) : router.push('/login?next=/')} onRsvpEvent={handleRsvp} />
    <ApplyModal job={selectedJob} profile={profile} onClose={() => setSelectedJob(null)} onSuccess={(application) => setApplications((items) => [application, ...items])} />
    {createModal === 'business' && <RegisterBusinessModal onClose={() => setCreateModal(null)} onSuccess={(item) => { setBusinesses((items) => [item, ...items]); setMyBusinesses((items) => [item, ...items]); setSelectedBusiness(item); }} />}
    {createModal === 'job' && <PostJobModal businesses={profile?.role === 'business_owner' ? myBusinesses : businesses} onClose={() => setCreateModal(null)} onSuccess={(item) => { setJobs((items) => [item, ...items]); setActiveTab('jobs'); }} />}
    {createModal === 'event' && <HostEventModal businesses={profile?.role === 'business_owner' ? myBusinesses : businesses} onClose={() => setCreateModal(null)} onSuccess={(item) => { setEvents((items) => [item, ...items]); setActiveTab('events'); }} />}
    {createModal === 'post' && <CreatePostModal profile={profile!} onClose={() => setCreateModal(null)} onSuccess={(item) => { setCommunityPosts((items) => [item, ...items]); setActiveTab('community'); }} />}
    {createModal === 'talent' && <JoinTalentModal onClose={() => setCreateModal(null)} onSuccess={(item) => { setTalent((items) => [item, ...items]); setActiveTab('talent'); }} />}
  </div>;
}
