import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Heart, ArrowUpRight, Users, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

const TourCard = ({ tour }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const wishlisted = isWishlisted(tour._id);

  const categoryColors = {
    Beach: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
    Mountain: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    Heritage: 'bg-amber-500/10 text-amber-700 border-amber-200',
    Adventure: 'bg-orange-500/10 text-orange-700 border-orange-200',
    Honeymoon: 'bg-rose-500/10 text-rose-700 border-rose-200',
    Luxury: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    Spiritual: 'bg-purple-500/10 text-purple-700 border-purple-200',
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-luxury-hover hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between">
      {/* Tour Image & Badges Header */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={tour.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        {/* Top Floating Row: Category & Wishlist */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
              categoryColors[tour.category] || 'bg-white/90 text-slate-800 border-white/50'
            }`}
          >
            {tour.category}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(tour);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              wishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
            title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Floating Row: Destination & Rating */}
        <div className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between text-white text-xs font-semibold">
          <span className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            {tour.destination}
          </span>

          <span className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {tour.rating || 4.9}
            <span className="text-slate-300 font-normal">({tour.reviewsCount || 18})</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {tour.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Max {tour.capacity || 15} Guests
            </span>
          </div>

          <Link to={`/tours/${tour._id}`}>
            <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
              {tour.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {tour.overview}
          </p>
        </div>

        {/* Card Footer: Price & Quick CTA Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">
              Starting From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                {formatPrice(tour.price)}
              </span>
              <span className="text-xs font-normal text-slate-500">/ person</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/tours/${tour._id}`}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all duration-200"
              title="View Itinerary & Highlights"
            >
              Details
            </Link>
            <Link
              to={`/checkout/${tour._id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-300 group/btn"
              title="Instant Purchase / Booking"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
