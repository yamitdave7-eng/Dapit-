'use client';

import React, { useState } from 'react';
import { Event, Business } from '@/types';
import { X, Calendar } from 'lucide-react';

interface HostEventModalProps {
  businesses: Business[];
  onClose: () => void;
  onSuccess: (event: Event) => void;
}

export const HostEventModal: React.FC<HostEventModalProps> = ({
  businesses,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState(businesses[0]?.id || 'biz-1');
  const [date, setDate] = useState('2026-11-12');
  const [time, setTime] = useState('5:00 PM - 7:00 PM');
  const [category, setCategory] = useState<Event['category']>('Workshop');
  const [location, setLocation] = useState('142 Elmwood Ave (Patio)');
  const [neighborhood, setNeighborhood] = useState('University District');
  const [price, setPrice] = useState('Free Admission');
  const [capacity, setCapacity] = useState('40');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
  );
  const [loading, setLoading] = useState(false);

  const selectedBiz = businesses.find((b) => b.id === selectedBusinessId) || businesses[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          businessId: selectedBiz.id,
          businessName: selectedBiz.name,
          businessImage: selectedBiz.image,
          date,
          time,
          category,
          location: location || selectedBiz.address,
          neighborhood: neighborhood || selectedBiz.neighborhood,
          price,
          capacity: Number(capacity) || 40,
          description,
          image,
        }),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess(json.data);
        onClose();
      } else {
        alert(json.error || 'Failed to host event');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 border border-emerald-100 dark:border-slate-800 transition-colors">
        <div className="p-6 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-black text-white">Host a Community Event / Workshop</h2>
              <p className="text-xs text-teal-100">Engage local residents and students on LocalLens</p>
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Host Business or Group *</label>
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
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Latte Art Workshop & Community Tasting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time Range</label>
              <input
                type="text"
                placeholder="e.g. 3:00 PM - 5:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Event['category'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Workshop">Workshop</option>
                <option value="Networking">Networking</option>
                <option value="Social & Meetup">Social & Meetup</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Career Fair">Career Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ticket / Admission Price</label>
              <input
                type="text"
                placeholder="e.g. Free (RSVP required)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Venue Location</label>
            <input
              type="text"
              placeholder="e.g. 142 Elmwood Ave (Patio Area)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              required
              placeholder="What will attendees learn, experience, or do? What should they bring?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-teal-700/20 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Event on LocalLens'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
