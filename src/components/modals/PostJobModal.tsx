'use client';

import React, { useState } from 'react';
import { Job, Business } from '@/types';
import { X, Briefcase } from 'lucide-react';

interface PostJobModalProps {
  businesses: Business[];
  onClose: () => void;
  onSuccess: (job: Job) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  businesses,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState(businesses[0]?.id || 'biz-1');
  const [jobType, setJobType] = useState<Job['jobType']>('Part-time');
  const [workplaceType, setWorkplaceType] = useState<Job['workplaceType']>('On-site');
  const [salaryRange, setSalaryRange] = useState('$19.00 - $22.00 / hr');
  const [neighborhood, setNeighborhood] = useState('University District');
  const [location, setLocation] = useState('142 Elmwood Ave');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState(
    'Friendly attitude\nAvailable on weekends\nEnthusiastic about customer service'
  );
  const [benefits, setBenefits] = useState(
    'Flexible student schedule\nFree shift drinks\nTeam discounts'
  );
  const [deadline, setDeadline] = useState('2026-11-30');
  const [loading, setLoading] = useState(false);

  const selectedBiz = businesses.find((b) => b.id === selectedBusinessId) || businesses[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          businessId: selectedBiz.id,
          businessName: selectedBiz.name,
          businessLogo: selectedBiz.image,
          location: location || selectedBiz.address,
          neighborhood: neighborhood || selectedBiz.neighborhood,
          workplaceType,
          jobType,
          salaryRange,
          description,
          requirements: requirements.split('\n').filter(Boolean),
          benefits: benefits.split('\n').filter(Boolean),
          deadline,
        }),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess(json.data);
        onClose();
      } else {
        alert(json.error || 'Failed to post vacancy');
      }
    } catch (err) {
      console.error(err);
      alert('Error posting job vacancy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 border border-emerald-100 dark:border-slate-800 transition-colors">
        <div className="p-6 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-black text-white">Post a Job / Internship Vacancy</h2>
              <p className="text-xs text-emerald-100">Connect with students and local workers via CareerLink</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-slate-900 dark:text-white">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Your Business *</label>
            <select
              value={selectedBusinessId}
              onChange={(e) => {
                setSelectedBusinessId(e.target.value);
                const b = businesses.find((biz) => biz.id === e.target.value);
                if (b) {
                  setLocation(b.address);
                  setNeighborhood(b.neighborhood);
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.neighborhood})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Part-Time Weekend Barista"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Employment Type *</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as Job['jobType'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Part-time">Part-time (Great for Students)</option>
                <option value="Internship">Internship / Apprentice</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract / Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Workplace Type</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as Job['workplaceType'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Wage / Salary Range</label>
              <input
                type="text"
                placeholder="e.g. $18.50 - $22.00 / hr + Tips"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Description</label>
            <textarea
              rows={3}
              required
              placeholder="Describe the duties, team atmosphere, and what makes this role great for local applicants..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Requirements (1 per line)</label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Benefits & Perks (1 per line)</label>
              <textarea
                rows={3}
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Vacancy on CareerLink'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
