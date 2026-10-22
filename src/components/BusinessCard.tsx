'use client';

import React from 'react';
import { Business } from '@/types';
import { MapPin, Star, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

interface BusinessCardProps {
  business: Business;
  onSelect: (business: Business) => void;
  onViewJobs?: (businessId: string) => void;
  onViewEvents?: (businessId: string) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onSelect,
}) => {
  return (
    <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
      {/* Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#20262e]/95 backdrop-blur-md text-[#057642] dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-[#e8e6df] dark:border-[#2e3742]">
          {business.category}
        </div>
        {business.isVerified && (
          <div className="absolute top-3 right-3 bg-[#057642] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#057642] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                {business.name}
              </h3>
              <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="line-clamp-1">{business.address} ({business.neighborhood})</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold px-1.5 py-0.5 rounded-lg shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{business.rating}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
            {business.tagline}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {business.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] bg-[#f4f2ee] dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          {/* Integration Badges (LocalLens + CareerLink) */}
          <div className="mt-3.5 pt-2.5 border-t border-[#f0eee6] dark:border-[#2e3742] flex flex-wrap gap-1.5 text-xs">
            {business.hiringActive && (
              <span className="inline-flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-950/80 text-[#057642] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                <Briefcase className="w-3 h-3 text-[#057642] dark:text-emerald-400" />
                <span>Hiring ({business.activeJobsCount})</span>
              </span>
            )}
            {business.activeEventsCount > 0 && (
              <span className="inline-flex items-center space-x-1 bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                <Calendar className="w-3 h-3 text-teal-600" />
                <span>Event Scheduled</span>
              </span>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-3 pt-1">
            <button
              onClick={() => onSelect(business)}
              className="w-full py-1.5 bg-[#f4f2ee] hover:bg-emerald-50 text-[#057642] dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-emerald-300 font-bold text-xs rounded-xl border border-[#e8e6df] dark:border-[#2e3742] hover:border-[#057642] transition-all flex items-center justify-center space-x-1"
            >
              <span>Explore Shop & Vacancies</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
