import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Heart,
  User,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  ArrowRight,
  Shield,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';
import TourCard from '../components/TourCard';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const { wishlistTours, wishlistCount } = useWishlist();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'upcoming';

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: '',
  });

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error('[Dashboard] Fetch error:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelReservation = async () => {
    if (!cancelModalBooking) return;
    try {
      setCancelling(true);
      const res = await api.patch(`/bookings/${cancelModalBooking._id}/cancel`);
      if (res.data.success) {
        addToast('Reservation cancelled and departure seats restored to capacity!', 'success');
        setCancelModalBooking(null);
        fetchBookings();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to cancel booking.';
      addToast(msg, 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const data = { name: profileForm.name, phone: profileForm.phone };
    if (profileForm.password.trim()) data.password = profileForm.password;
    await updateProfile(data);
    setProfileForm((prev) => ({ ...prev, password: '' }));
  };

  const upcomingBookings = bookings.filter((b) => b.status === 'Confirmed');
  const pastBookings = bookings.filter((b) => b.status === 'Cancelled' || b.status === 'Completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* User Welcome Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
              Traveler Portfolio
            </span>
            {user?.role === 'admin' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <p className="text-2xl font-serif font-bold text-teal-400">{upcomingBookings.length}</p>
            <p className="text-[11px] text-slate-400 font-medium">Confirmed Trips</p>
          </div>
          <div>
            <p className="text-2xl font-serif font-bold text-amber-400">{wishlistCount}</p>
            <p className="text-[11px] text-slate-400 font-medium">Saved Expeditions</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setSearchParams({ tab: 'upcoming' })}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'upcoming'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Confirmed Departures ({upcomingBookings.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'wishlist' })}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'wishlist'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistCount})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'past' })}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'past'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Past & Cancelled ({pastBookings.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'profile' })}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: Confirmed Bookings */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {loadingBookings ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-40 bg-slate-200 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {upcomingBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-teal-500/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <img
                      src={
                        b.tourId?.images?.[0] ||
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'
                      }
                      alt={b.tourId?.title || 'Tour'}
                      className="w-28 h-28 rounded-2xl object-cover shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {b.bookingReference}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          Confirmed
                        </span>
                      </div>
                      <Link
                        to={`/tours/${b.tourId?._id}`}
                        className="text-lg font-serif font-bold text-slate-900 hover:text-teal-600 transition-colors block"
                      >
                        {b.tourId?.title || 'Expedition Package'}
                      </Link>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          Departure: <strong className="text-slate-700">{b.travelDate}</strong>
                        </span>
                        <span>
                          Travelers: <strong className="text-slate-700">{b.travelers} Guest(s)</strong>
                        </span>
                        <span>
                          Total:{' '}
                          <strong className="text-slate-900 font-bold">
                            {formatPrice(b.totalPrice)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                      title="Print ticket voucher"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Voucher</span>
                    </button>
                    <button
                      onClick={() => setCancelModalBooking(b)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors border border-rose-200"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-slate-800">
                No active departures reserved
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't reserved an expedition yet. Explore our curated catalog to book your
                next luxury journey.
              </p>
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-teal-600 transition-colors"
              >
                <span>Browse Expeditions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistTours.map((tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-slate-800">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-slate-500">
                Click the heart icon on any expedition card to save it for later.
              </p>
              <Link
                to="/tours"
                className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-teal-600 transition-colors"
              >
                Discover Expeditions
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Past & Cancelled */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastBookings.length > 0 ? (
            pastBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{b.bookingReference}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-700">
                      Cancelled & Capacity Restored
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-slate-900">{b.tourId?.title}</h4>
                  <p className="text-xs text-slate-500">
                    Travel Date: {b.travelDate} • {b.travelers} Guest(s) •{' '}
                    {formatPrice(b.totalPrice)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
              No cancelled or past reservations.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
          <h2 className="text-xl font-serif font-bold text-slate-900">Personal Account Details</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Email Address (Read Only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Change Password (Leave blank to keep current)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={profileForm.password}
                onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                Cancel Reservation?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cancelling will release your reserved seats ({cancelModalBooking.travelers} seats)
                back to the tour departure date availability in MongoDB.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
              <p className="font-semibold text-slate-800">{cancelModalBooking.tourId?.title}</p>
              <p className="text-slate-500">
                Ref: {cancelModalBooking.bookingReference} • Date: {cancelModalBooking.travelDate}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelReservation}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
