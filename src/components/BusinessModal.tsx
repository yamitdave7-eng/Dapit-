'use client';

import React, { useState } from 'react';
import { Business, Job, Event } from '@/types';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  CheckCircle2,
  Briefcase,
  Calendar,
  ArrowRight,
  Send,
} from 'lucide-react';

interface BusinessModalProps {
  business: Business | null;
  onClose: () => void;
  jobs: Job[];
  events: Event[];
  onApplyJob: (job: Job) => void;
  onRsvpEvent: (event: Event) => void;
}

export const BusinessModal: React.FC<BusinessModalProps> = ({
  business,
  onClose,
  jobs,
  events,
  onApplyJob,
  onRsvpEvent,
}) => {
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');

  if (!business) return null;

  const businessJobs = jobs.filter(
    (j) => j.businessId === business.id || j.businessName.toLowerCase() === business.name.toLowerCase()
  );
  const businessEvents = events.filter(
    (e) => e.businessId === business.id || e.businessName.toLowerCase() === business.name.toLowerCase()
  );

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquiryMessage('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col border border-emerald-100 dark:border-slate-800 transition-colors">
        {/* Header Cover */}
        <div className="relative h-60 w-full shrink-0 bg-slate-100 dark:bg-slate-800">
          <img
            src={business.image}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Category over image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
                {business.category}
              </span>
              {business.isVerified && (
                <span className="bg-teal-600/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Partner</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-xs">
              {business.name}
            </h2>
            <div className="flex items-center space-x-2 text-xs text-slate-200 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{business.address} • {business.neighborhood}</span>
              <span>•</span>
              <div className="flex items-center space-x-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>{business.rating} ({business.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {/* About Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">About this Business</h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              {business.description || business.tagline}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {business.tags.map((t, i) => (
                <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-medium">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Hours Quick Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="flex items-center space-x-2.5 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>Hours:</strong> {business.openHours}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>Phone:</strong> {business.phone}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>Email:</strong> {business.email}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-700 dark:text-slate-300">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <a
                href={business.website}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline truncate"
              >
                {business.website || 'Visit website'}
              </a>
            </div>
          </div>

          {/* Integrated Career Opportunities (CareerLink Integration) */}
          <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Active CareerLink Vacancies ({businessJobs.length})
                </h4>
              </div>
              <span className="text-[11px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                Hiring Local Talent
              </span>
            </div>

            {businessJobs.length === 0 ? (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                No open vacancies currently listed. Follow this business on DAPIT to be notified of new student or resident openings!
              </p>
            ) : (
              <div className="space-y-3">
                {businessJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                          {job.jobType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.salaryRange} • {job.workplaceType}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">{job.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onApplyJob(job);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center justify-center space-x-1 shadow-xs"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Integrated Community Events (LocalLens Integration) */}
          <div className="p-5 bg-teal-50/70 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Upcoming Community Events ({businessEvents.length})
                </h4>
              </div>
              <span className="text-[11px] bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 font-bold px-2 py-0.5 rounded-full">
                Workshops & Gatherings
              </span>
            </div>

            {businessEvents.length === 0 ? (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                No events scheduled at this moment. Stay tuned for future community meetups.
              </p>
            ) : (
              <div className="space-y-3">
                {businessEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-teal-200/80 dark:border-teal-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{evt.title}</span>
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-medium mt-0.5">
                        📅 {evt.date} • {evt.time} ({evt.price})
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">{evt.description}</p>
                    </div>

                    <button
                      onClick={() => onRsvpEvent(evt)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center justify-center space-x-1 shadow-xs"
                    >
                      <span>RSVP ({evt.rsvpCount})</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Direct Inquiry Form */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Send a direct community message to {business.name}
            </h4>
            <form onSubmit={handleSendInquiry} className="flex gap-2">
              <input
                type="text"
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Ask about workshop details, catering, student discounts..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
            {inquirySent && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1.5">
                ✓ Message sent to {business.name}! They typically respond within 24 hours.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
