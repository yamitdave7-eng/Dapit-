'use client';

import React, { useState } from 'react';
import { TalentProfile } from '@/types';
import { ExternalLink, CheckCircle2, Send } from 'lucide-react';

interface TalentCardProps {
  talent: TalentProfile;
}

export const TalentCard: React.FC<TalentCardProps> = ({ talent }) => {
  const [invited, setInvited] = useState(false);

  const roleColors = {
    'Student': 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    'Recent Graduate': 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    'Local Freelancer': 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    'Career Changer': 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  };

  return (
    <div className="ui-card bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 p-6 shadow-xs hover:shadow-lg hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all flex flex-col justify-between">
      <div>
        {/* Top Profile Header */}
        <div className="flex items-start space-x-3.5">
          <img
            src={talent.avatar}
            alt={talent.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-100 dark:border-slate-700 shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{talent.name}</h3>
              {talent.isAvailable && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Open to Work" />
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{talent.universityOrOrg}</p>
            <span
              className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1.5 ${
                roleColors[talent.role] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {talent.role}
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="mt-4 text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
          {talent.title}
        </div>

        {/* Bio */}
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {talent.bio}
        </p>

        {/* Skills */}
        <div className="mt-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Skills</div>
          <div className="flex flex-wrap gap-1">
            {talent.skills.map((s, i) => (
              <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium px-2 py-0.5 rounded">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Looking For */}
        <div className="mt-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Looking For</div>
          <div className="flex flex-wrap gap-1">
            {talent.lookingFor.map((lf, i) => (
              <span key={i} className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                🎯 {lf}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Connect */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        {talent.portfolioUrl ? (
          <a
            href={talent.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Portfolio</span>
          </a>
        ) : (
          <span className="text-xs text-slate-400">{talent.contactEmail}</span>
        )}

        <button
          onClick={() => setInvited(!invited)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
            invited
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
          }`}
        >
          {invited ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Invited ✓</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Connect / Invite</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
