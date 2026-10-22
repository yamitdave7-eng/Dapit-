'use client';

import React, { useState } from 'react';
import { Event } from '@/types';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Ticket,
  Search,
  Building2,
} from 'lucide-react';

interface EventsSectionProps {
  events: Event[];
  userEmail: string;
  onRsvp: (event: Event) => void;
  onSelectBusiness: (businessId: string) => void;
  onOpenHostEvent: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  userEmail,
  onRsvp,
  onSelectBusiness,
  onOpenHostEvent,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filterOptions = [
    'All',
    'Workshop',
    'Networking',
    'Free Admission',
    'Social & Meetup',
    'Arts & Culture',
  ];

  const filtered = events.filter((e) => {
    const matchFree = selectedFilter === 'Free Admission' ? e.price.toLowerCase().includes('free') : true;
    const matchCat =
      selectedFilter === 'All' || selectedFilter === 'Free Admission'
        ? true
        : e.category === selectedFilter;
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.businessName.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());

    return matchFree && matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Editorial Header Banner (Cozy Apple/LinkedIn Style) */}
      <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[11px] font-bold border border-teal-200/80 dark:border-teal-800/60">
              <Calendar className="w-3.5 h-3.5" />
              <span>Community Workshops & Meetups</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Local Happenings & Masterclasses
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Hands-on latte art, startup mixers, pottery throwing, and bike clinics hosted by neighborhood businesses.
            </p>
          </div>

          <button
            onClick={onOpenHostEvent}
            className="px-4 py-2 bg-[#057642] hover:bg-[#046237] text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
          >
            + Host Community Event
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#20262e] rounded-2xl p-4 border border-[#e8e6df] dark:border-[#2e3742] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, workshops, or host venues..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-[#f4f2ee] dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedFilter(opt)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedFilter === opt
                  ? 'bg-[#057642] text-white shadow-xs'
                  : 'bg-[#f4f2ee] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      {filtered.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742]">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">No events found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try switching your filter or search term.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((evt) => {
            const isAttending = evt.attendees.includes(userEmail);
            const dateObj = new Date(evt.date);
            const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = dateObj.toLocaleDateString('en-US', { day: '2-digit' });

            return (
              <div
                key={evt.id}
                className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-5 shadow-xs hover:border-[#057642] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  {/* Calendar Date Block */}
                  <div className="bg-[#f4f2ee] dark:bg-slate-800 rounded-xl p-2.5 text-center min-w-13 border border-[#e8e6df] dark:border-[#2e3742] shrink-0">
                    <span className="block text-[10px] font-black text-[#057642] dark:text-emerald-400 tracking-wider">
                      {monthStr || 'OCT'}
                    </span>
                    <span className="block text-lg font-black text-slate-900 dark:text-white leading-none mt-0.5">
                      {dayStr || '25'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                        {evt.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {evt.time}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1 hover:text-[#057642] transition-colors">
                      {evt.title}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Hosted by:</span>
                      <button
                        onClick={() => onSelectBusiness(evt.businessId)}
                        className="font-bold text-slate-800 dark:text-slate-200 hover:underline hover:text-[#057642]"
                      >
                        {evt.businessName}
                      </button>
                      <span>•</span>
                      <span>{evt.location}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0eee6] dark:border-[#2e3742]">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                      {evt.price}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {evt.rsvpCount} attending
                    </span>
                  </div>

                  <button
                    onClick={() => onRsvp(evt)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                      isAttending
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                        : 'bg-[#057642] hover:bg-[#046237] text-white'
                    }`}
                  >
                    {isAttending ? 'Attending ✓' : 'RSVP Free'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
