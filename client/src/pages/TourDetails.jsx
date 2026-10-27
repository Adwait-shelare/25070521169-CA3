import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle2,
  XCircle,
  Calendar,
  ShieldCheck,
  Heart,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  Share2,
  ShoppingBag,
} from 'lucide-react';
import api from '../services/api';
import socket from '../services/socket';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import BookingModal from '../components/BookingModal';

const TourDetails = () => {
  const { id } = useParams();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openDay, setOpenDay] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookedSeatsState, setBookedSeatsState] = useState([]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tours/${id}`);
        if (res.data.success) {
          setTour(res.data.tour);
          setBookedSeatsState(res.data.tour.bookedSeats || []);
        }
      } catch (error) {
        console.error('[TourDetails] Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  // Live WebSocket sync
  useEffect(() => {
    const handleCapacityUpdate = (data) => {
      if (data.tourId === id) {
        setBookedSeatsState(data.bookedSeats || []);
      }
    };

    socket.on('tourCapacityUpdated', handleCapacityUpdate);
    return () => {
      socket.off('tourCapacityUpdated', handleCapacityUpdate);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3 mx-auto" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-slate-900">Tour Expedition Not Found</h2>
        <p className="text-xs text-slate-500">The requested package could not be retrieved.</p>
        <Link
          to="/tours"
          className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Return to All Expeditions
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(tour._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Breadcrumb & Share Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link
          to="/tours"
          className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Expeditions</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              addToast('Link copied to clipboard!', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            onClick={() => toggleWishlist(tour)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-colors ${wishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
            <span>{wishlisted ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Hero Title & Badges */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 border border-teal-500/20 uppercase tracking-wider">
            {tour.category}
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-4 h-4 text-teal-600" />
            {tour.destination}
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-4 h-4 text-teal-600" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <Users className="w-4 h-4 text-teal-600" />
            Max {tour.capacity} Guests
          </span>
          <span className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-current" />
            {tour.rating || 4.9} ({tour.reviewsCount || 20} Verified Reviews)
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900 leading-tight">
          {tour.title}
        </h1>
      </div>

      {/* Gallery Showcase */}
      <div className="space-y-4">
        <div className="aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-950 shadow-2xl relative">
          <img
            src={tour.images?.[activeImageIndex] || tour.images?.[0]}
            alt={tour.title}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Thumbnails Row */}
        {tour.images?.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {tour.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative rounded-xl overflow-hidden aspect-[4/3] w-24 shrink-0 border-2 transition-all ${activeImageIndex === idx
                  ? 'border-teal-500 ring-2 ring-teal-500/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout: Details Left + Booking Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">Expedition Overview</h2>
            <p className="text-sm text-slate-700 leading-relaxed font-light">{tour.overview}</p>

            {/* Live Climate & Seasonal Guide Widget */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50/70 to-slate-50 border border-teal-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  Best Time to Visit
                </span>
                <span className="font-bold text-slate-900">October – April (Prime Season)</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  Average Climate
                </span>
                <span className="font-bold text-slate-900">18°C – 26°C • Clear & Pleasant</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  Packing Guide
                </span>
                <span className="font-bold text-slate-900">Smart Casuals & Walking Shoes</span>
              </div>
            </div>

            {/* Bespoke Upgrades Available */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Bespoke Upgrades Available During Checkout:</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-amber-700 font-extrabold">
                  Optional Add-Ons
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-semibold text-slate-700">
                <span className="px-2 py-1 rounded-lg bg-white border border-amber-200">
                  🚁 Helicopter Tour
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-amber-200">
                  🕯️ Candlelight Dinner
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-amber-200">
                  📸 4K Photographer
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-amber-200">
                  🚘 VIP Limousine
                </span>
              </div>
            </div>
          </div>

          {/* Day-by-Day Itinerary Accordion */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center justify-between">
              <span>Day-by-Day Itinerary</span>
              <span className="text-xs font-sans font-semibold text-slate-400">
                {tour.itinerary?.length || 0} Days Planned
              </span>
            </h2>

            <div className="space-y-3">
              {tour.itinerary?.map((item) => {
                const isOpen = openDay === item.day;
                return (
                  <div
                    key={item.day}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setOpenDay(isOpen ? null : item.day)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-500/20">
                          Day {item.day}
                        </span>
                        <h4 className="font-serif font-bold text-slate-900 text-sm">
                          {item.title}
                        </h4>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 space-y-3 text-xs text-slate-600 border-t border-slate-100">
                        <p className="leading-relaxed">{item.description}</p>
                        <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-semibold text-slate-500">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100">
                            🍲 {item.meals}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-slate-100">
                            🏨 {item.accommodation}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-200">
            {/* Inclusions */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span>What Is Included</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {tour.inclusions?.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                <span>What Is Excluded</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {tour.exclusions?.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Traveler Reviews */}
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Verified Traveler Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tour.reviews?.map((r, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{r.user}</span>
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Floating Reservation Card */}
        <div className="sticky top-28 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-luxury space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Experience Price
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatPrice(tour.price)}
                </span>
                <span className="text-xs font-normal text-slate-500">/ person</span>
              </div>
              <div className="mt-2 p-2 rounded-xl bg-teal-50/80 border border-teal-200 text-[11px] text-teal-800 flex items-center justify-between font-semibold">
                <span>Or pay {formatPrice(Math.round(tour.price / 6))}/mo</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-600 text-white font-bold uppercase">
                  0% EMI
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold pt-2">
                <span>Accepts:</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">UPI</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Cards</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">NetBanking</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Pay Later</span>
              </div>
            </div>

            {/* Available Dates Preview */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Available Departures</span>
                <span className="text-[10px] font-normal text-teal-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live
                </span>
              </span>

              <div className="space-y-1.5">
                {tour.availableDates?.map((date) => {
                  const record = bookedSeatsState.find((b) => b.date === date);
                  const booked = record ? record.count : 0;
                  const remaining = Math.max(0, tour.capacity - booked);

                  return (
                    <div
                      key={date}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs border border-slate-100"
                    >
                      <span className="font-semibold text-slate-800">{date}</span>
                      <span
                        className={`text-[11px] font-bold ${remaining === 0 ? 'text-rose-500' : 'text-teal-600'
                          }`}
                      >
                        {remaining === 0 ? 'Sold Out' : `${remaining} seats left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-1">
              <Link
                to={`/checkout/${tour._id}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Instant Purchase & Checkout</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Quick Reserve (Pop-up Modal)</span>
              </button>
            </div>

            <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Simulated Instant Booking & Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal Injection */}
      <BookingModal
        tour={tour}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default TourDetails;
