'use client';

import React, { useState } from 'react';
import { CommunityPost } from '@/types';
import { MessageSquare, Heart, Plus } from 'lucide-react';

interface CommunityFeedProps {
  posts: CommunityPost[];
  onOpenCreatePost: () => void;
  onPostLiked: (post: CommunityPost) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  onOpenCreatePost,
  onPostLiked,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Announcement', 'Collaboration', 'Local Recommendation', 'Question'];

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/${postId}/like`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setLikedPosts((prev) => ({ ...prev, [postId]: true }));
        onPostLiked(json.data);
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const categoryBadgeColors: Record<string, string> = {
    'Announcement': 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    'Collaboration': 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    'Local Recommendation': 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    'Question': 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  };

  return (
    <div className="space-y-6">
      {/* Category Filter and Post Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenCreatePost}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-emerald-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 p-6 shadow-xs hover:border-emerald-300 dark:hover:border-slate-700 transition-all"
          >
            {/* Author info */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-100 dark:border-slate-700"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{post.authorName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        categoryBadgeColors[post.category] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{post.authorRole} • {post.createdAt}</p>
                </div>
              </div>
            </div>

            {/* Post Title & Content */}
            <h4 className="mt-4 font-bold text-base text-slate-900 dark:text-white">{post.title}</h4>
            <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Reactions Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1.5 font-semibold transition-colors ${
                  likedPosts[post.id]
                    ? 'text-rose-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${likedPosts[post.id] ? 'fill-rose-500 text-rose-500' : ''}`}
                />
                <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
              </button>

              <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
                <MessageSquare className="w-4 h-4" />
                <span>{post.commentsCount} Comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
