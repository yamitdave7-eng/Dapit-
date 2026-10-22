'use client';

import React, { useState } from 'react';
import { Business } from '@/types';
import { X, Store } from 'lucide-react';

interface RegisterBusinessModalProps {
  onClose: () => void;
  onSuccess: (business: Business) => void;
}

export const RegisterBusinessModal: React.FC<RegisterBusinessModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Business['category']>('Café & Dining');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('University District');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [openHours, setOpenHours] = useState('Mon-Sat: 8:00 AM - 7:00 PM');
  const [tags, setTags] = useState('Local, Community, Eco-friendly');
  const [hiringActive, setHiringActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          tagline,
          description,
          address,
          neighborhood,
          phone,
          email,
          website,
          openHours,
          tags: tags.split(',').map((t) => t.trim()),
          hiringActive,
        }),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess(json.data);
        onClose();
      } else {
        alert(json.error || 'Failed to register business');
      }
    } catch (err) {
      console.error(err);
      alert('Error registering business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 border border-emerald-100 dark:border-slate-800 transition-colors">
        <div className="p-6 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-black text-white">Register Your Local Business</h2>
              <p className="text-xs text-emerald-100">List on LocalLens to promote services, host events & hire local talent</p>
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Maple Leaf Bakery & Books"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Business['category'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Café & Dining">Café & Dining</option>
                <option value="Retail & Goods">Retail & Goods</option>
                <option value="Tech & Innovation">Tech & Innovation</option>
                <option value="Services & Trades">Services & Trades</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Wellness & Fitness">Wellness & Fitness</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Neighborhood *</label>
              <input
                type="text"
                required
                placeholder="e.g. University District"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Street Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. 520 University Way"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Short Tagline</label>
            <input
              type="text"
              placeholder="One line explaining what makes your shop special"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Description</label>
            <textarea
              rows={2}
              placeholder="Tell neighborhood residents and students about your story and offerings..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="contact@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Opening Hours</label>
              <input
                type="text"
                placeholder="Mon-Sun: 8am - 8pm"
                value={openHours}
                onChange={(e) => setOpenHours(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="Organic, Study Friendly, WiFi"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="hiring"
              checked={hiringActive}
              onChange={(e) => setHiringActive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <label htmlFor="hiring" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              We are actively hiring workers (Display &quot;Hiring&quot; badge on directory)
            </label>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Business on DAPIT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
