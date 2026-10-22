'use client';

import React, { useState } from 'react';
import { TalentProfile } from '@/types';
import { X, Users } from 'lucide-react';

interface JoinTalentModalProps {
  onClose: () => void;
  onSuccess: (talent: TalentProfile) => void;
}

export const JoinTalentModal: React.FC<JoinTalentModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<TalentProfile['role']>('Student');
  const [title, setTitle] = useState('');
  const [universityOrOrg, setUniversityOrOrg] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('Customer Service, Communication, Teamwork');
  const [lookingFor, setLookingFor] = useState('Part-time Barista, Retail, Internship');
  const [contactEmail, setContactEmail] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          title,
          universityOrOrg,
          bio,
          skills: skills.split(',').map((s) => s.trim()),
          lookingFor: lookingFor.split(',').map((l) => l.trim()),
          contactEmail,
          portfolioUrl,
          isAvailable: true,
        }),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess(json.data);
        onClose();
      } else {
        alert(json.error || 'Failed to join talent network');
      }
    } catch (err) {
      console.error(err);
      alert('Error joining talent network');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 border border-emerald-100 dark:border-slate-800 transition-colors">
        <div className="p-6 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-300" />
            <div>
              <h2 className="text-lg font-black text-white">Join DAPIT Talent Network</h2>
              <p className="text-xs text-emerald-100">Showcase your skills to neighborhood businesses & employers</p>
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as TalentProfile['role'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Student">Student</option>
                <option value="Recent Graduate">Recent Graduate</option>
                <option value="Local Freelancer">Local Freelancer</option>
                <option value="Career Changer">Career Changer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">School / Organization</label>
              <input
                type="text"
                placeholder="e.g. City University"
                value={universityOrOrg}
                onChange={(e) => setUniversityOrOrg(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Professional Headline / Major *</label>
            <input
              type="text"
              required
              placeholder="e.g. Business Major | Seeking Barista & Customer Service Roles"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Brief Bio</label>
            <textarea
              rows={2}
              placeholder="Briefly describe your passions, reliability, and what you enjoy doing..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Roles You Are Looking For (comma separated)</label>
            <input
              type="text"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Email *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Portfolio / LinkedIn Link</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Create Public Talent Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
