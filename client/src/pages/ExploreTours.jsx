import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, Compass, MapPin, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import TourCard from '../components/TourCard';

const categories = [
  'All',
  'Beach',
  'Mountain',
  'Heritage',
  'Adventure',
  'Honeymoon',
  'Luxury',
  'Spiritual',
];

const ExploreTours = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [duration, setDuration] = useState(searchParams.get('duration') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
    setDuration(searchParams.get('duration') || 'all');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Fetch tours with filters
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (keyword.trim()) params.set('keyword', keyword.trim());
        if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
        if (duration && duration !== 'all') params.set('duration', duration);
        if (sort) params.set('sort', sort);

        const res = await api.get(`/tours?${params.toString()}`);
        if (res.data.success) {
          setTours(res.data.tours);
        }
      } catch (error) {
        console.error('[ExploreTours] Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [keyword, selectedCategory, duration, sort]);

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === 'All' || v === 'all') {
        updated.delete(k);
      } else {
        updated.set(k, v);
      }
    });
    setSearchParams(updated);
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedCategory('All');
    setDuration('all');
    setSort('newest');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
          Curated Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900">
          Discover All Expeditions
        </h1>
        <p className="text-sm text-slate-600">
          Browse our handpicked journeys across India and global destinations. Filter by theme,
          duration, or price to find your perfect itinerary.
        </p>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-5">
        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by destination (Goa, Kashmir, Bali) or keywords..."
              value={keyword}
              onChange={(e) => updateFilters({ keyword: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Duration Selector */}
            <select
              value={duration}
              onChange={(e) => updateFilters({ duration: e.target.value })}
              className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Any Duration</option>
              <option value="short">1 - 4 Days</option>
              <option value="medium">5 - 7 Days</option>
              <option value="long">8+ Days</option>
            </select>

            {/* Sort Selector */}
            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Reset Button */}
            {(keyword || selectedCategory !== 'All' || duration !== 'all' || sort !== 'newest') && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2">
            Categories:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => updateFilters({ category: cat })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <p>
          Showing <span className="font-bold text-slate-900">{tours.length}</span> curated
          expeditions
        </p>
      </div>

      {/* Tours Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-3xl bg-slate-200 aspect-[4/5] animate-pulse" />
          ))}
        </div>
      ) : tours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900">
            No expeditions matched your criteria
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your search terms, selecting "All Categories", or widening your duration
            filter.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-teal-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreTours;
