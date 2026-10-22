'use client';

import React, { useState } from 'react';
import { Business } from '@/types';
import { BusinessCard } from '@/components/BusinessCard';
import {
  Store,
  MapPin,
  Star,
  Briefcase,
  CheckCircle2,
  Grid3X3,
  List,
  Search,
  Sparkles,
} from 'lucide-react';

interface LocalLensSectionProps {
  businesses: Business[];
  onSelectBusiness: (business: Business) => void;
  onOpenRegister: () => void;
}

export const LocalLensSection: React.FC<LocalLensSectionProps> = ({
  businesses,
  onSelectBusiness,
  onOpenRegister,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('All');
  const [hiringOnly, setHiringOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState<string>('');

  const categories = [
    'All',
    'Café & Dining',
    'Retail & Goods',
    'Tech & Innovation',
    'Services & Trades',
    'Arts & Culture',
    'Wellness & Fitness',
  ];

  const neighborhoods = [
    'All',
    'University District',
    'Tech Corridor',
    'Downtown Arts Quarter',
    'Riverfront',
    'Old Town',
  ];

  // Filtering
  const filtered = businesses.filter((b) => {
    const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchNeigh = selectedNeighborhood === 'All' || b.neighborhood === selectedNeighborhood;
    const matchHiring = !hiringOnly || b.hiringActive;
    const matchVerified = !verifiedOnly || b.isVerified;
    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.tagline.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchCat && matchNeigh && matchHiring && matchVerified && matchSearch;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-4">
      {/* Editorial Header Banner (Apple & LinkedIn Cozy Aesthetic) */}
      <div className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#057642] dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/80 dark:border-emerald-800/60">
              <Store className="w-3.5 h-3.5" />
              <span>LocalLens Business Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Neighborhood Businesses & Services
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Support local establishments, discover single-origin cafes, and explore shops actively hiring local talent.
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="px-4 py-2 bg-[#057642] hover:bg-[#046237] text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 active:scale-95"
          >
            + Register Your Business
          </button>
        </div>
      </div>

      {/* Filter Console */}
      <div className="bg-white dark:bg-[#20262e] rounded-2xl p-4 border border-[#e8e6df] dark:border-[#2e3742] shadow-xs space-y-3">
        {/* Row 1: Search & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business name, specialty, or tags..."
              className="site-search w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* District Selector */}
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n === 'All' ? 'All Districts' : n}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'name')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="name">Alphabetical</option>
            </select>

            {/* Hiring Filter Chip */}
            <button
              onClick={() => setHiringOnly(!hiringOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                hiringOnly
                  ? 'bg-[#057642] text-white border-[#057642]'
                  : 'bg-[#f4f2ee] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Hiring Now
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-[#f4f2ee] dark:bg-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-[#057642] dark:text-emerald-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-[#057642] dark:text-emerald-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#f0eee6] dark:border-[#2e3742]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#057642] text-white shadow-xs'
                  : 'bg-[#f4f2ee] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Business Cards Display (Grid vs List) */}
      {sorted.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742]">
          <Store className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">No businesses found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your category or district filter.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              onSelect={onSelectBusiness}
            />
          ))}
        </div>
      ) : (
        /* Compact Professional List View */
        <div className="space-y-3">
          {sorted.map((biz) => (
            <div
              key={biz.id}
              onClick={() => onSelectBusiness(biz)}
              className="bg-white dark:bg-[#20262e] rounded-2xl border border-[#e8e6df] dark:border-[#2e3742] p-4 shadow-xs hover:border-[#057642] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3.5">
                <img
                  src={biz.image}
                  alt={biz.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#e8e6df] dark:border-[#2e3742]"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm hover:text-[#057642] transition-colors">
                      {biz.name}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#057642] shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{biz.tagline}</p>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1.5">
                    <span>{biz.address} ({biz.neighborhood})</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{biz.rating} ({biz.reviewsCount})</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {biz.hiringActive && (
                  <span className="text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-[#057642] dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    Hiring: {biz.activeJobsCount}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBusiness(biz);
                  }}
                  className="px-3.5 py-1.5 bg-[#057642] hover:bg-[#046237] text-white font-bold text-xs rounded-full transition-all"
                >
                  View Shop
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
