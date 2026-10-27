import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Compass, Clock, ArrowRight } from 'lucide-react';

const SearchBar = ({ initialKeyword = '', initialCategory = 'All', initialDuration = 'all' }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [duration, setDuration] = useState(initialDuration);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (category && category !== 'All') params.set('category', category);
    if (duration && duration !== 'all') params.set('duration', duration);

    navigate(`/tours?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-luxury border border-white/60 max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center"
    >
      {/* Destination / Keyword Input */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-500/50 transition-colors">
        <MapPin className="w-5 h-5 text-teal-600 shrink-0" />
        <div className="w-full">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Destination / Keyword
          </label>
          <input
            type="text"
            placeholder="Goa, Kashmir, Bali, Alps..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-500/50 transition-colors">
        <Compass className="w-5 h-5 text-teal-600 shrink-0" />
        <div className="w-full">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Theme / Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Beach">Beach & Coastal</option>
            <option value="Mountain">Mountain & Alpine</option>
            <option value="Heritage">Heritage & Culture</option>
            <option value="Adventure">Adventure & High Passes</option>
            <option value="Honeymoon">Romantic & Honeymoon</option>
            <option value="Luxury">Ultra Luxury & Cruises</option>
            <option value="Spiritual">Spiritual & Sacred Trails</option>
          </select>
        </div>
      </div>

      {/* Duration Dropdown */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-500/50 transition-colors">
        <Clock className="w-5 h-5 text-teal-600 shrink-0" />
        <div className="w-full">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Trip Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="all">Any Duration</option>
            <option value="short">Short (1 - 4 Days)</option>
            <option value="medium">Medium (5 - 7 Days)</option>
            <option value="long">Grand (8+ Days)</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full h-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-teal-600 hover:to-teal-500 text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
      >
        <Search className="w-4 h-4" />
        <span>Find Expeditions</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
};

export default SearchBar;
