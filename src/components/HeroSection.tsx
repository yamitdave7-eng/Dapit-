'use client';

import React from 'react';
import { ArrowRight, BriefcaseBusiness, CalendarDays, Compass, MapPin, Plus, Store, UsersRound } from 'lucide-react';
import { ActiveTab, UserRole } from '@/types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCreate: (type: 'business' | 'event' | 'job' | 'post' | 'talent') => void;
  onSelectBusinessById: (id: string) => void;
  userRole?: UserRole;
}

const destinations: { label: string; description: string; tab: ActiveTab; icon: React.ElementType }[] = [
  { label: 'Places & services', description: 'Spaces, shops, and people who can help', tab: 'businesses', icon: Store },
  { label: 'Events', description: 'Things to do, nearby or anywhere', tab: 'events', icon: CalendarDays },
  { label: 'Jobs & projects', description: 'From local shifts to remote work', tab: 'jobs', icon: BriefcaseBusiness },
  { label: 'People & skills', description: 'Find talent or share what you do', tab: 'talent', icon: UsersRound },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab, onOpenCreate }) => {
  return (
    <section className="market-hero mb-7 overflow-hidden rounded-[28px] border border-white/70 shadow-[0_24px_70px_-38px_rgba(23,52,41,0.38)]">
      <div className="relative px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <div className="market-hero-orb market-hero-orb-one" />
        <div className="market-hero-orb market-hero-orb-two" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/75 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-emerald-900 shadow-sm backdrop-blur">
            <Compass className="h-3.5 w-3.5" />
            One marketplace. Wherever you are.
          </div>
          <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-[1.06] tracking-[-0.045em] text-[#143b2c] sm:text-4xl lg:text-[46px]">
            Find your next place, project, or person.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#49695a] sm:text-base">
            Discover venues, services, events, jobs, and independent talent. Browse nearby or connect from anywhere.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-[#426353]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-700" /> Nearby discovery</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5">Remote opportunities</span>
            <span className="rounded-full bg-white/70 px-3 py-1.5">People-powered</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setActiveTab('businesses')} className="inline-flex items-center gap-2 rounded-xl bg-[#174d37] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-950/10 transition hover:bg-[#103d2b]">
              Explore marketplace <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => onOpenCreate('post')} className="inline-flex items-center gap-2 rounded-xl border border-emerald-900/15 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#174d37] transition hover:bg-white">
              <Plus className="h-4 w-4" /> Start a discussion
            </button>
          </div>
        </div>
        <div className="relative z-10 mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map(({ label, description, tab, icon: Icon }) => (
            <button key={label} onClick={() => setActiveTab(tab)} className="group flex min-h-[82px] items-center gap-3 rounded-2xl border border-white/80 bg-white/75 p-3.5 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f3ec] text-[#236344] transition group-hover:bg-[#dcecdf]"><Icon className="h-[18px] w-[18px]" /></span>
              <span className="min-w-0"><span className="block text-[13px] font-semibold text-[#1b3d2e]">{label}</span><span className="mt-0.5 block text-[11px] leading-4 text-[#607568]">{description}</span></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
