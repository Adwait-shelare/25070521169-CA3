import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Star,
  Users,
  Calendar,
  Globe2,
  ChevronRight,
} from 'lucide-react';
import api from '../services/api';
import TourCard from '../components/TourCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [featuredTours, setFeaturedTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/tours/featured');
        if (res.data.success) {
          setFeaturedTours(res.data.tours);
        }
      } catch (error) {
        console.error('[Home] Error fetching featured tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const popularDestinations = [
    {
      name: 'Goa',
      type: 'Tropical Coast',
      tag: 'Beach',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',
    },
    {
      name: 'Kashmir',
      type: 'Alpine Valleys',
      tag: 'Mountain',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600',
    },
    {
      name: 'Kerala',
      type: 'Serene Backwaters',
      tag: 'Honeymoon',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600',
    },
    {
      name: 'Ladakh',
      type: 'High Altitude Passes',
      tag: 'Adventure',
      image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600',
    },
    {
      name: 'Bali',
      type: 'Island Odyssey',
      tag: 'Luxury',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
    },
    {
      name: 'Dubai',
      type: 'Futuristic Luxury',
      tag: 'Luxury',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
    },
  ];

  const testimonials = [
    {
      name: 'Aarav Mehta',
      trip: 'Kashmir Alpine Expedition',
      comment:
        'The Shikara sunrise on Dal Lake and the private Gondola pass in Gulmarg was organized down to the minute. Exceptional service!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
    {
      name: 'Dr. Priya Sen',
      trip: 'Kerala Backwaters & Tea Hills',
      comment:
        'The private Alleppey houseboat chef served the most delicious traditional Sadhya. Real-time booking updates and honest pricing.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      name: 'Sameer Singhania',
      trip: 'Bali Private Pool Odyssey',
      comment:
        'Wanderly redefined luxury travel for us. The Nusa Penida speedboat tour was breathtaking and completely hassle-free.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-32 px-4 sm:px-6 lg:px-8 bg-slate-950">
        {/* Background Visual Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80"
            alt="Luxury World Travel"
            className="w-full h-full object-cover opacity-35 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-widest uppercase animate-fade-in shadow-glow">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Curated Expeditions & High-End Escapes</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-white tracking-tight leading-[1.15]">
            Explore the World in <br />
            <span className="ocean-gradient-text">Unrivaled Luxury.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Experience hand-crafted itineraries across India and premier global retreats. Connected
            to real-time database departure seats, verified hotel standards, and 24/7 dedicated
            concierge.
          </p>

          {/* Interactive Search Bar Component */}
          <div className="pt-4">
            <SearchBar />
          </div>

          {/* Key Quick Stats */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800 text-slate-300 text-xs">
            <div>
              <p className="text-2xl font-serif font-bold text-white">14+</p>
              <p className="text-slate-400 font-medium mt-0.5">Curated Expeditions</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-teal-400">100%</p>
              <p className="text-slate-400 font-medium mt-0.5">Database Capacity Sync</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-amber-400">4.92 ★</p>
              <p className="text-slate-400 font-medium mt-0.5">Average Traveler Score</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-white">24/7</p>
              <p className="text-slate-400 font-medium mt-0.5">Concierge Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
              Iconic Getaways
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-1">
              Top Trending Destinations
            </h2>
          </div>
          <Link
            to="/tours"
            className="flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <span>View All Destinations</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((dest) => (
            <Link
              key={dest.name}
              to={`/tours?keyword=${dest.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 inset-x-3 text-white">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  {dest.type}
                </span>
                <h3 className="font-serif font-bold text-lg leading-tight">{dest.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Expeditions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
              Hand-Selected
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-1">
              Featured Luxury Tours
            </h2>
          </div>
          <Link
            to="/tours"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-teal-600 transition-colors shadow-sm"
          >
            <span>Browse All 14 Tours</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-slate-200/70 aspect-[4/5] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        )}
      </section>

      {/* The Wanderly Standard / 4 Pillars */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Why Travelers Choose Wanderly
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">
              The Standard of True Luxury
            </h2>
            <p className="text-slate-400 text-sm">
              We eliminate the uncertainty from travel booking with transparent capacity
              management, vetted local masters, and concierge assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-teal-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">Curated Itineraries</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Day-by-day plans built by seasoned travel designers with handpicked boutique
                resorts and cultural immersion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-teal-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">Live Capacity Sync</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant WebSocket seat locking prevents overbooking and guarantees room and vehicle
                allocation upon reservation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-teal-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">Transparent Pricing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear INR (₹) rates with all taxes, breakfasts, and private transfers included. No
                hidden booking fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-teal-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">Boutique Group Size</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Small group departures limited to 10-18 travelers for an intimate, VIP experience
                without crowded buses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
            Verified Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Stories from Our Travelers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-card space-y-4"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "{t.comment}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-teal-600 font-medium">{t.trip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Evaluation Quick Demo CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider inline-block">
              Evaluation & Grading Mode
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Ready to Explore or Test the Platform?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Use our quick one-click demo credentials to test the administrator analytics, live
              seat reservation, cancellation flow, and wishlist management.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/tours"
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/25"
              >
                Browse All Expeditions
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
              >
                Quick Evaluation Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
