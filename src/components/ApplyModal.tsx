'use client';

import React, { useState } from 'react';
import { Job, Application } from '@/types';
import type { AccountProfile } from '@/types/auth';
import { X, Briefcase, Building2, Send, CheckCircle2, User, Mail, Phone, Link as LinkIcon } from 'lucide-react';

interface ApplyModalProps {
  job: Job | null;
  profile: AccountProfile | null;
  onClose: () => void;
  onSuccess: (application: Application) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  profile,
  onClose,
  onSuccess,
}) => {
  const name = profile?.display_name || '';
  const email = profile?.email || '';
  const [phone, setPhone] = useState('');
  const [applicantRole, setApplicantRole] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          businessId: job.businessId,
          businessName: job.businessName,
          applicantName: name,
          applicantEmail: email,
          applicantPhone: phone,
          applicantRole: applicantRole,
          resumeSummary: resumeSummary,
          portfolioUrl: portfolioUrl,
          coverNote: coverNote,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        onSuccess(json.data);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        alert(json.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 border border-emerald-100 dark:border-slate-800 transition-colors">
        {/* Modal Header */}
        <div className="p-6 bg-emerald-800 dark:bg-emerald-950 text-white flex items-start justify-between border-b border-emerald-700/50">
          <div>
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>CareerLink Quick Apply</span>
            </div>
            <h2 className="text-xl font-black text-white">{job.title}</h2>
            <div className="flex items-center space-x-2 text-xs text-emerald-100 mt-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{job.businessName}</span>
              <span>•</span>
              <span>{job.salaryRange}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Submitted!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Your application has been delivered to <strong>{job.businessName}</strong>. You can monitor its review status in your DAPIT Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    readOnly
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    readOnly
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Background / Major</label>
                <input
                  type="text"
                  value={applicantRole}
                  onChange={(e) => setApplicantRole(e.target.value)}
                  placeholder="e.g. Sophomore Student, Barista, Designer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Resume Highlights & Relevant Experience</label>
              <textarea
                rows={3}
                required
                value={resumeSummary}
                onChange={(e) => setResumeSummary(e.target.value)}
                placeholder="Mention previous jobs, student projects, customer service skills, or coursework..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Portfolio / LinkedIn / GitHub Link (Optional)</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourname"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cover Note to Employer</label>
              <textarea
                rows={2}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Why are you excited about working with this local team? Include your weekly availability!"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting Application...' : 'Send Application to ' + job.businessName}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};






