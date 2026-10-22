'use client';

import React, { useState } from 'react';
import { CommunityPost, UserRole } from '@/types';
import { X, MessageSquare } from 'lucide-react';

interface CreatePostModalProps {
  userRole: UserRole;
  onClose: () => void;
  onSuccess: (post: CommunityPost) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  userRole,
  onClose,
  onSuccess,
}) => {
  const defaultAuthor =
    userRole === 'business_owner'
      ? 'Elena Rostova'
      : userRole === 'student'
      ? 'Marcus Tan'
      : 'Sarah Jenkins';

  const defaultRole =
    userRole === 'business_owner'
      ? 'Owner @ Artisan Roastery & Café'
      : userRole === 'student'
      ? 'Student @ City University'
      : 'Local Resident & Volunteer';

  const [authorName, setAuthorName] = useState(defaultAuthor);
  const [authorRole, setAuthorRole] = useState(defaultRole);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CommunityPost['category']>('Announcement');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('Community, LocalNews');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          authorName,
          authorRole,
          category,
          tags: tags.split(',').map((t) => t.trim()),
        }),
      });

      const json = await res.json();
      if (json.success) {
        onSuccess(json.data);
        onClose();
      } else {
        alert(json.error || 'Failed to publish post');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 border border-emerald-100 dark:border-slate-800 transition-colors">
        <div className="p-6 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-black text-white">Share a Community Update</h2>
              <p className="text-xs text-emerald-100">Post announcements, questions, or collaboration invites</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CommunityPost['category'])}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Announcement">Announcement</option>
              <option value="Collaboration">Collaboration / Study Group</option>
              <option value="Local Recommendation">Local Recommendation</option>
              <option value="Question">Community Question</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Topic / Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Weekend study session at Artisan Roastery"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Content *</label>
            <textarea
              rows={4}
              required
              placeholder="Share details, questions, or invitations with your neighbors..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-700/20 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Share with Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
