'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ActiveTab, UserRole } from '@/types';
import {
  Compass,
  Store,
  Calendar,
  Briefcase,
  Users,
  MessageSquare,
  LayoutDashboard,
  PlusCircle,
  Coffee,
  GraduationCap,
  Home as HomeIcon,
  Sun,
  Moon,
  Search,
  LogIn,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenCreate: (type: 'business' | 'event' | 'job' | 'post' | 'talent') => void;
  applicationCount: number;
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  onOpenCreate,
  applicationCount,
  darkMode,
  toggleDarkMode,
  searchQuery = '',
  setSearchQuery,
}) => {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const roleDetails = {
    business_owner: {
      name: 'Elena Rostova',
      title: 'Owner @ Artisan Roastery',
      icon: Coffee,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    },
    student: {
      name: 'Marcus Tan',
      title: 'Undergraduate @ City University',
      icon: GraduationCap,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
    resident: {
      name: 'Sarah Jenkins',
      title: 'Riverfront Neighborhood Resident',
      icon: HomeIcon,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
  };

  const currentRole = roleDetails[userRole];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#1f242b] border-b border-[#e8e6df] dark:border-[#2e3742] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Left: Brand Logo + Integrated Search Bar (LinkedIn Style) */}
          <div className="flex items-center space-x-3 flex-1 max-w-xs sm:max-w-md">
            {/* Logo */}
            <div
              onClick={() => setActiveTab('all')}
              className="flex items-center space-x-2 cursor-pointer shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-[#057642] flex items-center justify-center text-white font-black text-lg shadow-xs">
                D
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#057642] dark:text-emerald-400 hidden xl:inline">
                dapit
              </span>
            </div>

            {/* Embedded Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                placeholder="Search places, services, jobs, people..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-[13px] rounded-lg bg-[#edf3f8]/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 border border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Center: Iconic LinkedIn Vertical Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 h-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`relative flex flex-col items-center justify-center px-3.5 h-full text-[11px] font-medium transition-all ${
                activeTab === 'all'
                  ? 'text-[#191919] dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className={`w-5 h-5 mb-0.5 ${activeTab === 'all' ? 'text-[#057642] dark:text-emerald-400' : ''}`} />
              <span>Home</span>
              {activeTab === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#057642] dark:bg-emerald-400 rounded-t-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('businesses')}
              className={`relative flex flex-col items-center justify-center px-3.5 h-full text-[11px] font-medium transition-all ${
                activeTab === 'businesses'
                  ? 'text-[#191919] dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Store className={`w-5 h-5 mb-0.5 ${activeTab === 'businesses' ? 'text-[#057642] dark:text-emerald-400' : ''}`} />
              <span>LocalLens</span>
              {activeTab === 'businesses' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#057642] dark:bg-emerald-400 rounded-t-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`relative flex flex-col items-center justify-center px-3.5 h-full text-[11px] font-medium transition-all ${
                activeTab === 'events'
                  ? 'text-[#191919] dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className={`w-5 h-5 mb-0.5 ${activeTab === 'events' ? 'text-[#057642] dark:text-emerald-400' : ''}`} />
              <span>Events</span>
              {activeTab === 'events' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#057642] dark:bg-emerald-400 rounded-t-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`relative flex flex-col items-center justify-center px-3.5 h-full text-[11px] font-medium transition-all ${
                activeTab === 'jobs'
                  ? 'text-[#191919] dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className={`w-5 h-5 mb-0.5 ${activeTab === 'jobs' ? 'text-[#057642] dark:text-emerald-400' : ''}`} />
              <span>Jobs</span>
              {activeTab === 'jobs' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#057642] dark:bg-emerald-400 rounded-t-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('talent')}
              className={`relative flex flex-col items-center justify-center px-3.5 h-full text-[11px] font-medium transition-all ${
                activeTab === 'talent'
                  ? 'text-[#191919] dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className={`w-5 h-5 mb-0.5 ${activeTab === 'talent' ? 'text-[#057642] dark:text-emerald-400' : ''}`} />
              <span>Network</span>
              {activeTab === 'talent' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#057642] dark:bg-emerald-400 rounded-t-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`relative flex flex-col items-center justify-center px-3.5 h-full text-[11px] font-medium transition-all ${
                activeTab === 'community'
                  ? 'text-[#191919] dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className={`w-5 h-5 mb-0.5 ${activeTab === 'community' ? 'text-[#057642] dark:text-emerald-400' : ''}`} />
              <span>Community</span>
              {activeTab === 'community' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#057642] dark:bg-emerald-400 rounded-t-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`relative flex flex-col items-center justify-center px-3.5 h-full text-[11px] font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'text-[#191919] dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 mb-0.5 ${activeTab === 'dashboard' ? 'text-[#057642] dark:text-emerald-400' : ''}`} />
              <span>Dashboard</span>
              {applicationCount > 0 && (
                <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-emerald-600"></span>
              )}
              {activeTab === 'dashboard' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#057642] dark:bg-emerald-400 rounded-t-full"></span>
              )}
            </button>
          </nav>

          {/* Right: Me Profile Dropdown + Quick Post + Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-[#f4f2ee] dark:hover:bg-slate-800 transition-colors"
              title="Toggle Light / Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Profile "Me" Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <img
                  src={currentRole.avatar}
                  alt={currentRole.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                />
                <div className="hidden sm:flex items-center space-x-0.5 text-[11px] font-medium mt-0.5">
                  <span className="truncate max-w-14">Me</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </button>

              {profileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#20262e] rounded-2xl shadow-xl border border-[#e8e6df] dark:border-[#2e3742] p-3 z-50">
                    <div className="flex items-center space-x-3 pb-3 border-b border-[#f0eee6] dark:border-[#2e3742]">
                      <img
                        src={currentRole.avatar}
                        alt={currentRole.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-600/30"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {currentRole.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {currentRole.title}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                        Switch profile
                      </div>
                      <button
                        onClick={() => {
                          setUserRole('student');
                          setProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${
                          userRole === 'student'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#057642] dark:text-emerald-400'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                        <span>Marcus Tan (Student Seeker)</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserRole('business_owner');
                          setProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${
                          userRole === 'business_owner'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#057642] dark:text-emerald-400'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Coffee className="w-4 h-4 text-amber-600" />
                        <span>Elena Rostova (Café Owner)</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserRole('resident');
                          setProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${
                          userRole === 'resident'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#057642] dark:text-emerald-400'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <HomeIcon className="w-4 h-4 text-teal-600" />
                        <span>Sarah Jenkins (Resident)</span>
                      </button>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#f0eee6] dark:border-[#2e3742]">
                      <Link
                        href="/login"
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-bold text-[#057642] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center space-x-1.5"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign in or create account</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Post Button */}
            <div className="relative">
              <button
                onClick={() => setCreateMenuOpen(!createMenuOpen)}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#057642] hover:bg-[#046237] text-white shadow-xs transition-all active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post</span>
              </button>

              {createMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCreateMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#20262e] rounded-2xl shadow-xl border border-[#e8e6df] dark:border-[#2e3742] p-1.5 z-50">
                    <button
                      onClick={() => {
                        onOpenCreate('post');
                        setCreateMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 rounded-lg flex items-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Start a Discussion</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenCreate('job');
                        setCreateMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 rounded-lg flex items-center space-x-2"
                    >
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span>Post Job Vacancy</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenCreate('event');
                        setCreateMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 rounded-lg flex items-center space-x-2"
                    >
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>Host Community Event</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenCreate('business');
                        setCreateMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 rounded-lg flex items-center space-x-2"
                    >
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span>Register Local Business</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenCreate('talent');
                        setCreateMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 rounded-lg flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4 text-teal-600" />
                      <span>Join Talent Network</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-[#f0eee6] dark:border-[#2e3742] scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#057642] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('businesses')}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              activeTab === 'businesses'
                ? 'bg-[#057642] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Places
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              activeTab === 'events'
                ? 'bg-[#057642] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              activeTab === 'jobs'
                ? 'bg-[#057642] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('talent')}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              activeTab === 'talent'
                ? 'bg-[#057642] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Talent
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              activeTab === 'community'
                ? 'bg-[#057642] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-[#057642] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Dashboard
          </button>
        </div>
      </div>
    </header>
  );
};
