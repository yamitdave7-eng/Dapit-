'use client';

import React, { useState } from 'react';
import { Job } from '@/types';
import {
  MapPin,
  DollarSign,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Briefcase,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  hasApplied: boolean;
  onApply: (job: Job) => void;
  onSelectBusiness?: (businessId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  hasApplied,
  onApply,
  onSelectBusiness,
}) => {
  const [saved, setSaved] = useState(false);

  const defaultLogo =
    job.businessLogo ||
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80';

  return (
    <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Business Logo + Job Title + Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3.5 flex-1 min-w-0">
            {/* Square Business Logo (LinkedIn style) */}
            <div
              onClick={() => onSelectBusiness && onSelectBusiness(job.businessId)}
              className="w-12 h-12 rounded-xl overflow-hidden border border-[#e8e6df] dark:border-[#2e3742] bg-slate-50 dark:bg-slate-800 shrink-0 cursor-pointer group-hover:border-emerald-500/50 transition-colors"
            >
              <img
                src={defaultLogo}
                alt={job.businessName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Company */}
            <div className="flex-1 min-w-0">
              <h3
                onClick={() => onApply(job)}
                className="font-bold text-[15px] sm:text-base text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer leading-snug line-clamp-1"
              >
                {job.title}
              </h3>

              <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                <button
                  onClick={() => onSelectBusiness && onSelectBusiness(job.businessId)}
                  className="font-medium text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline truncate"
                >
                  {job.businessName}
                </button>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>

              <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                  <span>{job.neighborhood}</span>
                </span>
                <span>•</span>
                <span>{job.workplaceType}</span>
                <span>•</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {job.jobType}
                </span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => setSaved(!saved)}
            className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 ${
              saved
                ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-600'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title={saved ? 'Job Saved' : 'Save Job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Salary & Hiring Badges (LinkedIn cozy pill) */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-lg">
            <DollarSign className="w-3 h-3 text-emerald-600" />
            <span>{job.salaryRange}</span>
          </div>

          <div className="inline-flex items-center space-x-1 text-[11px] text-slate-600 dark:text-slate-400 bg-[#f4f2ee] dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-[#e8e6df] dark:border-[#2e3742]">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Actively recruiting</span>
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center space-x-1 ml-auto">
            <Clock className="w-3 h-3" />
            <span>{job.postedAt}</span>
          </span>
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Requirements preview */}
        <div className="mt-2.5 space-y-1">
          {job.requirements.slice(0, 2).map((req, i) => (
            <div key={i} className="flex items-start space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">•</span>
              <span className="line-clamp-1">{req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Apply Action (Signature LinkedIn Easy Apply styling) */}
      <div className="mt-4 pt-3.5 border-t border-[#f0eee6] dark:border-[#2e3742] flex items-center justify-between">
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          <strong>{job.applicantsCount}</strong> neighbors applied
        </div>

        <button
          onClick={() => onApply(job)}
          disabled={hasApplied}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 flex items-center space-x-1.5 shadow-xs ${
            hasApplied
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
              : 'bg-[#057642] hover:bg-[#046237] text-white active:scale-95'
          }`}
        >
          <span>{hasApplied ? 'Applied ✓' : 'Easy Apply'}</span>
          {!hasApplied && <ArrowRight className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
