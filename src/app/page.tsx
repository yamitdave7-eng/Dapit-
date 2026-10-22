'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Business,
  Event,
  Job,
  Application,
  CommunityPost,
  TalentProfile,
  ActiveTab,
  UserRole,
} from '@/types';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { BusinessCard } from '@/components/BusinessCard';
import { BusinessModal } from '@/components/BusinessModal';
import { LocalLensSection } from '@/components/LocalLensSection';
import { EventsSection } from '@/components/EventsSection';
import { JobCard } from '@/components/JobCard';
import { ApplyModal } from '@/components/ApplyModal';
import { TalentCard } from '@/components/TalentCard';
import { CommunityFeed } from '@/components/CommunityFeed';
import { DashboardView } from '@/components/DashboardView';
import { RegisterBusinessModal } from '@/components/modals/RegisterBusinessModal';
import { PostJobModal } from '@/components/modals/PostJobModal';
import { HostEventModal } from '@/components/modals/HostEventModal';
import { CreatePostModal } from '@/components/modals/CreatePostModal';
import { JoinTalentModal } from '@/components/modals/JoinTalentModal';
import {
  Store,
  Calendar,
  Briefcase,
  Users,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  Image as ImageIcon,
  Newspaper,
  Compass,
  LayoutDashboard,
  Building2,
  Coffee,
  GraduationCap,
  Home as HomeIcon,
  PlusCircle,
  Eye,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Data states
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [talent, setTalent] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Job Type filter
  const [jobTypeFilter, setJobTypeFilter] = useState('All');

  // Modals
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [createModal, setCreateModal] = useState<'business' | 'event' | 'job' | 'post' | 'talent' | null>(null);

  // Initialize theme and user from storage
  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('dapit_theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }

    const savedRole = localStorage.getItem('dapit_role') as UserRole;
    if (savedRole && ['student', 'resident', 'business_owner'].includes(savedRole)) {
      setUserRole(savedRole);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dapit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dapit_theme', 'light');
    }
  };

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bizRes, evtRes, jobRes, appRes, comRes, talRes] = await Promise.all([
        fetch('/api/businesses').then((r) => r.json()),
        fetch('/api/events').then((r) => r.json()),
        fetch('/api/jobs').then((r) => r.json()),
        fetch('/api/applications').then((r) => r.json()),
        fetch('/api/community').then((r) => r.json()),
        fetch('/api/talent').then((r) => r.json()),
      ]);

      if (bizRes.success) setBusinesses(bizRes.data);
      if (evtRes.success) setEvents(evtRes.data);
      if (jobRes.success) setJobs(jobRes.data);
      if (appRes.success) setApplications(appRes.data);
      if (comRes.success) setCommunityPosts(comRes.data);
      if (talRes.success) setTalent(talRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Jobs
  const filteredJobs = jobs.filter((j) => {
    const matchesType = jobTypeFilter === 'All' || j.jobType === jobTypeFilter;
    const matchesQuery =
      !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesQuery;
  });

  const filteredTalent = talent.filter((t) => {
    return (
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.lookingFor.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // RSVP toggle handler
  const handleRsvpEvent = async (event: Event) => {
    const userEmail =
      userRole === 'student'
        ? 'marcus.tan@student.edu'
        : userRole === 'resident'
        ? 'sarah.j@localresident.org'
        : 'elena@artisanroastery.com';

    const alreadyAttending = event.attendees.includes(userEmail);
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === event.id) {
          return {
            ...e,
            rsvpCount: alreadyAttending ? Math.max(0, e.rsvpCount - 1) : e.rsvpCount + 1,
            attendees: alreadyAttending
              ? e.attendees.filter((a) => a !== userEmail)
              : [...e.attendees, userEmail],
          };
        }
        return e;
      })
    );

    try {
      await fetch(`/api/events/${event.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });
    } catch (err) {
      console.error('Error toggling RSVP:', err);
    }
  };

  // Status update for applications
  const handleUpdateAppStatus = async (appId: string, status: Application['status']) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );

    try {
      await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status }),
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Reset database handler
  const handleResetDatabase = async () => {
    if (!confirm('Reset DAPIT database back to initial seed data?')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        fetchData();
        alert('Database has been reset to initial seed state.');
      }
    } catch (err) {
      console.error('Error resetting database:', err);
    }
  };

  const handleSelectBusinessById = (id: string) => {
    const b = businesses.find((biz) => biz.id === id);
    if (b) {
      setSelectedBusiness(b);
    } else {
      setActiveTab('businesses');
    }
  };

  const userEmail =
    userRole === 'student'
      ? 'marcus.tan@student.edu'
      : userRole === 'resident'
      ? 'sarah.j@localresident.org'
      : 'elena@artisanroastery.com';

  const roleProfiles = {
    business_owner: {
      name: 'Elena Rostova',
      title: 'Owner @ Artisan Roastery & Café',
      location: 'University District, City',
      cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      statLabel: 'Candidate Applicants',
      statValue: '6 candidates',
    },
    student: {
      name: 'Marcus Tan',
      title: 'Undergraduate @ City University • Seeking Barista & Marketing Roles',
      location: 'University District, City',
      cover: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      statLabel: 'Applications Submitted',
      statValue: `${applications.length} active`,
    },
    resident: {
      name: 'Sarah Jenkins',
      title: 'Riverfront Neighborhood Resident & Local Council Volunteer',
      location: 'Riverfront District, City',
      cover: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      statLabel: 'Events Attending',
      statValue: '3 events',
    },
  };

  const currentProfile = roleProfiles[userRole];

  return (
    <div className="min-h-screen bg-[#f4f2ee] dark:bg-[#171c22] text-[#191919] dark:text-[#f3f5f7] transition-colors duration-200">
      {/* LinkedIn-Style Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenCreate={(type) => setCreateModal(type)}
        applicationCount={applications.length}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main 3-Column Container (Classic LinkedIn Desktop Experience) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Mini Profile Card & Shortcuts (Col 3 / 12)  */}
          {/* ======================================================== */}
          <aside className="lg:col-span-3 space-y-4">
            {/* LinkedIn-Style Profile Summary Card */}
            <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] overflow-hidden shadow-xs">
              {/* Cover Banner */}
              <div className="relative h-18 w-full overflow-hidden bg-gradient-to-r from-emerald-700 to-teal-800">
                <img
                  src={currentProfile.cover}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-65"
                />
              </div>

              {/* Avatar overlapping cover */}
              <div className="px-4 pb-4 pt-0 text-center relative">
                <div className="-mt-9 mb-2 inline-block relative">
                  <img
                    src={currentProfile.avatar}
                    alt={currentProfile.name}
                    className="w-18 h-18 rounded-full object-cover border-3 border-white dark:border-[#20262e] shadow-xs mx-auto"
                  />
                </div>

                <h3 className="font-bold text-[15px] text-slate-900 dark:text-white leading-tight">
                  {currentProfile.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                  {currentProfile.title}
                </p>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  📍 {currentProfile.location}
                </div>

                {/* Stats Divider */}
                <div className="mt-4 pt-3 border-t border-[#f0eee6] dark:border-[#2e3742] text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">Profile views</span>
                    <span className="font-bold text-[#057642] dark:text-emerald-400">142</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">{currentProfile.statLabel}</span>
                    <span className="font-bold text-[#057642] dark:text-emerald-400">{currentProfile.statValue}</span>
                  </div>
                </div>

                {/* Quick Dashboard Action */}
                <div className="mt-4 pt-3 border-t border-[#f0eee6] dark:border-[#2e3742]">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full py-1.5 rounded-xl text-xs font-bold bg-[#f4f2ee] hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-[#057642] dark:text-emerald-400 border border-[#e8e6df] dark:border-[#2e3742] transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Open My Dashboard</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Neighborhood Hub Shortcuts */}
            <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-4 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Neighborhood Shortcuts</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold cursor-pointer" onClick={() => setActiveTab('all')}>
                  View all
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setSearchQuery('University District');
                    setActiveTab('all');
                  }}
                  className="w-full text-left py-1 px-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#f4f2ee] dark:hover:bg-slate-800 font-medium flex items-center space-x-2 transition-colors"
                >
                  <span className="text-emerald-600 font-bold">#</span>
                  <span>University District</span>
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('Barista');
                    setActiveTab('jobs');
                  }}
                  className="w-full text-left py-1 px-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#f4f2ee] dark:hover:bg-slate-800 font-medium flex items-center space-x-2 transition-colors"
                >
                  <span className="text-emerald-600 font-bold">#</span>
                  <span>Student Jobs & Barista</span>
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('Workshop');
                    setActiveTab('events');
                  }}
                  className="w-full text-left py-1 px-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#f4f2ee] dark:hover:bg-slate-800 font-medium flex items-center space-x-2 transition-colors"
                >
                  <span className="text-teal-600 font-bold">#</span>
                  <span>Community Workshops</span>
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('Coffee');
                    setActiveTab('businesses');
                  }}
                  className="w-full text-left py-1 px-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-[#f4f2ee] dark:hover:bg-slate-800 font-medium flex items-center space-x-2 transition-colors"
                >
                  <span className="text-amber-600 font-bold">#</span>
                  <span>Specialty Coffee Roasters</span>
                </button>
              </div>

              {/* Saved Items */}
              <div className="pt-2 border-t border-[#f0eee6] dark:border-[#2e3742]">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full text-left text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-2"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Saved Opportunities</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* CENTER COLUMN: Main Feed, Post Trigger & Content (Col 6) */}
          {/* ======================================================== */}
          <main className="lg:col-span-6 space-y-4">
            {/* LinkedIn-Style "Start a Post" Card */}
            <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-4 shadow-xs space-y-3">
              <div className="flex items-center space-x-3">
                <img
                  src={currentProfile.avatar}
                  alt={currentProfile.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <button
                  onClick={() => setCreateModal('post')}
                  className="flex-1 text-left px-4 py-2.5 rounded-full bg-[#f4f2ee] dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs sm:text-[13px] font-medium border border-transparent hover:border-slate-300 dark:hover:border-slate-700 hover:bg-[#eae8e3] transition-all"
                >
                  Share an opportunity, workshop, or ask neighbors...
                </button>
              </div>

              {/* Action Buttons Below Post Bar */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => setCreateModal('job')}
                  className="flex items-center space-x-1.5 py-1.5 px-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#f4f2ee] dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-[#057642] dark:text-emerald-400" />
                  <span className="hidden sm:inline">Post Job</span>
                </button>

                <button
                  onClick={() => setCreateModal('event')}
                  className="flex items-center space-x-1.5 py-1.5 px-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#f4f2ee] dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">Host Event</span>
                </button>

                <button
                  onClick={() => setCreateModal('business')}
                  className="flex items-center space-x-1.5 py-1.5 px-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#f4f2ee] dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="hidden sm:inline">Add Business</span>
                </button>

                <button
                  onClick={() => setCreateModal('post')}
                  className="flex items-center space-x-1.5 py-1.5 px-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#f4f2ee] dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Discussion</span>
                </button>
              </div>
            </div>

            {/* Cozy Hero Walkthrough Card */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setActiveTab={setActiveTab}
              onOpenCreate={(type) => setCreateModal(type)}
              onSelectBusinessById={handleSelectBusinessById}
              userRole={userRole}
            />

            {/* TAB 1: ALL / HOME FEED */}
            {activeTab === 'all' && (
              <div className="space-y-4">
                {/* Immediate Job Vacancies (CareerLink Feed Section) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-[#057642] dark:text-emerald-400" />
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Featured jobs & projects
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="text-xs font-bold text-[#057642] dark:text-emerald-400 hover:underline"
                    >
                      Browse all ({jobs.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {jobs.slice(0, 2).map((job) => {
                      const hasApplied = applications.some(
                        (a) => a.jobId === job.id && a.applicantEmail.toLowerCase() === userEmail.toLowerCase()
                      );
                      return (
                        <JobCard
                          key={job.id}
                          job={job}
                          hasApplied={hasApplied}
                          onApply={(j) => setSelectedJobForApply(j)}
                          onSelectBusiness={handleSelectBusinessById}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Featured Community Events Feed Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Events worth exploring
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('events')}
                      className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
                    >
                      Browse all ({events.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {events.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start space-x-3.5">
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                              {evt.date} • {evt.time}
                            </span>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 line-clamp-1">
                              {evt.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Hosted by <strong>{evt.businessName}</strong> ({evt.price})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
                          <span className="text-xs text-slate-400 font-medium">
                            {evt.rsvpCount} RSVP&apos;d
                          </span>
                          <button
                            onClick={() => handleRsvpEvent(evt)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                              evt.attendees.includes(userEmail)
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                                : 'bg-[#057642] hover:bg-[#046237] text-white'
                            }`}
                          >
                            {evt.attendees.includes(userEmail) ? 'Attending ✓' : 'RSVP Spot'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community Feed Preview */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        From the community
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('community')}
                      className="text-xs font-bold text-[#057642] dark:text-emerald-400 hover:underline"
                    >
                      Join the conversation →
                    </button>
                  </div>

                  <CommunityFeed
                    posts={communityPosts.slice(0, 2)}
                    onOpenCreatePost={() => setCreateModal('post')}
                    onPostLiked={(updated) => {
                      setCommunityPosts((prev) =>
                        prev.map((p) => (p.id === updated.id ? updated : p))
                      );
                    }}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: LOCALLENS DIRECTORY */}
            {activeTab === 'businesses' && (
              <LocalLensSection
                businesses={businesses}
                onSelectBusiness={(b) => setSelectedBusiness(b)}
                onOpenRegister={() => setCreateModal('business')}
              />
            )}

            {/* TAB 3: COMMUNITY EVENTS */}
            {activeTab === 'events' && (
              <EventsSection
                events={events}
                userEmail={userEmail}
                onRsvp={handleRsvpEvent}
                onSelectBusiness={handleSelectBusinessById}
                onOpenHostEvent={() => setCreateModal('event')}
              />
            )}

            {/* TAB 4: CAREERLINK JOBS */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                {/* Type Filter Pills */}
                <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-base text-slate-900 dark:text-white">
                      Jobs & Projects
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Explore flexible work, local roles, and remote opportunities.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Part-time', 'Internship', 'Full-time', 'Contract'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setJobTypeFilter(type)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          jobTypeFilter === type
                            ? 'bg-[#057642] text-white shadow-xs'
                            : 'bg-[#f4f2ee] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Cards */}
                <div className="space-y-3">
                  {filteredJobs.map((job) => {
                    const hasApplied = applications.some(
                      (a) => a.jobId === job.id && a.applicantEmail.toLowerCase() === userEmail.toLowerCase()
                    );
                    return (
                      <JobCard
                        key={job.id}
                        job={job}
                        hasApplied={hasApplied}
                        onApply={(j) => setSelectedJobForApply(j)}
                        onSelectBusiness={handleSelectBusinessById}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: TALENT NETWORK */}
            {activeTab === 'talent' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-base text-slate-900 dark:text-white">
                      Talent & Services
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Meet independent professionals and people sharing their skills.
                    </p>
                  </div>
                  <button
                    onClick={() => setCreateModal('talent')}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#057642] hover:bg-[#046237] text-white shadow-xs"
                  >
                    + Join Directory
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTalent.map((tal) => (
                    <TalentCard key={tal.id} talent={tal} />
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: COMMUNITY BOARD */}
            {activeTab === 'community' && (
              <div className="space-y-4">
                <CommunityFeed
                  posts={communityPosts}
                  onOpenCreatePost={() => setCreateModal('post')}
                  onPostLiked={(updated) => {
                    setCommunityPosts((prev) =>
                      prev.map((p) => (p.id === updated.id ? updated : p))
                    );
                  }}
                />
              </div>
            )}

            {/* TAB 7: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <DashboardView
                userRole={userRole}
                setUserRole={setUserRole}
                applications={applications}
                businesses={businesses}
                events={events}
                jobs={jobs}
                onUpdateAppStatus={handleUpdateAppStatus}
                onOpenCreate={(type) => setCreateModal(type)}
                onResetDatabase={handleResetDatabase}
              />
            )}
          </main>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: DAPIT News & Recommendations (Col 3 / 12)  */}
          {/* ======================================================== */}
          <aside className="lg:col-span-3 space-y-4">
            {/* DAPIT News (LinkedIn News Widget) */}
            <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#057642] dark:text-emerald-400" />
                  <span>DAPIT Neighborhood News</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Top Stories</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div
                    onClick={() => handleSelectBusinessById('biz-1')}
                    className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#057642] dark:hover:text-emerald-400 cursor-pointer line-clamp-1"
                  >
                    Latte Art Workshop this Saturday
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    2d ago • 28 neighbors attending
                  </div>
                </div>

                <div>
                  <div
                    onClick={() => setActiveTab('jobs')}
                    className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#057642] dark:hover:text-emerald-400 cursor-pointer line-clamp-1"
                  >
                    NextWave Tech Lab launches internships
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    3d ago • 14 local applicants
                  </div>
                </div>

                <div>
                  <div
                    onClick={() => setActiveTab('events')}
                    className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#057642] dark:hover:text-emerald-400 cursor-pointer line-clamp-1"
                  >
                    Riverfront Tune-Up & Scenic Group Ride
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Summit Cycle • Free admission
                  </div>
                </div>

                <div>
                  <div
                    onClick={() => setActiveTab('businesses')}
                    className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#057642] dark:hover:text-emerald-400 cursor-pointer line-clamp-1"
                  >
                    Artisan Roastery is hiring weekend baristas
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    University District • $18.50 - $22/hr
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Businesses (LinkedIn "Add to your feed" style) */}
            <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-4 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Featured Local Establishments</span>
                <span
                  onClick={() => setActiveTab('businesses')}
                  className="text-[10px] text-[#057642] dark:text-emerald-400 cursor-pointer font-semibold hover:underline"
                >
                  View all
                </span>
              </div>

              <div className="space-y-3">
                {businesses.slice(0, 3).map((biz) => (
                  <div key={biz.id} className="flex items-start space-x-3">
                    <img
                      src={biz.image}
                      alt={biz.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#e8e6df] dark:border-[#2e3742] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {biz.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {biz.category} • {biz.neighborhood}
                      </div>
                      <button
                        onClick={() => setSelectedBusiness(biz)}
                        className="mt-1 text-[11px] font-bold text-[#057642] dark:text-emerald-400 hover:underline"
                      >
                        Explore & Vacancies →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cozy Micro-Footer */}
            <div className="px-2 text-[11px] text-slate-400 dark:text-slate-500 space-y-2">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <Link href="/login" className="hover:text-slate-600 dark:hover:text-slate-300 hover:underline font-semibold text-[#057642] dark:text-emerald-400">
                  Facebook-Style Login
                </Link>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('businesses')}>
                  LocalLens
                </span>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('events')}>
                  Events
                </span>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('jobs')}>
                  CareerLink
                </span>
                <span className="cursor-pointer hover:underline" onClick={() => setActiveTab('talent')}>
                  Talent Hub
                </span>
              </div>
              <div>
                © 2026 DAPIT Platform. Built with Apple typography & LinkedIn cozy UI.
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Interactive Modals */}
      <BusinessModal
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        jobs={jobs}
        events={events}
        onApplyJob={(job) => setSelectedJobForApply(job)}
        onRsvpEvent={handleRsvpEvent}
      />

      <ApplyModal
        job={selectedJobForApply}
        userRole={userRole}
        onClose={() => setSelectedJobForApply(null)}
        onSuccess={(newApp) => {
          setApplications((prev) => [newApp, ...prev]);
          setJobs((prev) =>
            prev.map((j) => (j.id === newApp.jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
          );
        }}
      />

      {createModal === 'business' && (
        <RegisterBusinessModal
          onClose={() => setCreateModal(null)}
          onSuccess={(newBiz) => {
            setBusinesses((prev) => [newBiz, ...prev]);
            setSelectedBusiness(newBiz);
          }}
        />
      )}

      {createModal === 'job' && (
        <PostJobModal
          businesses={businesses}
          onClose={() => setCreateModal(null)}
          onSuccess={(newJob) => {
            setJobs((prev) => [newJob, ...prev]);
            setActiveTab('jobs');
          }}
        />
      )}

      {createModal === 'event' && (
        <HostEventModal
          businesses={businesses}
          onClose={() => setCreateModal(null)}
          onSuccess={(newEvent) => {
            setEvents((prev) => [newEvent, ...prev]);
            setActiveTab('events');
          }}
        />
      )}

      {createModal === 'post' && (
        <CreatePostModal
          userRole={userRole}
          onClose={() => setCreateModal(null)}
          onSuccess={(newPost) => {
            setCommunityPosts((prev) => [newPost, ...prev]);
            setActiveTab('community');
          }}
        />
      )}

      {createModal === 'talent' && (
        <JoinTalentModal
          onClose={() => setCreateModal(null)}
          onSuccess={(newTalent) => {
            setTalent((prev) => [newTalent, ...prev]);
            setActiveTab('talent');
          }}
        />
      )}
    </div>
  );
}
