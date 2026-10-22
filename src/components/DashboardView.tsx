'use client';

import React from 'react';
import { UserRole, Application, Business, Event, Job } from '@/types';
import {
  Briefcase,
  Calendar,
  RotateCcw,
  Coffee,
  GraduationCap,
  Home,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  applications: Application[];
  businesses: Business[];
  events: Event[];
  jobs: Job[];
  onUpdateAppStatus: (appId: string, status: Application['status']) => void;
  onOpenCreate: (type: 'business' | 'event' | 'job' | 'post' | 'talent') => void;
  onResetDatabase: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userRole,
  setUserRole,
  applications,
  businesses,
  events,
  onUpdateAppStatus,
  onOpenCreate,
  onResetDatabase,
}) => {
  const isOwner = userRole === 'business_owner';
  const myBusiness = businesses.find((b) => b.id === 'biz-1') || businesses[0];

  // Applications relevant to owner
  const ownerApplications = applications.filter(
    (a) => a.businessId === myBusiness?.id || a.businessName === myBusiness?.name
  );

  // Applications submitted by student
  const studentApplications = applications.filter(
    (a) => a.applicantEmail.includes('student') || a.applicantName.includes('Marcus')
  );

  // Events attended
  const attendedEvents = events.filter((e) =>
    e.attendees.some((att) => att.includes('student') || att.includes('marcus') || att.includes('you'))
  );

  const statusStyles: Record<Application['status'], string> = {
    Pending: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    Reviewing: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    Interviewing: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    Accepted: 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border-emerald-400 dark:border-emerald-700',
    Rejected: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  };

  return (
    <div className="space-y-8">
      {/* Top Profile Banner (Forest & Emerald Dark Gradient) */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-md border border-emerald-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              {isOwner ? (
                <Coffee className="w-8 h-8 text-amber-300" />
              ) : userRole === 'student' ? (
                <GraduationCap className="w-8 h-8 text-emerald-300" />
              ) : (
                <Home className="w-8 h-8 text-teal-300" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black text-white">
                  {isOwner ? 'Elena Rostova' : userRole === 'student' ? 'Marcus Tan' : 'Sarah Jenkins'}
                </h2>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {isOwner ? 'Business Owner' : userRole === 'student' ? 'Student & Job Seeker' : 'Local Resident'}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1">
                {isOwner
                  ? 'Managing Artisan Roastery & Café • University District'
                  : userRole === 'student'
                  ? 'City University (Sophomore) • Open to Part-Time & Internships'
                  : 'Active Riverfront Resident & Neighborhood Council Member'}
              </p>
            </div>
          </div>

          {/* Quick Persona Switch & DB Reset */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setUserRole(isOwner ? 'student' : 'business_owner')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <span>Switch to {isOwner ? 'Student View' : 'Café Owner View'}</span>
            </button>
            <button
              onClick={onResetDatabase}
              className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5"
              title="Reset data back to seed state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-xs text-emerald-200/80 font-medium">
              {isOwner ? 'Active Vacancies' : 'Jobs Applied'}
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {isOwner ? myBusiness?.activeJobsCount || 1 : studentApplications.length}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-xs text-emerald-200/80 font-medium">
              {isOwner ? 'Candidate Applications' : 'Interviewing'}
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1">
              {isOwner
                ? ownerApplications.length
                : studentApplications.filter((a) => a.status === 'Interviewing' || a.status === 'Reviewing').length}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-xs text-emerald-200/80 font-medium">
              {isOwner ? 'Workshop RSVPs' : 'Events Attending'}
            </div>
            <div className="text-2xl font-black text-teal-300 mt-1">
              {isOwner ? '28' : attendedEvents.length}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-xs text-emerald-200/80 font-medium">
              Community Status
            </div>
            <div className="text-2xl font-black text-amber-300 mt-1">
              {isOwner ? '4.9 ★' : 'Top Talent'}
            </div>
          </div>
        </div>
      </div>

      {/* Owner View: Candidate Applications Management */}
      {isOwner ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Incoming Candidate Applications (CareerLink)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review applicants for your café and update their hiring pipeline status in real-time.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenCreate('job')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm shadow-emerald-600/20"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>+ Post New Job</span>
              </button>
              <button
                onClick={() => onOpenCreate('event')}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm shadow-teal-600/20"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>+ Host New Workshop</span>
              </button>
            </div>
          </div>

          {ownerApplications.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No applications received yet.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Applicants will appear here once candidates apply to your roles.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ownerApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white text-base">{app.applicantName}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">({app.applicantRole})</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          statusStyles[app.status]
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      Applied for: {app.jobTitle} • {app.appliedAt}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                      &quot;{app.coverNote || 'Looking forward to meeting the team!'}&quot;
                    </p>

                    <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-3 pt-1">
                      <span>📧 {app.applicantEmail}</span>
                      <span>📞 {app.applicantPhone}</span>
                      {app.portfolioUrl && (
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Profile / Resume</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown Controller */}
                  <div className="shrink-0 flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 pl-1">Status:</span>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        onUpdateAppStatus(app.id, e.target.value as Application['status'])
                      }
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Accepted">Accepted / Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Student / Resident View: My Applications Tracker */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                My Job & Internship Applications (CareerLink)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your active applications, status updates from local business employers, and interview requests.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {studentApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">{app.jobTitle}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        statusStyles[app.status]
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    <strong>{app.businessName}</strong> • Submitted {app.appliedAt}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{app.resumeSummary}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] text-slate-400 font-medium">Hiring Process:</div>
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {app.status === 'Interviewing' ? '🎉 Interview Scheduled!' : app.status === 'Accepted' ? '✨ Hired!' : 'Under Review'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Attending Events */}
          <div className="pt-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              My Community Events & Workshops (LocalLens)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Local workshops and events you have RSVP&apos;d to.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attendedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 p-4 shadow-xs flex items-center space-x-3.5"
                >
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {evt.date} • {evt.time}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1 line-clamp-1">{evt.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{evt.businessName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
